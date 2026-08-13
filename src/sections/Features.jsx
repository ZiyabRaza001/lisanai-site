import './Features.css'

const featureGroups = [
  {
    category: 'A — Guided Lessons',
    emoji: '📖',
    color: '#25D366',
    features: [
      {
        icon: '📐',
        title: 'Grammar taught properly',
        desc: 'Every lesson walks through each grammar point with real examples — including the actual terms, like مرفوع (nominative) and مجرور (genitive) — explained in plain English so the pattern sticks beyond just one sentence.',
      },
      {
        icon: '🔤',
        title: 'Full vocabulary, word by word',
        desc: 'The complete vocabulary list for every lesson, with pronunciation and meaning for each word. Nothing gets skipped.',
      },
      {
        icon: '✏️',
        title: 'Precise corrections, not just ✗',
        desc: 'Get an answer wrong and it won\'t just mark it wrong. It points to the exact word or ending that\'s off, explains the rule behind it, and lets you try again.',
      },
      {
        icon: '🗂️',
        title: 'Clear structure, never overwhelming',
        desc: 'Long lessons are neatly organized into grammar, notes, and vocabulary sections so it never feels like a wall of text.',
      },
    ],
  },
  {
    category: 'B — Talk However You Like',
    emoji: '🎙️',
    color: '#128C7E',
    features: [
      {
        icon: '⌨️',
        title: 'Type it however you like',
        desc: 'Arabic script, plain English, or typed transliteration like "ayna al bayt" — or just send a voice note. It understands all of them and always shows you the correct Arabic back.',
      },
      {
        icon: '💬',
        title: 'Feels like texting a friend',
        desc: 'Built to feel like chatting with a patient, knowledgeable friend — not filling out a workbook.',
      },
      {
        icon: '🇬🇧',
        title: 'Explained in clear English',
        desc: 'It defaults to explaining things in clear English while giving you real Arabic to practice with, adjusting to your level.',
      },
      {
        icon: '🎉',
        title: 'Encouraging, not intimidating',
        desc: 'Mistakes get a patient, specific explanation — not a red ✗. Get it right and you\'ll hear real enthusiasm, not just a canned checkmark.',
      },
    ],
  },
  {
    category: 'C — Progress & Memory',
    emoji: '📈',
    color: '#34B7F1',
    features: [
      {
        icon: '🔄',
        title: 'Synced everywhere WhatsApp is',
        desc: 'Your conversation lives in WhatsApp itself — open it on your phone or WhatsApp Web and your whole lesson history is right there, no separate account needed.',
      },
      {
        icon: '💾',
        title: 'Progress saved automatically',
        desc: 'Your progress and current level are saved automatically, so you can pick up a conversation days later right where you left off.',
      },
      {
        icon: '🧭',
        title: 'Switch modes anytime',
        desc: 'A simple menu lets you switch between "guided lessons" mode and "just chat and practice" mode whenever you like.',
      },
      {
        icon: '🧠',
        title: 'Remembers the conversation',
        desc: 'It keeps track of your conversation history, so it responds with real context — no repeating itself, no losing the thread.',
      },
    ],
  },
]

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <div className="features__header">
          <div className="section-tag">What it does</div>
          <h2 className="section-title">
            Everything a real tutor<br />
            <span className="features__title-accent">would do — over WhatsApp</span>
          </h2>
          <p className="section-subtitle">
            Across three areas, your WhatsApp Arabic tutor teaches, listens, and remembers — just like a real one.
          </p>
        </div>

        <div className="features__groups">
          {featureGroups.map((group, gi) => (
            <div key={gi} className="features__group" style={{ '--group-color': group.color }}>
              <div className="features__group-header">
                <span className="features__group-emoji">{group.emoji}</span>
                <h3 className="features__group-title">{group.category}</h3>
              </div>
              <div className="features__group-grid">
                {group.features.map((f, fi) => (
                  <div key={fi} className="feature-card">
                    <div className="feature-card__icon">{f.icon}</div>
                    <h4 className="feature-card__title">{f.title}</h4>
                    <p className="feature-card__desc">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
