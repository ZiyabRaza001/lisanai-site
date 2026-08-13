import { useState } from 'react'
import './FAQ.css'
import { waLink } from '../lib/whatsapp'

const faqs = [
  {
    q: 'How do I start learning?',
    a: 'Just send a message to the LisanAI WhatsApp number and say "hi" or "start". Your tutor introduces itself and asks whether you want guided lessons or free-chat practice. No app, no signup form.',
  },
  {
    q: 'Do I need WhatsApp Business?',
    a: 'No. LisanAI works with regular WhatsApp — you never need a business account. It just shows up as a normal contact.',
  },
  {
    q: 'Can I send voice notes instead of typing?',
    a: 'Yes. Send a voice note in Arabic or English and it\'s automatically transcribed and understood — no need to type a word if you\'d rather speak.',
  },
  {
    q: 'Do I have to type in Arabic script?',
    a: 'No. Type Arabic letters, plain English, or typed transliteration like "ayna al bayt" — it understands all three and always replies with the correct Arabic script so you learn to recognize it too.',
  },
  {
    q: 'What happens when I get something wrong?',
    a: 'It won\'t just mark your answer wrong. It points to the exact word or ending that\'s off, explains the grammar rule behind it, and gives you another try — the same way a real tutor would correct you.',
  },
  {
    q: 'What level do I start at?',
    a: 'Everyone starts at beginner by default, and the tutor adjusts patiently as you progress. If you\'re already comfortable with the basics, just tell it and it adapts.',
  },
  {
    q: 'What happens if I stop and come back later?',
    a: 'Your progress and current level are saved automatically. Come back days later and say hi — it already knows exactly where you left off, no repeating yourself.',
  },
  {
    q: 'Can I switch between lessons and free conversation?',
    a: 'Yes. A simple menu lets you switch between "guided lessons" mode and "just chat and practice" mode whenever you like, and it keeps context across both.',
  },
  {
    q: 'How are lessons structured?',
    a: 'Every lesson covers grammar with real examples, the full vocabulary list word by word with pronunciation and meaning, and finishes with a short practice exercise — clearly organized so nothing feels overwhelming.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your messages and learning data are stored encrypted and never shared with third parties. WhatsApp conversations are end-to-end encrypted the same way any WhatsApp chat is.',
  },
]

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? 'faq-item--open' : ''}`} onClick={onClick}>
      <div className="faq-item__question">
        <span>{faq.q}</span>
        <div className="faq-item__icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="faq-item__answer">
        <p>{faq.a}</p>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq__inner">
          <div className="faq__header">
            <div className="section-tag">FAQ</div>
            <h2 className="section-title">
              Frequently asked<br />
              <span className="faq__title-accent">questions</span>
            </h2>
            <p className="section-subtitle">
              Don't see your question? Send us a WhatsApp message.
            </p>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '8px', width: 'fit-content' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white"/>
              </svg>
              Send a WhatsApp message
            </a>
          </div>

          <div className="faq__list">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
