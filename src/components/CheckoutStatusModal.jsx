import './CheckoutStatusModal.css'
import { waLink, waDisplayNumber } from '../lib/whatsapp'

// Shown right after a successful trial signup (see Pricing.jsx) — no more
// Stripe redirect to come back from, so this is controlled directly by
// whoever started the trial instead of parsed out of the URL.
export default function CheckoutStatusModal({ open, name, onClose }) {
  if (!open) return null

  return (
    <div className="checkout-modal__overlay" onClick={onClose}>
      <div className="checkout-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal__blob checkout-modal__blob--1" />
        <div className="checkout-modal__blob checkout-modal__blob--2" />

        <button className="checkout-modal__close" onClick={onClose} aria-label="Close">×</button>

        <div className="checkout-modal__badge">🎉</div>
        <h3 className="checkout-modal__title">Welcome{name ? `, ${name}` : ''}!</h3>
        <p className="checkout-modal__text">Your 7-day free trial just started — no card, no charge. Message this number on WhatsApp to meet your tutor:</p>

        <div className="checkout-modal__number-pill">
          <span className="checkout-modal__number-dot" />
          {waDisplayNumber()}
        </div>

        <a
          href={waLink('start')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg checkout-modal__cta"
        >
          Message LisanAI on WhatsApp →
        </a>

        <div className="checkout-modal__footer-notes">
          <p>📧 We've also emailed this to you — check spam if you don't see it.</p>
          <p>💳 No card needed. Free for 7 days.</p>
        </div>
      </div>
    </div>
  )
}
