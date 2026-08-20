import { useState, useEffect } from 'react'
import './Pricing.css'
import { waLink, waDisplayNumber } from '../lib/whatsapp'

const features = [
  'Unlimited guided lessons',
  'Voice note transcription & feedback',
  'Free-chat practice mode',
  'Precise, explained corrections',
  'Progress & level tracking',
  'Cancel anytime, no commitment',
]

export default function Pricing() {
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkoutStatus, setCheckoutStatus] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('checkout')
    if (status === 'success' || status === 'cancelled') {
      setCheckoutStatus(status)
      params.delete('checkout')
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}#pricing`)
    }
  }, [])

  const startCheckout = async () => {
    if (!showPhoneInput) {
      setShowPhoneInput(true)
      return
    }

    if (!name.trim()) {
      setError('Enter your name.')
      return
    }

    if (phone.trim().length < 6) {
      setError("Enter the WhatsApp number you'll message the bot from.")
      return
    }

    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err.message)
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
            Try LisanAI free for 7 days. Then lock in €2.99/week (normally €6) — cancel anytime.
          </p>

          {checkoutStatus === 'success' && (
            <div className="pricing__status pricing__status--success">
              <p>🎉 You're in! Message this number on WhatsApp to start your free week:</p>
              <p className="pricing__status-number">{waDisplayNumber()}</p>
              <a
                href={waLink('start')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary pricing__status-cta"
              >
                Message LisanAI on WhatsApp →
              </a>
              <p className="pricing__status-note">We've also sent this to your email — check spam if you don't see it.</p>
            </div>
          )}
          {checkoutStatus === 'cancelled' && (
            <div className="pricing__status pricing__status--cancelled">
              Checkout cancelled — you weren't charged. Ready when you are.
            </div>
          )}
        </div>

        <div className="pricing__grid pricing__grid--single">
          <div className="pricing-card pricing-card--highlight">
            <div className="pricing-card__badge">7 days free</div>
            <div className="pricing-card__header">
              <span className="pricing-card__icon">💬</span>
              <h3 className="pricing-card__name">LisanAI</h3>
              <p className="pricing-card__desc">Everything you need to actually learn Arabic — no tiers, no lesson caps.</p>
            </div>

            <div className="pricing-card__price">
              <span className="pricing-card__currency">€</span>
              <span className="pricing-card__amount">2.99</span>
              <span className="pricing-card__period">/week</span>
            </div>
            <div className="pricing-card__discount-row">
              <span className="pricing-card__original">€6.00/week</span>
              <span className="pricing-card__discount-flag">Save 50%</span>
            </div>
            <p className="pricing-card__price-note">Free for your first 7 days, then €2.99/week. Cancel before day 8 and pay nothing.</p>

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

            <button className="btn btn-lg pricing-card__cta btn-primary" onClick={startCheckout} disabled={loading}>
              {loading ? 'Redirecting…' : showPhoneInput ? 'Continue to checkout' : 'Start my free week'}
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
