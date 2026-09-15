import './WhyWhatsApp.css'

const points = [
  { icon: '📱', title: 'WhatsApp', desc: 'Learn directly where you already chat — nothing new to open.' },
  { icon: '📚', title: '60+ lessons', desc: 'Follow a structured path instead of randomly picking up words.' },
  { icon: '🗣️', title: 'Voice practice', desc: 'Practice speaking and listening through real voice messages.' },
  { icon: '✍️', title: 'Instant corrections', desc: "Make a mistake and learn from it right away, not days later." },
  { icon: '🔤', title: 'Arabic + transliteration', desc: "Read what you're learning while gradually picking up the script." },
]

export default function WhyWhatsApp() {
  return (
    <section className="why-wa">
      <div className="container">
        <h2 className="why-wa__title">Learn Arabic without another complicated app</h2>
        <div className="why-wa__grid">
          {points.map((p) => (
            <div key={p.title} className="feature-card why-wa__card">
              <div className="feature-card__icon">{p.icon}</div>
              <h3 className="feature-card__title">{p.title}</h3>
              <p className="feature-card__desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
