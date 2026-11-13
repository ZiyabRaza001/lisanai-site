import { useEffect, useRef, useState } from 'react'
import { track } from '@vercel/analytics/react'
import './Hero.css'
import { getAudienceVariant } from '../lib/audience'
import { waLink } from '../lib/whatsapp'

const chatMessages = [
  { from: 'user', text: 'hiya fi al bayt' },
  { from: 'bot', text: 'Close! 😊 After a preposition, the noun takes the -i ending → البيتِ, not البيت.\nSo: هي في البيتِ ✅' },
  { from: 'user', text: 'so it changes bc of "fi", not bc its feminine?' },
  { from: 'bot', text: 'Exactly right! 👏 The -i ending comes from the preposition — gender only decides هو vs هي.' },
  { from: 'user', text: 'ayna as-saaAtu? hiya alaa as-sareer' },
  { from: 'bot', text: 'Almost — على gives -i too: السريرِ, not السرير.\nممتاز otherwise! 🎉' },
]

// Headline-only A/B copy — everything else on the page (Demo, Features, FAQ,
// etc.) stays identical for both. Link a "quran" audience ad to
// "?v=quran" to serve this instead of the default headline.
const COPY = {
  default: {
    badge: 'Learn Arabic on WhatsApp',
    titleLine1: 'Your personal Arabic tutor —',
    titleAccent: 'right in WhatsApp.',
    subtitle:
      'Learn Arabic step-by-step through real conversations, structured lessons, and voice ' +
      'messages — no app to download, no login to remember.',
  },
  quran: {
    badge: 'Learn Arabic on WhatsApp',
    titleLine1: 'Learn Arabic.',
    titleAccent: 'Understand more.',
    subtitle:
      "Learn Arabic step-by-step to better understand the Qur'an, communicate with confidence, " +
      'and build a real foundation — all through WhatsApp.',
  },
}

// Scroll-scrubbed intro: a distant mosque, approached as you scroll, its
// doors swinging open to reveal your tutor waiting inside. Pure CSS/SVG +
// real CSS 3D transforms for the door hinge and camera-push feel — no WebGL,
// no 3D model files. Defaults to the fully-revealed end state (see Hero.css
// custom-property defaults) so content is never gated behind JS running —
// the scroll listener below is a progressive enhancement on top of that.
//
// Stage windows, all within one raw scroll progress 0→1 across the pinned
// section: approach (mosque grows) -> doors (swing open on their hinges) ->
// inside (small phone-on-stand fades in) -> zoom (push further in) ->
// content (the real Hero content cross-fades in over the scene, which fades
// out behind it).
const STAGES = {
  dist: [0, 0.28],
  door: [0.22, 0.52],
  inside: [0.4, 0.6],
  zoom: [0.52, 0.86],
  content: [0.78, 1],
}

// `sectionRef` is the tall outer section (its height defines how much
// scroll distance the whole sequence takes). `pinRef` is the sticky inner
// box — custom properties are written there, one level above both the
// scene and the real content, so both inherit the same live values (a
// custom property set via style.setProperty only cascades to descendants
// of the element it's set on, not to siblings).
function useScrollScene(sectionRef, pinRef) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const stage = (p, [start, end]) => Math.min(Math.max((p - start) / (end - start), 0), 1)

    let rafId = null
    const update = () => {
      rafId = null
      const section = sectionRef.current
      const pin = pinRef.current
      if (!section || !pin) return

      const scrollDistance = section.offsetHeight - window.innerHeight
      const rect = section.getBoundingClientRect()
      const raw = scrollDistance > 0 ? -rect.top / scrollDistance : 1
      const p = Math.min(Math.max(raw, 0), 1)

      pin.style.setProperty('--p-dist', stage(p, STAGES.dist))
      pin.style.setProperty('--p-door', stage(p, STAGES.door))
      pin.style.setProperty('--p-inside', stage(p, STAGES.inside))
      pin.style.setProperty('--p-zoom', stage(p, STAGES.zoom))
      pin.style.setProperty('--p-content', stage(p, STAGES.content))
    }

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [sectionRef, pinRef])
}

