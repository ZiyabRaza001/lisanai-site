import { track } from '@vercel/analytics/react'
import './CTA.css'
import { waLink } from '../lib/whatsapp'

export default function CTA() {
  const scrollTo = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="cta">
      <div className="cta__bg">
        <div className="cta__blob cta__blob--1" />
        <div className="cta__blob cta__blob--2" />
      </div>

      <div className="container cta__inner">
        <div className="cta__content">
          <div className="cta__wa-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>

          <h2 className="cta__title">
            Ready to finally<br />
            <span className="cta__title-accent">learn Arabic that sticks?</span>
          </h2>
          <p className="cta__subtitle">
            100% free — no credit card, ever.
          </p>

          <div className="cta__actions">
            <a
              href={waLink('start')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg cta__btn-primary"
              onClick={() => track('cta_click', { location: 'cta_section' })}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="currentColor"/>
              </svg>
              Start free — connect your WhatsApp
            </a>
            <button className="btn btn-ghost cta__btn-ghost" onClick={() => scrollTo('#demo')}>
              Watch demo
            </button>
          </div>

          <div className="cta__perks">
            {['✓ 100% free', '✓ No credit card', '✓ No catch', '✓ Works on any phone'].map((perk, i) => (
              <span key={i} className="cta__perk">{perk}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
