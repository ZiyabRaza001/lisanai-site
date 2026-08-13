import Stripe from 'stripe'
import { setSubscriber } from './_lib/subscribers.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Maps Stripe's subscription statuses down to the three states the bot
// actually needs to distinguish.
function mapStatus(stripeStatus) {
  if (stripeStatus === 'trialing') return 'trialing'
  if (stripeStatus === 'active') return 'active'
  return 'inactive' // past_due, canceled, unpaid, incomplete, incomplete_expired, paused
}

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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const whatsappNumber = session.metadata?.whatsapp_number || session.client_reference_id
        if (whatsappNumber) {
          await setSubscriber(whatsappNumber, {
            status: 'trialing',
            customerId: session.customer,
            subscriptionId: session.subscription,
          })
        }
        break
      }

      // Covers trial → active conversion, renewals, past-due, and reactivations —
      // anything that changes what the subscription's current status is.
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object
        const whatsappNumber = subscription.metadata?.whatsapp_number
        if (whatsappNumber) {
          await setSubscriber(whatsappNumber, {
            status: mapStatus(subscription.status),
            customerId: subscription.customer,
            subscriptionId: subscription.id,
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
          const whatsappNumber = subscription.metadata?.whatsapp_number
          if (whatsappNumber) {
            await setSubscriber(whatsappNumber, {
              status: 'inactive',
              customerId: subscription.customer,
              subscriptionId: subscription.id,
              lastFailedInvoice: invoice.id,
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const whatsappNumber = subscription.metadata?.whatsapp_number
        if (whatsappNumber) {
          await setSubscriber(whatsappNumber, {
            status: 'inactive',
            customerId: subscription.customer,
            subscriptionId: subscription.id,
          })
        }
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error('Failed to process webhook event:', event.type, err)
    // Stripe retries on non-2xx, so surface the failure instead of silently
    // swallowing it — a missed status update means the bot gates the wrong people.
    return res.status(500).json({ error: 'Failed to process event' })
  }

  res.status(200).json({ received: true })
}
