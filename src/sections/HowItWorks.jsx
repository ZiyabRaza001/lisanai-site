import './HowItWorks.css'

const steps = [
  {
    number: '01',
    icon: '📱',
    title: 'Message the bot',
    desc: 'Send one message on WhatsApp and your personal Arabic tutor is ready. No app to install. No account to create.',
    detail: 'Works on iPhone & Android',
    time: '1 min',
  },
  {
    number: '02',
    icon: '🧭',
    title: 'Pick your mode',
    desc: 'A simple menu lets you choose "guided lessons" or "just chat and practice." Switch between them anytime you like.',
    detail: 'Guided lessons or free chat',
    time: '30 sec',
  },
  {
    number: '03',
    icon: '🚀',
    title: 'Start learning',
    desc: 'Jump straight into your lesson, or just ask a question. It already knows your level and picks up right where you left off.',
    detail: 'Grammar, vocabulary, practice, free chat',
    time: 'Instant',
  },
]

export default function HowItWorks() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="how__header">
          <div className="section-tag">How it works</div>
          <h2 className="section-title">
            Ready in <span className="how__title-accent">under 2 minutes</span>
          </h2>
          <p className="section-subtitle">
            No app to install, no account to configure, nothing to learn.
            Just use WhatsApp the way you already do.
          </p>
        </div>

        <div className="how__steps">
          {steps.map((step, i) => (
            <div key={i} className="how__step">
              <div className="how__step-line-wrap">
                <div className="how__step-circle">
                  <span className="how__step-num">{step.number}</span>
                </div>
                {i < steps.length - 1 && <div className="how__step-line" />}
              </div>
              <div className="how__step-body">
                <div className="how__step-icon-wrap">
                  <span className="how__step-icon">{step.icon}</span>
                  <span className="how__step-time">{step.time}</span>
                </div>
                <h3 className="how__step-title">{step.title}</h3>
                <p className="how__step-desc">{step.desc}</p>
                <div className="how__step-pill">
                  <span className="how__step-pill-dot" />
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="how__example">
          <div className="how__example-label">Example — first message:</div>
          <div className="how__example-msgs">
            <div className="how__ex-msg how__ex-msg--user">
              start
            </div>
            <div className="how__ex-msg how__ex-msg--bot">
              أهلاً وسهلاً! 👋 Welcome! I'm your Arabic tutor.<br />
              Want guided lessons, or just chat and practice?
            </div>
            <div className="how__ex-msg how__ex-msg--user">
              guided lessons
            </div>
            <div className="how__ex-msg how__ex-msg--bot">
              Great — starting at beginner level. 📖 Lesson 1: Asking "What is this?"...
            </div>
          </div>
          <p className="how__example-note">
            That's it. Everything happens through messages — no buttons, no menus, no software.
          </p>
        </div>

        <div className="how__cta">
          <button className="btn btn-primary btn-lg" onClick={() => scrollTo('#pricing')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white"/>
            </svg>
            Start now free — 14 days to try
          </button>
        </div>
      </div>
    </section>
  )
}
