import Stripe from 'stripe'
import { normalizePhone } from './_lib/phone.js'
import { findExistingStripeCustomerId } from './_lib/existing-customer.js'
import { envVar } from './_lib/env.js'

// Pinned to match the API version n8n's Stripe webhook destination is set to
// (confirmed in its "API-versie" field) — keeps event payload shapes in sync
// between what this creates and what n8n parses.
const stripe = new Stripe(envVar('STRIPE_SECRET_KEY'), { apiVersion: '2026-07-29.dahlia' })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const naam = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 100) : ''

  if (!naam) {
    return res.status(400).json({ error: 'Enter your name' })
  }

  const e164Phone = normalizePhone(req.body?.phone)

  if (!e164Phone) {
    return res.status(400).json({ error: 'Enter your WhatsApp number with country code, e.g. +31612345678' })
  }

  // n8n's sync workflow reads metadata.telefoonnummer (falling back to
  // client_reference_id), strips everything but digits, and prepends
  // "whatsapp:+" itself — so send it plain, no "+" or "whatsapp:" prefix needed.
  const telefoonnummer = e164Phone.replace(/\D/g, '')

  const existingCustomerId = await findExistingStripeCustomerId(telefoonnummer)

  const buildSessionParams = (customerId) => ({
    mode: 'subscription',
    line_items: [{ price: envVar('STRIPE_PRICE_ID'), quantity: 1 }],
    // Reuse the customer if this phone already paid before (e.g. resubscribing
    // after a cancellation) — otherwise Stripe creates a new one automatically.
    ...(customerId ? { customer: customerId } : {}),
    subscription_data: {
      trial_period_days: 7,
      // Also set here (not just on the session) — Checkout Session metadata
      // isn't copied onto the Subscription automatically, and n8n reads
      // these same fields off subscription-lifecycle events too.
      metadata: { telefoonnummer, naam },
    },
    client_reference_id: telefoonnummer,
    metadata: { telefoonnummer, naam },
    automatic_tax: { enabled: true },
    success_url: `${req.headers.origin}/?checkout=success`,
    cancel_url: `${req.headers.origin}/?checkout=cancelled`,
  })

  try {
    let session

    try {
      session = await stripe.checkout.sessions.create(buildSessionParams(existingCustomerId))
    } catch (err) {
      // A customer ID saved under test mode doesn't exist under live mode (and
      // vice versa) — Stripe rejects the reference outright. Fall back to
      // letting Stripe create a fresh customer rather than failing checkout.
      if (existingCustomerId && err?.code === 'resource_missing') {
        console.error('Stale stripe_customer_id, retrying without it:', existingCustomerId)
        session = await stripe.checkout.sessions.create(buildSessionParams(null))
      } else {
        throw err
      }
    }

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout session error:', err)
    res.status(500).json({ error: 'Could not start checkout' })
  }
}
