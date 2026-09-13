import { useState } from 'react'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import './Pricing.css'
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
  'Cancel anytime, no commitment',
]

const vipFeatures = [
  'Everything in Standard',
  'Priority WhatsApp support',
  '1:1 onboarding call',
  'Early access to new features',
]

export default function Pricing({ onTrialStarted }) {
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [defaultCountry] = useState(guessDefaultCountry)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const startTrial = async () => {
    if (!showPhoneInput) {
      setShowPhoneInput(true)
      return
    }

    if (!name.trim()) {
      setError('Enter your name.')
      return
    }

    if (!email.trim() || !EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.')
      return
    }

    const e164Phone = normalizePhone(phone)
    if (!e164Phone) {
      setError('Enter a valid WhatsApp number.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/start-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: e164Phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not start your trial — try again in a moment.')

      onTrialStarted?.(name.trim())
      setShowPhoneInput(false)
      setName('')
      setEmail('')
      setPhone('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="pricing" id="pricing">
      <div className="container">
        <div className="pricing__header">
          <div className="section-tag">Pricing</div>
          <h2 className="section-title">
            Simple pricing,<br />
            <span className="pricing__title-accent">no surprises</span>
          </h2>
          <p className="section-subtitle">
            Try LisanAI free for 7 days — no card needed. Keep going after for €8.90/month (normally €21).
          </p>
        </div>

        <div className="pricing__grid pricing__grid--two">
          <div className="pricing-card pricing-card--highlight">
            <div className="pricing-card__badge">7 days free</div>
            <div className="pricing-card__header">
              <span className="pricing-card__icon">💬</span>
              <h3 className="pricing-card__name">LisanAI</h3>
              <p className="pricing-card__desc">Everything you need to actually learn Arabic — no tiers, no lesson caps.</p>
            </div>

            <div className="pricing-card__price">
              <span className="pricing-card__currency">€</span>
              <span className="pricing-card__amount">8.90</span>
              <span className="pricing-card__period">/month</span>
            </div>
            <div className="pricing-card__discount-row">
              <span className="pricing-card__original">€21.00/month</span>
              <span className="pricing-card__discount-flag">Save 58%</span>
            </div>
            <p className="pricing-card__price-note">Free for your first 7 days, no card required. We'll message you on WhatsApp with a link to continue for €8.90/month if you'd like to keep learning.</p>

            <ul className="pricing-card__features">
              {features.map((f, j) => (
                <li key={j} className="pricing-card__feature">
                  <span className="pricing-card__check">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {showPhoneInput && (
              <div className="pricing-card__phone">
                <label htmlFor="wa-name" className="pricing-card__phone-label">
                  Your name
                </label>
                <input
                  id="wa-name"
                  type="text"
                  autoFocus
                  placeholder="Amina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pricing-card__phone-input"
                />

                <label htmlFor="wa-email" className="pricing-card__phone-label">
                  Your email
                </label>
                <input
                  id="wa-email"
                  type="email"
                  placeholder="amina@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pricing-card__phone-input"
                />

                <label htmlFor="wa-phone" className="pricing-card__phone-label">
                  Your WhatsApp number
                </label>
                <PhoneInput
                  id="wa-phone"
                  className="pricing-card__phone-field"
                  international
                  defaultCountry={defaultCountry}
                  placeholder="Enter your WhatsApp number"
                  value={phone}
                  onChange={(value) => setPhone(value || '')}
                />
              </div>
            )}
            {error && <p className="pricing-card__error">{error}</p>}

            <button className="btn btn-lg pricing-card__cta btn-primary" onClick={startTrial} disabled={loading}>
              {loading ? 'Starting your trial…' : showPhoneInput ? 'Start my free trial' : 'Start my free week'}
            </button>
          </div>

          <div className="pricing-card pricing-card--soldout">
            <div className="pricing-card__badge pricing-card__badge--soldout">Sold out</div>
            <div className="pricing-card__header">
              <span className="pricing-card__icon">⭐</span>
              <h3 className="pricing-card__name">LisanAI VIP</h3>
              <p className="pricing-card__desc">Limited-seat priority tier with 1:1 onboarding — fully booked.</p>
            </div>

            <div className="pricing-card__price">
              <span className="pricing-card__currency">€</span>
              <span className="pricing-card__amount">12.49</span>
              <span className="pricing-card__period">/month</span>
            </div>
            <p className="pricing-card__price-note">All VIP seats are currently taken. Join the standard plan — no waitlist needed.</p>

            <ul className="pricing-card__features">
              {vipFeatures.map((f, j) => (
                <li key={j} className="pricing-card__feature">
                  <span className="pricing-card__check">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button className="btn btn-lg pricing-card__cta btn-secondary" disabled>
              Sold out
            </button>
          </div>
        </div>

        <div className="pricing__guarantee">
          <span className="pricing__guarantee-icon">🛡️</span>
          <p>
            <strong>No card, no charge.</strong> Try free for 7 days — we'll only ask for payment on WhatsApp if you decide to continue.
          </p>
        </div>
      </div>
    </section>
  )
}
