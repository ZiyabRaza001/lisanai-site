import { createClient } from '@supabase/supabase-js'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Normalizes any phone input to E.164 (e.g. +31612345678). Requires a leading
// "+" with country code — WhatsApp numbers are meaningless without one, and
// guessing a country from a bare local number is unreliable.
export function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed.startsWith('+')) return null
  const parsed = parsePhoneNumberFromString(trimmed)
  if (!parsed || !parsed.isValid()) return null
  return parsed.number
}

export async function setSubscriber(phone, data) {
  const { error } = await supabase
    .from('subscribers')
    .upsert({ phone, ...data, updated_at: new Date().toISOString() }, { onConflict: 'phone' })
  if (error) throw error
}

export async function getSubscriber(phone) {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()
  if (error) throw error
  return data
}
