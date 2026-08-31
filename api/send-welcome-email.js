import Stripe from 'stripe'
import { Resend } from 'resend'
import { envVar } from './_lib/env.js'

// Separate Stripe webhook endpoint from n8n's — this one only sends the
// welcome email, n8n still exclusively owns writing to Supabase. Register
// this URL as its own webhook destination in Stripe (checkout.session.completed
// only) and it gets its own signing secret, independent of n8n's.
const stripe = new Stripe(envVar('STRIPE_SECRET_KEY'), { apiVersion: '2026-07-29.dahlia' })
const resend = new Resend(envVar('RESEND_API_KEY'))

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(readable) {
  const chunks = []
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

function buildEmailHtml(name, waNumber, waLink) {
  return `
    <div style="background:#F3F4F6;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <div style="max-width:480px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#25D366,#128C7E);border-radius:20px 20px 0 0;padding:36px 40px;text-align:center;">
          <div style="width:56px;height:56px;margin:0 auto 14px;background:rgba(255,255,255,0.2);border-radius:50%;line-height:56px;font-size:26px;">💬</div>
          <div style="color:white;font-size:15px;font-weight:700;letter-spacing:2px;text-transform:uppercase;opacity:0.85;margin-bottom:6px;">LisanAI</div>
          <h1 style="color:white;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.3px;">Welcome${name && name !== 'there' ? `, ${name}` : ''}! 🎉</h1>
        </div>
        <div style="background:white;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 20px 20px;padding:36px 40px;">
          <p style="font-size:15px;line-height:1.65;color:#374151;margin:0 0 24px;">
            Your 7-day free trial just started — no charge until it ends, cancel anytime. Message the number below on WhatsApp and your tutor takes it from there.
          </p>
          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:14px;padding:18px 20px;text-align:center;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6B7280;margin-bottom:6px;">Your Arabic tutor on WhatsApp</div>
            <div style="font-size:24px;font-weight:800;color:#111827;letter-spacing:0.5px;">+${waNumber}</div>
          </div>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${waLink}" style="background:linear-gradient(135deg,#25D366,#128C7E);color:white;padding:15px 34px;border-radius:999px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;box-shadow:0 8px 20px rgba(37,211,102,0.35);">
              Message LisanAI on WhatsApp →
            </a>
          </div>
          <p style="font-size:14px;line-height:1.6;color:#6B7280;margin:0 0 24px;text-align:center;">
            Just send <strong style="color:#111827;">"start"</strong> and you're straight into your first lesson — no app to download, nothing else to set up.
          </p>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:0 0 20px;" />
          <p style="font-size:13px;color:#9CA3AF;margin:0;line-height:1.6;text-align:center;">
            Questions? Just reply to this email — we read every one.<br />
            — The LisanAI team
          </p>
        </div>
      </div>
    </div>
  `
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const signature = req.headers['stripe-signature']
  let event

  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(rawBody, signature, envVar('STRIPE_WEBHOOK_SECRET'))
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email
    const name = session.metadata?.naam || 'there'
    const waNumber = envVar('VITE_WHATSAPP_NUMBER')
    const waLink = `https://wa.me/${waNumber}?text=start`

    if (email && waNumber) {
      try {
        await resend.emails.send({
          from: 'LisanAI <onboarding@resend.dev>',
          to: email,
          subject: 'Welcome to LisanAI! Your free trial has started 🎉',
          text: `Welcome${name && name !== 'there' ? `, ${name}` : ''}! 🎉\n\nYour 7-day free trial just started — no charge until it ends, cancel anytime.\n\nMessage your Arabic tutor on WhatsApp to get going:\n\n+${waNumber}\n\nOr just tap this link: ${waLink}\n\nSend "start" and you're straight into your first lesson — no app to download, nothing else to set up.\n\nQuestions? Just reply to this email — we read every one.\n\n— The LisanAI team`,
          html: buildEmailHtml(name, waNumber, waLink),
        })
      } catch (err) {
        // Log but don't fail the webhook — a 500 here would make Stripe retry
        // the whole event (risking duplicate emails) and repeated failures can
        // get the endpoint auto-disabled by Stripe.
        console.error('Failed to send welcome email:', err)
      }
    } else {
      console.error('Welcome email skipped — missing email or WhatsApp number', { hasEmail: !!email, hasNumber: !!waNumber })
    }
  }

  res.status(200).json({ received: true })
}
