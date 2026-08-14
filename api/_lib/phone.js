import { parsePhoneNumberFromString } from 'libphonenumber-js'

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
