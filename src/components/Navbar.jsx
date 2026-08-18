import { useState, useEffect } from 'react'
import './Navbar.css'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <a href="#" className="navbar__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <div className="navbar__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.514 5.82L0 24l6.335-1.661A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.207-1.248-6.219-3.48-8.52z" fill="white"/>
            </svg>
          </div>
          <span className="navbar__logo-text">Lisan<span>AI</span></span>
        </a>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__link"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a href="#pricing" className="btn btn-primary navbar__cta--mobile" onClick={(e) => handleNavClick(e, '#pricing')}>
            Start learning free
          </a>
        </nav>

        <div className="navbar__actions">
          <a href="#pricing" className="btn btn-primary" onClick={(e) => handleNavClick(e, '#pricing')}>
            Start learning free
          </a>
          <button
            className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
