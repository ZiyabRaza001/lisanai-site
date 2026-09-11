const CUSTOMER_PORTAL_LINK = 'https://billing.stripe.com/p/login/bJe9ATeaQgbY5rufTT8N200'

export function buildWelcomeEmailHtml(name, waNumber, waLink) {
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
            Your 7-day free trial just started — no card, no charge. Message the number below on WhatsApp and your tutor takes it from there.
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
          <p style="font-size:13px;color:#9CA3AF;margin:0 0 10px;line-height:1.6;text-align:center;">
            Questions? Just reply to this email — we read every one.<br />
            — The LisanAI team
          </p>
          <p style="font-size:12px;color:#9CA3AF;margin:0;line-height:1.6;text-align:center;">
            <a href="${CUSTOMER_PORTAL_LINK}" style="color:#9CA3AF;">Manage or cancel your subscription</a>
          </p>
        </div>
      </div>
    </div>
  `
}

export function buildWelcomeEmailText(name, waNumber, waLink) {
  return `Welcome${name && name !== 'there' ? `, ${name}` : ''}! 🎉\n\nYour 7-day free trial just started — no card, no charge.\n\nMessage your Arabic tutor on WhatsApp to get going:\n\n+${waNumber}\n\nOr just tap this link: ${waLink}\n\nSend "start" and you're straight into your first lesson — no app to download, nothing else to set up.\n\nQuestions? Just reply to this email — we read every one.\n\n— The LisanAI team\n\nManage or cancel your subscription: ${CUSTOMER_PORTAL_LINK}`
}
