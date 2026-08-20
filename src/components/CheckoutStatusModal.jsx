import { useState, useEffect } from 'react'
import './CheckoutStatusModal.css'
import { waLink, waDisplayNumber } from '../lib/whatsapp'

export default function CheckoutStatusModal() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const checkout = params.get('checkout')
    if (checkout === 'success' || checkout === 'cancelled') {
      setStatus(checkout)
      params.delete('checkout')
      const query = params.toString()
      window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
    }
  }, [])

  if (!status) return null

  return (
    <div className="checkout-modal__overlay" onClick={() => setStatus(null)}>
      <div className="checkout-modal__card" onClick={(e) => e.stopPropagation()}>
        <button className="checkout-modal__close" onClick={() => setStatus(null)} aria-label="Close">×</button>

        {status === 'success' ? (
          <>
            <div className="checkout-modal__icon">🎉</div>
            <h3 className="checkout-modal__title">You're in!</h3>
            <p className="checkout-modal__text">Message this number on WhatsApp to start your free week:</p>
            <p className="checkout-modal__number">{waDisplayNumber()}</p>
            <a
              href={waLink('start')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg checkout-modal__cta"
            >
              Message LisanAI on WhatsApp →
            </a>
            <p className="checkout-modal__note">We've also sent this to your email — check spam if you don't see it.</p>
          </>
        ) : (
          <>
            <div className="checkout-modal__icon">👋</div>
            <h3 className="checkout-modal__title">Checkout cancelled</h3>
            <p className="checkout-modal__text">You weren't charged. Ready whenever you are.</p>
          </>
        )}
      </div>
    </div>
  )
}
