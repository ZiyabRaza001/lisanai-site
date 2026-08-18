import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Fill in every field.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/send-contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      setSent(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact__header">
          <div className="section-tag">Contact</div>
          <h2 className="section-title">
            Get in <span className="contact__title-accent">touch</span>
          </h2>
          <p className="section-subtitle">
            Question, feedback, or something not working? Send us a message and we'll get back to you.
          </p>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__row">
            <div className="contact__field">
              <label htmlFor="contact-name">Your name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Amina"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-email">Your email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="amina@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              placeholder="What's this about?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={5}
              placeholder="Tell us what's going on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {error && <p className="contact__error">{error}</p>}
          {sent && <p className="contact__success">✅ Sent — we'll get back to you soon.</p>}

          <button type="submit" className="btn btn-lg btn-primary contact__submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>
    </section>
  )
}
