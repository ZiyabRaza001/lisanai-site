import './App.css'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import WhyWhatsApp from './sections/WhyWhatsApp'
import Features from './sections/Features'
import Demo from './sections/Demo'
import HowItWorks from './sections/HowItWorks'
import FAQ from './sections/FAQ'
import About from './sections/About'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyWhatsApp />
        <Features />
        <Demo />
        <HowItWorks />
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
