import Stripe from 'stripe'
import { normalizePhone } from './_lib/subscribers.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const whatsappNumber = normalizePhone(req.body?.phone)

  if (!whatsappNumber) {
    return res.status(400).json({ error: 'Enter your WhatsApp number with country code, e.g. +31612345678' })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        // Metadata set here (not just on the session) so it's still readable
        // from subscription-lifecycle webhook events later on.
        metadata: { whatsapp_number: whatsappNumber },
      },
      client_reference_id: whatsappNumber,
      metadata: { whatsapp_number: whatsappNumber },
      automatic_tax: { enabled: true },
      success_url: `${req.headers.origin}/?checkout=success`,
      cancel_url: `${req.headers.origin}/?checkout=cancelled`,
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout session error:', err)
    res.status(500).json({ error: 'Could not start checkout' })
  }
}
