import { useState } from 'react'
import './App.css'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import CheckoutStatusModal from './components/CheckoutStatusModal'
import Hero from './sections/Hero'
import LogoStrip from './sections/LogoStrip'
import Features from './sections/Features'
import Demo from './sections/Demo'
import HowItWorks from './sections/HowItWorks'
import Pricing from './sections/Pricing'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './components/Footer'

function App() {
  const [trialModal, setTrialModal] = useState({ open: false, name: '' })

  return (
    <>
      <CheckoutStatusModal
        open={trialModal.open}
        name={trialModal.name}
        onClose={() => setTrialModal({ open: false, name: '' })}
      />
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <Demo />
        <HowItWorks />
        <Pricing onTrialStarted={(name) => setTrialModal({ open: true, name })} />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}

export default App