export default function Hero() {
  const [variant] = useState(getAudienceVariant)
  const copy = COPY[variant]
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  useScrollScene(sectionRef, pinRef)

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__pin" ref={pinRef}>
        <div className="hero__scene" aria-hidden="true">
          <div className="hero__sky">
            <div className="hero__sun" />
          </div>
          <div className="hero__ground" />

          <div className="hero__mosque">
            <svg className="hero__mosque-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax meet">
              <ellipse className="hero__m-domeglow" cx="400" cy="140" rx="150" ry="40" />
              <rect className="hero__m-body" x="220" y="260" width="360" height="300" />
              <rect className="hero__m-minaret" x="130" y="160" width="34" height="400" />
              <rect className="hero__m-minaret" x="636" y="160" width="34" height="400" />
              <path className="hero__m-minaret-cap" d="M130 160 Q147 110 164 160 Z" />
              <path className="hero__m-minaret-cap" d="M636 160 Q653 110 670 160 Z" />
              <rect className="hero__m-minaret-top" x="140" y="130" width="14" height="30" />
              <rect className="hero__m-minaret-top" x="646" y="130" width="14" height="30" />
              <path className="hero__m-parapet" d="M220 260 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 q20 -26 40 0 Z" />
              <path className="hero__m-dome" d="M330 260 Q330 150 400 90 Q470 150 470 260 Z" />
              <rect className="hero__m-finial" x="396" y="60" width="8" height="34" />
              <circle className="hero__m-finial-tip" cx="400" cy="58" r="8" />
              <path className="hero__m-arch" d="M320 560 L320 400 Q320 330 400 330 Q480 330 480 400 L480 560 Z" />
            </svg>

            <div className="hero__interior">
              <svg className="hero__interior-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMax meet">
                <path className="hero__i-arch" d="M300 600 L300 380 Q300 300 400 300 Q500 300 500 380 L500 600 Z" />
                <ellipse className="hero__i-rug" cx="400" cy="560" rx="90" ry="16" />
              </svg>
              <div className="hero__stand">
                <div className="hero__mini-phone" />
              </div>
            </div>

            <div className="hero__door hero__door--left" />
            <div className="hero__door hero__door--right" />
          </div>

          <div className="hero__pattern" />
        </div>

        <div className="container hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="currentColor"/>
              </svg>
              {copy.badge}
            </div>

            <h1 className="hero__title">
              {copy.titleLine1}<br />
              <span className="hero__title-accent">{copy.titleAccent}</span>
            </h1>

            <p className="hero__subtitle">
              {copy.subtitle}
            </p>

            <div className="hero__capabilities">
              {[
                { icon: '📖', label: 'Guided lessons' },
                { icon: '🎙️', label: 'Voice notes' },
                { icon: '🔡', label: 'Understands transliteration' },
                { icon: '💬', label: 'Free chat practice' },
                { icon: '✅', label: 'Precise corrections' },
                { icon: '📈', label: 'Progress tracking' },
              ].map((c) => (
                <span key={c.label} className="hero__cap">
                  {c.icon} {c.label}
                </span>
              ))}
            </div>

            <div className="hero__cta-group">
              <div className="hero__actions">
                <a
                  href={waLink('start')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg hero__cta-main"
                  onClick={() => track('cta_click', { location: 'hero' })}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white"/>
                  </svg>
                  Try It Free
                </a>
                <button className="btn btn-ghost" onClick={() => scrollTo('#demo')}>
                  Watch demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <p className="hero__reassurance">100% free · No card · No catch</p>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__phone animate-float">
              <div className="hero__phone-notch" />
              <div className="hero__phone-screen">
                <div className="hero__wa-header">
                  <div className="hero__wa-back">←</div>
                  <div className="hero__wa-avatar">🕌</div>
                  <div className="hero__wa-info">
                    <div className="hero__wa-name">LisanAI Tutor</div>
                    <div className="hero__wa-status">● online</div>
                  </div>
                </div>

                <div className="hero__wa-chat">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`hero__wa-msg hero__wa-msg--${msg.from}`}
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      <div className="hero__wa-bubble">
                        {msg.text.split('\n').map((line, j) => (
                          <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br />}</span>
                        ))}
                        <span className="hero__wa-time">
                          {['10:32','10:32','10:33','10:33','10:34','10:34'][i]}
                          {msg.from === 'user' && ' ✓✓'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hero__wa-input">
                  <span className="hero__wa-placeholder">Type a message...</span>
                  <div className="hero__wa-send">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero__stat hero__stat--1">
              <div className="hero__stat-icon">🎙️</div>
              <div>
                <div className="hero__stat-val">Voice notes</div>
                <div className="hero__stat-lbl">understood instantly</div>
              </div>
            </div>

            <div className="hero__stat hero__stat--2">
              <div className="hero__stat-icon">📈</div>
              <div>
                <div className="hero__stat-val">Progress saved</div>
                <div className="hero__stat-lbl">picks up where you left off</div>
              </div>
            </div>

            <div className="hero__stat hero__stat--3">
              <div className="hero__stat-icon">📚</div>
              <div>
                <div className="hero__stat-val">60+ lessons</div>
                <div className="hero__stat-lbl">professionally structured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
