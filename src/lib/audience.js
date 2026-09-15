// Message-match variant for ad testing — e.g. a TikTok ad targeting a
// Qur'an/Muslim audience links to "https://www.lisanai.net/?v=quran" instead
// of the plain root URL, and the Hero swaps its headline to match the ad's
// promise. Everything else on the page (Demo, Pricing, FAQ, etc.) stays the
// same for both — this is a headline test, not two separate sites.
export function getAudienceVariant() {
  if (typeof window === 'undefined') return 'default'
  const params = new URLSearchParams(window.location.search)
  return params.get('v') === 'quran' ? 'quran' : 'default'
}
