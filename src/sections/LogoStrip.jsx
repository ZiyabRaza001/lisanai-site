import './LogoStrip.css'

const stats = [
  { value: '50+', label: 'guided lessons', icon: '📖' },
  { value: '24/7', label: 'available anytime', icon: '🤖' },
  { value: '2', label: 'languages supported', icon: '🌍' },
  { value: '500+', label: 'active learners', icon: '👥' },
  { value: '0', label: 'apps to download', icon: '💡' },
  { value: '100%', label: 'inside WhatsApp', icon: '💬' },
]

export default function LogoStrip() {
  return (
    <section className="logo-strip">
      <div className="container">
        <div className="logo-strip__grid">
          {stats.map((s, i) => (
            <div key={i} className="logo-strip__stat">
              <span className="logo-strip__stat-icon">{s.icon}</span>
              <div>
                <div className="logo-strip__stat-value">{s.value}</div>
                <div className="logo-strip__stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
