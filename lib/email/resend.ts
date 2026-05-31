import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export async function sendContactNotification(data: {
  name: string
  brand?: string | null
  email: string
  message: string
  budget?: string | null
}) {
  const lines = [
    `Name: ${data.name}`,
    data.brand ? `Brand: ${data.brand}` : null,
    `Email: ${data.email}`,
    data.budget ? `Budget: ${data.budget}` : null,
    ``,
    `Message:`,
    data.message,
  ].filter((l) => l !== null)

  return getResend().emails.send({
    from: 'FLAMINGEOS <noreply@flamingeos.com>',
    to: 'hq@flamingeos.com',
    replyTo: data.email,
    subject: `New inquiry from ${data.name}${data.brand ? ` — ${data.brand}` : ''}`,
    text: lines.join('\n'),
  })
}
