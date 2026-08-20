const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

export function waLink(text = '') {
  const params = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${WHATSAPP_NUMBER}${params}`
}

export function waDisplayNumber() {
  return `+${WHATSAPP_NUMBER}`
}
