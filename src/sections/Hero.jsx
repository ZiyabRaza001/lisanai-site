import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { track } from '@vercel/analytics/react'
import './Hero.css'
import { getAudienceVariant } from '../lib/audience'
import { waLink } from '../lib/whatsapp'
import MosqueScene, { PhoneMockup } from './MosqueScene'

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

const STAGES = {
  dist: [0, 0.3],
  door: [0.22, 0.52],
  inside: [0.42, 0.62],
  zoom: [0.54, 0.88],
  content: [0.8, 1],
}

// Walk-through driven by one raw scroll progress 0->1 across the pinned
// section. dist/door/inside/zoom live in a plain ref (read every frame by
// the 3D scene via useFrame — a WebGL scene needs a JS value each frame,
// not a CSS custom property) while content is also written to the DOM as
// --p-content, since that one drives a plain CSS opacity crossfade on the
// real page content overlaid on the canvas.
function useScrollScene(sectionRef, pinRef, progressRef) {
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

      progressRef.current.dist = stage(p, STAGES.dist)
      progressRef.current.door = stage(p, STAGES.door)
      progressRef.current.inside = stage(p, STAGES.inside)
      progressRef.current.zoom = stage(p, STAGES.zoom)
      progressRef.current.content = stage(p, STAGES.content)
      pin.style.setProperty('--p-content', progressRef.current.content)
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
  }, [sectionRef, pinRef, progressRef])
}

function HeroCapabilities() {
  return (
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
  )
}

export default function Hero() {
  const [variant] = useState(getAudienceVariant)
  const [reduceMotion, setReduceMotion] = useState(false)
  const copy = COPY[variant]
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const progressRef = useRef({ dist: 0, door: 0, inside: 0, zoom: 0, content: 0 })
  useScrollScene(sectionRef, pinRef, progressRef)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  if (reduceMotion) {
    return (
      <section className="hero hero--static">
        <div className="container hero__static-inner">
          <div className="hero__top">
            <div className="hero__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="currentColor" />
              </svg>
              {copy.badge}
            </div>
            <h1 className="hero__title">
              {copy.titleLine1}<br />
              <span className="hero__title-accent">{copy.titleAccent}</span>
            </h1>
            <p className="hero__subtitle">{copy.subtitle}</p>
          </div>

          <PhoneMockup />

          <HeroCapabilities />

          <div className="hero__cta-group">
            <div className="hero__actions">
              <a
                href={waLink('start')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg hero__cta-main"
                onClick={() => track('cta_click', { location: 'hero' })}
              >
                Try It Free
              </a>
              <button className="btn btn-ghost" onClick={() => scrollTo('#demo')}>
                Watch demo
              </button>
            </div>
            <p className="hero__reassurance">100% free · No card · No catch</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__pin" ref={pinRef}>
        <div className="hero__sky" aria-hidden="true" />

        <div className="hero__canvas-wrap" aria-hidden="true">
          <Canvas shadows camera={{ fov: 50, position: [0, 6, 46] }}>
            <MosqueScene progressRef={progressRef} />
          </Canvas>
        </div>

        <div className="hero__overlay">
          <div className="hero__top">
            <div className="hero__badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="currentColor" />
              </svg>
              {copy.badge}
            </div>
            <h1 className="hero__title">
              {copy.titleLine1}<br />
              <span className="hero__title-accent">{copy.titleAccent}</span>
            </h1>
            <p className="hero__subtitle">{copy.subtitle}</p>
          </div>

          <div className="hero__bottom">
            <HeroCapabilities />
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
                    <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white" />
                  </svg>
                  Try It Free
                </a>
                <button className="btn btn-ghost" onClick={() => scrollTo('#demo')}>
                  Watch demo
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              <p className="hero__reassurance">100% free · No card · No catch</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
