// .trim() guards against a stray trailing newline from how the env var was
// pasted into Vercel — invisible there, but breaks anything doing exact
// string matching (same bug class that hit STRIPE_PRICE_ID).
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').trim()

export function waLink(text = '') {
  const params = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${WHATSAPP_NUMBER}${params}`
}

export function waDisplayNumber() {
  return `+${WHATSAPP_NUMBER}`
}
