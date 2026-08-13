import { useState } from 'react'
import './Demo.css'

const scenarios = [
  {
    id: 'lesson',
    label: '📖 Guided lesson',
    flow: [
      { from: 'user', text: 'hi' },
      { from: 'bot', text: 'أهلاً! 👋 Welcome back. Ready to continue where you left off?\n\nA) 📖 Guided lessons\nB) 💬 Just chat and practice\n\nType A or B. Or just ask a question!' },
      { from: 'user', text: 'A' },
      { from: 'bot', text: '📖 Lesson 1: Asking "What is this?"\n\nArabic has no word for "is" — there\'s no copula. So "this is a book" is just two words:\nهذا كتابٌ (hadha kitabun) — literally "this book"\n\nThat -un ending is tanwin, Arabic\'s version of "a/an." There\'s no separate word for it.' },
      { from: 'bot', text: 'To turn a statement into a question, add أ to the very front:\nهذا بيتٌ (this is a house) → أهذا بيتٌ؟ (is this a house?)\n\nنعم، هذا بيتٌ — "yes, this is a house"\nلا، هذا مسجدٌ — "no, this is a mosque"' },
      { from: 'bot', text: '📚 Vocabulary\nبيت (bait) — house\nولد (walad) — boy\nمسجد (masjid) — mosque\nكتاب (kitab) — book\nقلم (qalam) — pen\nمفتاح (miftah) — key' },
      { from: 'bot', text: 'Quick check — how would you ask "Is this a mosque?" 😊' },
      { from: 'user', text: 'ahadha masjidun?' },
      { from: 'bot', text: 'ممتاز! 🎉 أهذا مسجدٌ؟ — exactly right. And since it\'s true, you\'d answer:\nنعم، هذا مسجدٌ — "Yes, this is a mosque."' },
      { from: 'bot', text: 'Great start! We\'ll build on this together as we keep going. 😊' },
    ],
  },
  {
    id: 'correct',
    label: '✏️ Real corrections',
    flow: [
      { from: 'bot', text: 'أين الغرفة؟ (Where is the room?)\n\nHow would you answer using هي and a preposition? 😊' },
      { from: 'user', text: 'hiya fi al bayt' },
      { from: 'bot', text: 'Close! 😊 After a preposition, the noun takes the -i ending → البيتِ, not البيت.\n\nSo: هي في البيتِ ✅' },
      { from: 'user', text: 'so it changes bc of "fi", not bc its feminine?' },
      { from: 'bot', text: 'Great question! 🔍 Exactly right — the -i ending comes from the preposition, NOT gender.\n\nGender only decides which pronoun you use (هو vs هي), not the case ending.' },
      { from: 'user', text: 'ayna as-saaAtu? hiya alaa as-sareer' },
      { from: 'bot', text: 'Almost — على gives -i too: السريرِ, not السرير.\n\nممتاز otherwise! 🎉 Vocabulary and structure were exactly right.' },
    ],
  },
  {
    id: 'voice',
    label: '🎙️ Voice note practice',
    flow: [
      { from: 'user', text: 'voice note, 0:08', isImage: true },
      { from: 'bot', text: '🎧 I heard: "كيف حالك اليوم؟" — "How are you today?"\n\nNicely pronounced! One small note: the ح is a breathy "h" from the throat, not like the English h.' },
      { from: 'user', text: 'voice note, 0:05', isImage: true },
      { from: 'bot', text: '🎧 I heard: "أنا بخير، شكراً" — "I\'m well, thank you."\n\nPerfect! That\'s exactly the right reply. Want to keep practicing this exchange, or move on to something new?' },
    ],
  },
  {
    id: 'chat',
    label: '💬 Free chat practice',
    flow: [
      { from: 'user', text: 'B' },
      { from: 'bot', text: '💬 Free chat mode — ask me anything, or let\'s just talk in Arabic. What\'s on your mind?' },
      { from: 'user', text: 'what\'s the difference between من and مِن?' },
      { from: 'bot', text: 'Good catch — they\'re spelled the same without diacritics!\nمَن (man) = "who"\nمِن (min) = "from"\n\nContext usually makes it obvious. Want to try a sentence with each?' },
      { from: 'user', text: 'من أين أنت؟' },
      { from: 'bot', text: '👏 "Where are you from?" — used مِن correctly. My turn: أنا من أمريكا. Now you try saying where you\'re from!' },
    ],
  },
]

