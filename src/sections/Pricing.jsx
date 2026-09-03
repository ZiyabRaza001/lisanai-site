import { useState } from 'react'
import './Pricing.css'
import { normalizePhone } from '../lib/phone'

// Direct Stripe Payment Link. It carries no arbitrary metadata of its own —
// the only dynamic value Stripe lets a Payment Link URL pass through is
// client_reference_id, which n8n's sync workflow already reads as its
// fallback for the phone number when metadata.telefoonnummer is absent.
// The name has no equivalent pass-through, so it's carried in sessionStorage
// instead, purely for personalizing the pop-up after redirect.
const DIRECT_PAYMENT_LINK = 'https://buy.stripe.com/9B6eVd8QwaRE9HK4bb8N201'

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

export default function Pricing() {
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const startCheckout = () => {
    if (!showPhoneInput) {
      setShowPhoneInput(true)
      return
    }

    if (!name.trim()) {
      setError('Enter your name.')
      return
    }

    const e164Phone = normalizePhone(phone)
    if (!e164Phone) {
      setError('Enter your WhatsApp number with country code, e.g. +31612345678')
      return
    }

    setError('')

    const telefoonnummer = e164Phone.replace(/\D/g, '')
    sessionStorage.setItem('lisanai_checkout_name', name.trim())
    window.location.href = `${DIRECT_PAYMENT_LINK}?client_reference_id=${telefoonnummer}`
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
            Try LisanAI free for 7 days. Then lock in €2.49/week (normally €6) — cancel anytime.
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
              <span className="pricing-card__amount">2.49</span>
              <span className="pricing-card__period">/week</span>
            </div>
            <div className="pricing-card__discount-row">
              <span className="pricing-card__original">€6.00/week</span>
              <span className="pricing-card__discount-flag">Save 58%</span>
            </div>
            <p className="pricing-card__price-note">Free for your first 7 days, then €2.49/week. Cancel before day 8 and pay nothing.</p>

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

                <label htmlFor="wa-phone" className="pricing-card__phone-label">
                  Your WhatsApp number
                </label>
                <input
                  id="wa-phone"
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pricing-card__phone-input"
                />
              </div>
            )}
            {error && <p className="pricing-card__error">{error}</p>}

            <button className="btn btn-lg pricing-card__cta btn-primary" onClick={startCheckout}>
              {showPhoneInput ? 'Continue to checkout' : 'Start my free week'}
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
              <span className="pricing-card__amount">3.49</span>
              <span className="pricing-card__period">/week</span>
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
            <strong>No charge until day 8.</strong> Cancel anytime during your free week and you won't be billed a cent.
          </p>
        </div>
      </div>
    </section>
  )
}
