import { useState, useEffect } from 'react'
import './CheckoutStatusModal.css'
import { waLink, waDisplayNumber } from '../lib/whatsapp'

export default function CheckoutStatusModal() {
  const [status, setStatus] = useState(null)
  const [name, setName] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get('checkout')
    if (checkout === 'success' || checkout === 'cancelled') {
      setStatus(checkout)
      setName(params.get('name') || '')
      params.delete('checkout')
      params.delete('name')
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
    }
  }, [])

  if (!status) return null

  return (
    <div className="checkout-modal__overlay" onClick={() => setStatus(null)}>
      <div className="checkout-modal__card" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal__blob checkout-modal__blob--1" />
        <div className="checkout-modal__blob checkout-modal__blob--2" />

        <button className="checkout-modal__close" onClick={() => setStatus(null)} aria-label="Close">×</button>

        {status === 'success' ? (
          <>
            <div className="checkout-modal__badge">🎉</div>
            <h3 className="checkout-modal__title">Welcome{name ? `, ${name}` : ''}!</h3>
            <p className="checkout-modal__text">Your 7-day free trial just started. Message this number on WhatsApp to meet your tutor:</p>

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
              <p>💳 No charge until your trial ends. Cancel anytime.</p>
            </div>
          </>
        ) : (
          <>
            <div className="checkout-modal__badge checkout-modal__badge--muted">👋</div>
            <h3 className="checkout-modal__title">No worries!</h3>
            <p className="checkout-modal__text">You weren't charged. Come back whenever you're ready to start learning.</p>
          </>
        )}
      </div>
    </div>
  )
}