export default function Demo() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState(2)
  const [playing, setPlaying] = useState(false)

  const scenario = scenarios[activeScenario]

  const handleScenario = (idx) => {
    setActiveScenario(idx)
    setVisibleMessages(2)
    setPlaying(false)
  }

  const handleNext = () => {
    if (visibleMessages < scenario.flow.length) {
      setVisibleMessages(v => v + 1)
    }
  }

  const handlePlay = () => {
    if (playing) return
    setPlaying(true)
    setVisibleMessages(2)
    let i = 2
    const step = () => {
      if (i <= scenario.flow.length) {
        setVisibleMessages(i)
        i++
        if (i <= scenario.flow.length) {
          setTimeout(step, 900)
        } else {
          setPlaying(false)
        }
      }
    }
    setTimeout(step, 900)
  }

  const msgs = scenario.flow.slice(0, visibleMessages)
  const hasMore = visibleMessages < scenario.flow.length

  return (
    <section className="demo" id="demo">
      <div className="container">
        <div className="demo__header">
          <div className="section-tag">Interactive demo</div>
          <h2 className="section-title">
            Try it yourself —<br />
            <span className="demo__title-accent">this is how the bot works</span>
          </h2>
          <p className="section-subtitle">
            Pick a scenario and see exactly what a conversation with your WhatsApp Arabic tutor looks like.
          </p>
        </div>

        <div className="demo__inner">
          <div className="demo__scenarios">
            {scenarios.map((s, i) => (
              <button
                key={s.id}
                className={`demo__scenario-btn ${activeScenario === i ? 'demo__scenario-btn--active' : ''}`}
                onClick={() => handleScenario(i)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="demo__stage">
            <div className="demo__phone">
              <div className="demo__phone-inner">
                <div className="demo__wa-bar">
                  <div className="demo__wa-ava">🕌</div>
                  <div>
                    <div className="demo__wa-name">LisanAI Tutor</div>
                    <div className="demo__wa-online">● online</div>
                  </div>
                </div>

                <div className="demo__chat-area">
                  {msgs.map((msg, i) => (
                    <div
                      key={`${activeScenario}-${i}`}
                      className={`demo__msg demo__msg--${msg.from} demo__msg--in`}
                    >
                      {msg.isImage ? (
                        <div className={`demo__bubble demo__bubble--${msg.from} demo__bubble--image`}>
                          <div className="demo__image-placeholder">
                            <span>🎤</span>
                            <span>{msg.text}</span>
                          </div>
                          <span className="demo__time">
                            {msg.from === 'user' ? '✓✓' : ''} {['10:01','10:01','10:02','10:02','10:03','10:03','10:04','10:04','10:05'][i] || '10:05'}
                          </span>
                        </div>
                      ) : (
                        <div className={`demo__bubble demo__bubble--${msg.from}`}>
                          {msg.text.split('\n').map((line, j) => (
                            <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br />}</span>
                          ))}
                          <span className="demo__time">
                            {msg.from === 'user' ? '✓✓ ' : ''}{['10:01','10:01','10:02','10:02','10:03','10:03','10:04','10:04','10:05'][i] || '10:05'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}

                  {playing && (
                    <div className="demo__msg demo__msg--bot">
                      <div className="demo__bubble demo__bubble--bot demo__typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  )}
                </div>

                <div className="demo__wa-input-bar">
                  <span className="demo__wa-placeholder">Type a message...</span>
                  <div className="demo__wa-mic">🎤</div>
                </div>
              </div>
            </div>

            <div className="demo__controls">
              <div className="demo__progress">
                <span>{visibleMessages}</span>
                <div className="demo__progress-bar">
                  <div
                    className="demo__progress-fill"
                    style={{ width: `${(visibleMessages / scenario.flow.length) * 100}%` }}
                  />
                </div>
                <span>{scenario.flow.length}</span>
              </div>

              <div className="demo__btns">
                <button
                  className="btn btn-primary"
                  onClick={handlePlay}
                  disabled={playing || visibleMessages >= scenario.flow.length}
                >
                  {playing ? '⏳ Playing...' : '▶ Play automatically'}
                </button>
                {hasMore && !playing && (
                  <button className="btn btn-secondary" onClick={handleNext}>
                    Next message →
                  </button>
                )}
                {!hasMore && (
                  <button className="btn btn-secondary" onClick={() => { setVisibleMessages(2); setPlaying(false) }}>
                    ↺ Replay
                  </button>
                )}
              </div>

              <div className="demo__hint">
                <div className="demo__hint-icon">💡</div>
                <p>In real life, you just type this in WhatsApp. The tutor replies within seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
