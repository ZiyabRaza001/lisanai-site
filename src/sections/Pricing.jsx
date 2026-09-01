import './Pricing.css'

// Direct Stripe Payment Link — this bypasses the site's own name/phone form
// entirely, so it carries no metadata.telefoonnummer/naam for n8n to match
// a payment back to a WhatsApp number. Known and accepted tradeoff for now.
const DIRECT_PAYMENT_LINK = 'https://buy.stripe.com/9B6eVd8QwaRE9HK4bb8N201'

const features = [
  'Unlimited guided lessons',
  'Voice note transcription & feedback',
  'Free-chat practice mode',
  'Precise, explained corrections',
  'Progress & level tracking',
  'Cancel anytime, no commitment',
]

export default function Pricing() {
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

            <a href={DIRECT_PAYMENT_LINK} className="btn btn-lg pricing-card__cta btn-primary">
              Start my free week
            </a>
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
