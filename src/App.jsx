import { useState } from 'react'
import './App.css'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import SignupSuccessModal from './components/SignupSuccessModal'
import Hero from './sections/Hero'
import WhyWhatsApp from './sections/WhyWhatsApp'
import Features from './sections/Features'
import Demo from './sections/Demo'
import HowItWorks from './sections/HowItWorks'
import Signup from './sections/Signup'
import FAQ from './sections/FAQ'
import About from './sections/About'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './components/Footer'

function App() {
  const [signupModal, setSignupModal] = useState({ open: false, name: '' })

  return (
    <>
      <SignupSuccessModal
        open={signupModal.open}
        name={signupModal.name}
        onClose={() => setSignupModal({ open: false, name: '' })}
      />
      <Navbar />
      <main>
        <Hero />
        <WhyWhatsApp />
        <Features />
        <Demo />
        <HowItWorks />
        <Signup onSignupComplete={(name) => setSignupModal({ open: true, name })} />
        <FAQ />
        <About />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}

export default App
