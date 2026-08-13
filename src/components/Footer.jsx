import './Footer.css'

const footerLinks = {
  Product: ['Features', 'Demo', 'Pricing', 'Curriculum', 'Changelog'],
  Company: ['About us', 'Blog', 'Contact', 'WhatsApp us', 'Press'],
  Support: ['Help center', 'Documentation', 'Status', 'Book a demo', 'Onboarding'],
  Legal: ['Privacy policy', 'Terms of service', 'Data & cookies', 'Security'],
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white"/>
                </svg>
              </div>
              <span className="footer__logo-text">Lisan<span>AI</span></span>
            </div>
            <p className="footer__brand-desc">
              Your personal Arabic tutor on WhatsApp. Guided lessons, voice practice, and free conversation — all in one chat.
            </p>
            <div className="footer__socials">
              {['LinkedIn', 'Twitter', 'Facebook'].map(s => (
                <a key={s} href="#" className="footer__social" aria-label={s}>
                  {s === 'LinkedIn' && '💼'}
                  {s === 'Twitter' && '🐦'}
                  {s === 'Facebook' && '📘'}
                </a>
              ))}
            </div>
          </div>

          <div className="footer__links">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="footer__col">
                <h4 className="footer__col-title">{category}</h4>
                <ul className="footer__col-list">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="footer__link">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} LisanAI. All rights reserved.
          </p>
          <div className="footer__badges">
            <span className="footer__badge">🔒 Data encrypted</span>
            <span className="footer__badge">✅ Privacy-first</span>
            <span className="footer__badge">🌍 Learn from anywhere</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
