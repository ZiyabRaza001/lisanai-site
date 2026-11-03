import { useState } from 'react'
import { track } from '@vercel/analytics/react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './Signup.css'
import { normalizePhone } from '../lib/phone'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Best-effort guess so most visitors never have to touch the country
// dropdown at all — falls back to NL (the business's home market) when the
// browser doesn't expose a region, e.g. plain "en" with no "-XX" suffix.
function guessDefaultCountry() {
  if (typeof navigator === 'undefined') return 'NL'
  const locale = navigator.language || navigator.languages?.[0] || ''
  const region = locale.split('-')[1]
  return region ? region.toUpperCase() : 'NL'
}

const features = [
  'Unlimited guided lessons',
  'Voice note transcription & feedback',
  'Free-chat practice mode',
  'Precise, explained corrections',
  'Progress & level tracking',
  '100% free, no card, ever',
]

export default function Signup({ onSignupComplete }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [defaultCountry] = useState(guessDefaultCountry)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitSignup = async () => {
    if (!showForm) {
      track('signup_form_opened')
      setShowForm(true)
      return
    }

    if (!name.trim()) {
      track('signup_validation_error', { field: 'name' })
      setError('Enter your name.')
      return
    }

    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      track('signup_validation_error', { field: 'email' })
      setError('Enter a valid email address.')
      return
    }

    const e164Phone = normalizePhone(phone)
    if (!e164Phone) {
      track('signup_validation_error', { field: 'phone' })
      setError('Enter a valid WhatsApp number.')
      return
    }

    setError('')
    setLoading(true)
    track('signup_submit_attempt')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: e164Phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not sign you up — try again in a moment.')

      track('signup_success')
      onSignupComplete?.(name.trim())
      setShowForm(false)
      setName('')
      setEmail('')
      setPhone('')
    } catch (err) {
      track('signup_error', { message: err.message })
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="signup" id="signup">
      <div className="container">
        <div className="signup__header">
          <div className="section-tag">Sign up</div>
          <h2 className="section-title">
            Completely free,<br />
            <span className="signup__title-accent">no catch</span>
          </h2>
          <p className="section-subtitle">
            LisanAI is 100% free to use — no card, no subscription, nothing to pay. Sign up and
            start chatting with your tutor on WhatsApp.
          </p>
        </div>

        <div className="signup__grid">
          <div className="signup-card">
            <div className="signup-card__badge">Always free</div>
            <div className="signup-card__header">
              <span className="signup-card__icon">💬</span>
              <h3 className="signup-card__name">LisanAI</h3>
              <p className="signup-card__desc">Everything you need to actually learn Arabic — no tiers, no lesson caps, no payment.</p>
            </div>

            <ul className="signup-card__features">
              {features.map((f, j) => (
                <li key={j} className="signup-card__feature">
                  <span className="signup-card__check">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {showForm && (
              <div className="signup-card__form">
                <label htmlFor="wa-name" className="signup-card__form-label">
                  Your name
                </label>
                <input
                  id="wa-name"
                  type="text"
                  autoFocus
                  placeholder="Amina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="signup-card__form-input"
                />

                <label htmlFor="wa-email" className="signup-card__form-label">
                  Your email
                </label>
                <input
                  id="wa-email"
                  type="email"
                  placeholder="amina@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-card__form-input"
                />

                <label htmlFor="wa-phone" className="signup-card__form-label">
                  Your WhatsApp number
                </label>
                <PhoneInput
                  id="wa-phone"
                  className="signup-card__phone-field"
                  international
                  defaultCountry={defaultCountry}
                  placeholder="Enter your WhatsApp number"
                  value={phone}
                  onChange={(value) => setPhone(value || '')}
                />
              </div>
            )}
            {error && <p className="signup-card__error">{error}</p>}

            <button className="btn btn-lg signup-card__cta btn-primary" onClick={submitSignup} disabled={loading}>
              {loading ? 'Signing you up…' : showForm ? 'Create my free account' : 'Sign up free'}
            </button>
          </div>
        </div>

        <div className="signup__guarantee">
          <span className="signup__guarantee-icon">🛡️</span>
          <p>
            <strong>100% free, always.</strong> No card, no subscription, no catch — just message the bot and start learning.
          </p>
        </div>
      </div>
    </section>
  )
}
