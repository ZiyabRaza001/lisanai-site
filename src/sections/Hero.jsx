import './Hero.css'

const chatMessages = [
  { from: 'user', text: 'hiya fi al bayt' },
  { from: 'bot', text: 'Close! 😊 After a preposition, the noun takes the -i ending → البيتِ, not البيت.\nSo: هي في البيتِ ✅' },
  { from: 'user', text: 'so it changes bc of "fi", not bc its feminine?' },
  { from: 'bot', text: 'Exactly right! 👏 The -i ending comes from the preposition — gender only decides هو vs هي.' },
  { from: 'user', text: 'ayna as-saaAtu? hiya alaa as-sareer' },
  { from: 'bot', text: 'Almost — على gives -i too: السريرِ, not السرير.\nممتاز otherwise! 🎉' },
]

export default function Hero() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero">
      <div className="hero__bg">
        <div className="hero__bg-gradient" />
        <div className="hero__bg-grid" />
        <div className="hero__blob hero__blob--1" />
        <div className="hero__blob hero__blob--2" />
      </div>

      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="currentColor"/>
            </svg>
            Your WhatsApp Arabic Tutor
          </div>

          <h1 className="hero__title">
            Send a message.<br />
            <span className="hero__title-accent">Learn Arabic.</span>
          </h1>

          <p className="hero__subtitle">
            A personal Arabic tutor that lives right inside WhatsApp. Guided lessons, voice notes,
            free-form practice — no app to download, no login to remember.
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

          <div className="hero__actions">
            <button className="btn btn-primary btn-lg hero__cta-main" onClick={() => scrollTo('#pricing')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white"/>
              </svg>
              Start learning free on WhatsApp
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => scrollTo('#demo')}>
              Watch demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          <div className="hero__social-proof">
            <div className="hero__avatars">
              {['ML', 'DK', 'SR', 'PL'].map((init, i) => (
                <div key={i} className="hero__avatar" style={{ background: ['#25D366','#075E54','#128C7E','#34B7F1'][i] }}>
                  {init}
                </div>
              ))}
            </div>
            <div>
              <div className="hero__stars">★★★★★</div>
              <p className="hero__social-text"><strong>500+</strong> learners practicing Arabic <strong>every week</strong></p>
            </div>
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
        </div>
      </div>
    </section>
  )
}
