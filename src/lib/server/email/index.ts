import { Resend } from 'resend'
import { env } from '../env'

export interface Email {
  to: string | string[]
  subject: string
  text: string
  html: string
}

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null

/** Placeholder addresses for email-less students. Never send to these. */
export const isPlaceholderEmail = (email: string) => email.endsWith('.invalid')

/** Sends via Resend. Without RESEND_API_KEY (local dev), logs instead. */
export async function sendEmail(email: Email) {
  const to = [email.to].flat().filter((e) => !isPlaceholderEmail(e))
  if (to.length === 0) return

  if (!resend) {
    console.info(
      `\n[email] to=${to.join(', ')}\n[email] subject=${email.subject}\n${email.text}\n`
    )
    return
  }

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
  if (error) throw new Error(`Email send failed: ${error.message}`)
}
