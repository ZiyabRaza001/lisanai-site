import { parsePhoneNumberFromString } from 'libphonenumber-js'

// Same validation the old server-side flow used — now runs client-side since
// there's no server round-trip needed before redirecting to a static Payment
// Link. Requires a leading "+" with country code; rejects anything without one.
export function normalizePhone(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed.startsWith('+')) return null
  const parsed = parsePhoneNumberFromString(trimmed)
  if (!parsed || !parsed.isValid()) return null
  return parsed.number
}
