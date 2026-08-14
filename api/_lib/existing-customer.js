import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Read-only lookup against the bot's own table — n8n still owns every write.
// If this phone number already has a Stripe customer on file (e.g. they
// cancelled and are resubscribing), reuse it instead of letting Stripe mint a
// fresh one, which would break n8n's stripe_customer_id fallback matching on
// subscription-lifecycle events.
export async function findExistingStripeCustomerId(telefoonnummer) {
  const { data, error } = await supabase
    .from('gebruikers')
    .select('stripe_customer_id')
    .eq('telefoonnummer', `whatsapp:+${telefoonnummer}`)
    .maybeSingle()

  if (error) {
    console.error('Supabase customer lookup failed:', error)
    return null // fail open — worst case Stripe creates a new customer, same as before this existed
  }

  return data?.stripe_customer_id || null
}
