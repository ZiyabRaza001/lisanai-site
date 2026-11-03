import './SignupSuccessModal.css'
import { waLink, waDisplayNumber } from '../lib/whatsapp'

// Shown right after a successful signup (see Signup.jsx) — controlled
// directly by whoever just signed up, not parsed out of a redirect URL.
export default function SignupSuccessModal({ open, name, onClose }) {
  if (!open) return null

  return (
    <div className="signup-modal__overlay" onClick={onClose}>
      <div className="signup-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="signup-modal__blob signup-modal__blob--1" />
        <div className="signup-modal__blob signup-modal__blob--2" />

        <button className="signup-modal__close" onClick={onClose} aria-label="Close">×</button>

        <div className="signup-modal__badge">🎉</div>
        <h3 className="signup-modal__title">Welcome{name ? `, ${name}` : ''}!</h3>
        <p className="signup-modal__text">You're all set — LisanAI is 100% free, no card, ever. Message this number on WhatsApp to meet your tutor:</p>

        <div className="signup-modal__number-pill">
          <span className="signup-modal__number-dot" />
          {waDisplayNumber()}
        </div>

        <a
          href={waLink('start')}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg signup-modal__cta"
        >
          Message LisanAI on WhatsApp →
        </a>

        <div className="signup-modal__footer-notes">
          <p>📧 We've also emailed this to you — check spam if you don't see it.</p>
          <p>💳 100% free. No card, ever.</p>
        </div>
      </div>
    </div>
  )
}
