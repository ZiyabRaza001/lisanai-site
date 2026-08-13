import './Testimonials.css'

const testimonials = [
  {
    name: 'Maria Lopez',
    role: 'Beginner, learning for travel',
    avatar: 'ML',
    color: '#25D366',
    rating: 5,
    text: 'I just message it like a friend and it walks me through everything — grammar, vocabulary, a little practice. When I get something wrong it doesn\'t just say ✗, it explains exactly why. No app, no login, no excuses.',
    metric: 'Learning daily for 3 months',
  },
  {
    name: 'David Kim',
    role: 'Software engineer',
    avatar: 'DK',
    color: '#128C7E',
    rating: 5,
    text: 'The voice notes are what sold me. I speak Arabic into WhatsApp on my commute and it transcribes, corrects my pronunciation, and replies. It genuinely feels like texting a patient tutor.',
    metric: 'Voice practice every commute',
  },
  {
    name: 'Sarah Reyes',
    role: 'Heritage learner',
    avatar: 'SR',
    color: '#34B7F1',
    rating: 5,
    text: 'I switch between guided lessons and free-chat mode depending on my mood, and it never loses the thread — it remembers exactly what we talked about last time. My vocabulary has exploded.',
    metric: 'From beginner to conversational',
  },
]

function Stars({ count }) {
  return (
    <div className="testimonial__stars">
      {'★'.repeat(count)}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials__header">
          <div className="section-tag">Testimonials</div>
          <h2 className="section-title">
            What learners<br />
            <span className="testimonials__title-accent">say about LisanAI</span>
          </h2>
          <p className="section-subtitle">
            From total beginners to heritage speakers brushing up — anyone with WhatsApp can learn with it.
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card" style={{ '--t-color': t.color }}>
              <div className="testimonial-card__top">
                <Stars count={t.rating} />
                <div className="testimonial-card__metric">{t.metric}</div>
              </div>
              <p className="testimonial-card__text">"{t.text}"</p>
              <div className="testimonial-card__author">
                <div className="testimonial-card__avatar" style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
