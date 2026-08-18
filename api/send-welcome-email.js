import Stripe from 'stripe'
import { Resend } from 'resend'

// Separate Stripe webhook endpoint from n8n's — this one only sends the
// welcome email, n8n still exclusively owns writing to Supabase. Register
// this URL as its own webhook destination in Stripe (checkout.session.completed
// only) and it gets its own signing secret, independent of n8n's.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-07-29.dahlia' })
const resend = new Resend(process.env.RESEND_API_KEY)

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end()
  }

  const signature = req.headers['stripe-signature']
  let event

  try {
    const rawBody = await buffer(req)
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const email = session.customer_details?.email
    const name = session.metadata?.naam || 'there'
    const waNumber = process.env.VITE_WHATSAPP_NUMBER
    const waLink = `https://wa.me/${waNumber}?text=start`

    if (email && waNumber) {
      try {
        await resend.emails.send({
          from: 'LisanAI <onboarding@resend.dev>',
          to: email,
          subject: "You're in! Here's how to start learning Arabic",
          text: `Hi ${name},\n\nYou're all set. Message LisanAI on WhatsApp to start your free 7-day trial:\n\n+${waNumber}\n\nOr just tap this link: ${waLink}\n\nSend "start" and your tutor takes it from there — no app to download, nothing else to set up.\n\nQuestions? Just reply to this email.\n\n— LisanAI`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
              <p>Hi ${name},</p>
              <p>You're all set. Message LisanAI on WhatsApp to start your free 7-day trial:</p>
              <p style="font-size: 20px; font-weight: 700; margin: 20px 0;">+${waNumber}</p>
              <p style="margin: 24px 0;">
                <a href="${waLink}" style="background: linear-gradient(135deg, #25D366, #128C7E); color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; display: inline-block;">
                  Message LisanAI on WhatsApp →
                </a>
              </p>
              <p>Send "start" and your tutor takes it from there — no app to download, nothing else to set up.</p>
              <p style="color: #6B7280; font-size: 14px;">Questions? Just reply to this email.</p>
              <p>— LisanAI</p>
            </div>
          `,
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
