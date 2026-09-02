import { Resend } from 'resend'
import { envVar } from './_lib/env.js'

const resend = new Resend(envVar('RESEND_API_KEY'))
const CONTACT_EMAIL = 'lisanaiservice@outlook.com'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const name = typeof req.body?.name === 'string' ? req.body.name.trim().slice(0, 100) : ''
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().slice(0, 200) : ''
  const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim().slice(0, 150) : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim().slice(0, 5000) : ''

  if (!name || !email || !EMAIL_PATTERN.test(email) || !subject || !message) {
    return res.status(400).json({ error: 'Fill in your name, a valid email, a subject, and a message.' })
  }

  try {
    const { error } = await resend.emails.send({
      from: 'LisanAI Contact Form <contact@mail.lisanai.net>',
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[LisanAI contact] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    })

    if (error) throw error

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Failed to send contact email:', err)
    res.status(500).json({ error: 'Could not send your message — try again in a moment.' })
  }
}
