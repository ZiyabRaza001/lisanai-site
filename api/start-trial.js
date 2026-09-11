import { Resend } from 'resend'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { envVar } from './_lib/env.js'
import { buildWelcomeEmailHtml, buildWelcomeEmailText } from './_lib/welcomeEmail.js'

// Card-free trial signup. Replaces the old flow where this page redirected
// straight to a Stripe Payment Link — no Stripe involved here at all. n8n
// owns the actual trial-clock bookkeeping in Supabase (same split as the
// Stripe webhook in send-welcome-email.js, which only ever sends email and
// never writes to Supabase itself); this endpoint's job is just: validate,
// hand the signup to n8n, and send the welcome email once n8n confirms it.
const resend = new Resend(envVar('RESEND_API_KEY'))

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed.startsWith('+')) return null
  const parsed = parsePhoneNumberFromString(trimmed)
  if (!parsed || !parsed.isValid()) return null
  return parsed.number
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const name = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 100) : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().slice(0, 200) : ''
  const rawPhone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : ''

  if (!name || !email || !EMAIL_PATTERN.test(email) || !rawPhone) {
    return res.status(400).json({ error: 'Fill in your name, email, and WhatsApp number.' })
  }

  const phone = normalizePhone(rawPhone)
  if (!phone) {
    return res.status(400).json({ error: 'Enter your WhatsApp number with country code, e.g. +31612345678' })
  }

  const webhookUrl = envVar('N8N_TRIAL_SIGNUP_WEBHOOK_URL')
  if (!webhookUrl) {
    console.error('N8N_TRIAL_SIGNUP_WEBHOOK_URL is not set')
    return res.status(500).json({ error: 'Signup is temporarily unavailable — try again shortly.' })
  }

  // Record the trial in n8n/Supabase first. If this fails, stop here rather
  // than sending a welcome email for a trial that was never actually
  // recorded — the 7-day clock and paywall gate both depend on this write.
  try {
    const webhookSecret = envVar('N8N_TRIAL_SIGNUP_SECRET')
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(webhookSecret ? { 'x-webhook-secret': webhookSecret } : {}),
      },
      body: JSON.stringify({ name, email, phone }),
    })

    if (!webhookRes.ok) {
      // n8n can reject a signup on purpose (e.g. phone already has an active
      // trial/subscription) — try to surface that message instead of a
      // generic error.
      let message = 'Could not start your trial — try again in a moment.'
      try {
        const body = await webhookRes.json()
        if (body?.error) message = body.error
      } catch {
        // non-JSON error body — fall back to the generic message above
      }
      return res.status(webhookRes.status === 409 ? 409 : 502).json({ error: message })
    }
  } catch (err) {
    console.error('Failed to reach trial-signup webhook:', err)
    return res.status(502).json({ error: 'Could not start your trial — try again in a moment.' })
  }

  const waNumber = envVar('VITE_WHATSAPP_NUMBER')
  if (waNumber) {
    const waLink = `https://wa.me/${waNumber}?text=start`
    try {
      await resend.emails.send({
        from: 'LisanAI <welcome@mail.lisanai.net>',
        to: email,
        subject: 'Welcome to LisanAI! Your free trial has started 🎉',
        text: buildWelcomeEmailText(name, waNumber, waLink),
        html: buildWelcomeEmailHtml(name, waNumber, waLink),
      })
    } catch (err) {
      // The trial is already recorded in n8n/Supabase at this point, so
      // don't fail the request over an email hiccup — log it and let the
      // success response (and on-page popup) still carry the WhatsApp
      // number through.
      console.error('Failed to send trial welcome email:', err)
    }
  } else {
    console.error('Trial welcome email skipped — VITE_WHATSAPP_NUMBER is not set')
  }

  res.status(200).json({ success: true })
}
