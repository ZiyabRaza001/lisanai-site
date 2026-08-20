import './App.css'
import Navbar from './components/Navbar'
import CheckoutStatusModal from './components/CheckoutStatusModal'
import Hero from './sections/Hero'
import LogoStrip from './sections/LogoStrip'
import Features from './sections/Features'
import Demo from './sections/Demo'
import HowItWorks from './sections/HowItWorks'
import Pricing from './sections/Pricing'
import Testimonials from './sections/Testimonials'
import FAQ from './sections/FAQ'
import CTA from './sections/CTA'
import Contact from './sections/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <CheckoutStatusModal />
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <Demo />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
