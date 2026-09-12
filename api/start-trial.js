import { Resend } from 'resend'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { envVar } from './_lib/env.js'
import { supabase } from './_lib/supabase.js'
import { buildWelcomeEmailHtml, buildWelcomeEmailText } from './_lib/welcomeEmail.js'

// Card-free trial signup. Replaces the old flow where this page redirected
// straight to a Stripe Payment Link — no Stripe involved here at all.
// Writes the trial row directly to the same `gebruikers` table the bot reads
// (see the "Heeft Actief Abonnement?" n8n node) — abonnement_status/
// abonnement_verloopt_op are set to exactly what that node's condition
// checks for, so a fresh signup passes the same gate a real Stripe
// subscription would.
const resend = new Resend(envVar('RESEND_API_KEY'))

const TRIAL_LENGTH_DAYS = 7

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

  // Must match the exact format the bot itself writes/reads for this column
  // — Twilio's WhatsApp sender id, e.g. "whatsapp:+31686398954" — so a row
  // created here is the same row the bot finds on someone's first message.
  const telefoonnummer = `whatsapp:${phone}`

  // Record the trial first. If this fails, stop here rather than sending a
  // welcome email for a trial that was never actually recorded — the 7-day
  // clock and the bot's paywall gate both depend on this row existing.
  const { data: existing, error: lookupError } = await supabase
    .from('gebruikers')
    .select('id')
    .eq('telefoonnummer', telefoonnummer)
    .maybeSingle()

  if (lookupError) {
    console.error('Failed to look up existing gebruikers row:', lookupError)
    return res.status(502).json({ error: 'Could not start your trial — try again in a moment.' })
  }

  if (existing) {
    // Don't touch an existing row from here — it may belong to a real
    // paying customer with live Stripe IDs on it. A signup form is not the
    // place to silently overwrite that.
    return res.status(409).json({ error: 'Looks like you already have an account — just message LisanAI on WhatsApp to continue.' })
  }

  const trialEndsAt = new Date(Date.now() + TRIAL_LENGTH_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { error: insertError } = await supabase.from('gebruikers').insert({
    telefoonnummer,
    naam: name,
    email,
    abonnement_status: 'active',
    abonnement_verloopt_op: trialEndsAt,
    modus: 'geen_modus',
  })

  if (insertError) {
    console.error('Failed to insert trial signup:', insertError)
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
      // The trial is already recorded in Supabase at this point, so don't
      // fail the request over an email hiccup — log it and let the
      // success response (and on-page popup) still carry the WhatsApp
      // number through.
      console.error('Failed to send trial welcome email:', err)
    }
  } else {
    console.error('Trial welcome email skipped — VITE_WHATSAPP_NUMBER is not set')
  }

  res.status(200).json({ success: true })
}
