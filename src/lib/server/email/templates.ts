import type { Email } from '.'

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

/** Plain layout: one heading, paragraphs, optional button. */
function layout(opts: {
  heading: string
  paragraphs: string[]
  action?: { label: string; url: string }
}): Pick<Email, 'text' | 'html'> {
  const text = [
    opts.heading,
    '',
    ...opts.paragraphs,
    ...(opts.action ? ['', `${opts.action.label}: ${opts.action.url}`] : []),
    '',
    '— Nacho Stocks',
  ].join('\n')

  const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f5f5;font-family:system-ui,-apple-system,sans-serif;color:#171717">
<table role="presentation" width="100%" style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:32px">
<tr><td>
<h1 style="font-size:20px;margin:0 0 16px">${escape(opts.heading)}</h1>
${opts.paragraphs.map((p) => `<p style="font-size:15px;line-height:1.5;margin:0 0 12px">${escape(p)}</p>`).join('\n')}
${
  opts.action
    ? `<p style="margin:24px 0"><a href="${escape(opts.action.url)}" style="background:#171717;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">${escape(opts.action.label)}</a></p>
<p style="font-size:12px;color:#737373;word-break:break-all">${escape(opts.action.url)}</p>`
    : ''
}
<p style="font-size:12px;color:#737373;margin-top:24px">Nacho Stocks — paper trading for classrooms.</p>
</td></tr></table></body></html>`

  return { text, html }
}

export const verifyEmail = (url: string) => ({
  subject: 'Verify your email',
  ...layout({
    heading: 'Verify your email',
    paragraphs: [
      'Confirm this email address for your Nacho Stocks account.',
      'If you didn’t sign up, you can ignore this email.',
    ],
    action: { label: 'Verify email', url },
  }),
})

export const resetPassword = (url: string) => ({
  subject: 'Reset your password',
  ...layout({
    heading: 'Reset your password',
    paragraphs: [
      'Someone asked to reset the password for your Nacho Stocks account.',
      'If it wasn’t you, ignore this email. Your password won’t change.',
    ],
    action: { label: 'Choose a new password', url },
  }),
})

export const classroomRequested = (opts: {
  username: string
  email: string
  schoolName: string
  className: string
  adminUrl: string
}) => ({
  subject: `Classroom request: ${opts.className} at ${opts.schoolName}`,
  ...layout({
    heading: 'New classroom request',
    paragraphs: [
      `@${opts.username} (${opts.email}) requested “${opts.className}” at ${opts.schoolName}.`,
    ],
    action: { label: 'Review requests', url: opts.adminUrl },
  }),
})

export const classroomApproved = (opts: {
  className: string
  url: string
}) => ({
  subject: `Your classroom “${opts.className}” is ready`,
  ...layout({
    heading: 'Your classroom is ready',
    paragraphs: [
      `“${opts.className}” has been approved.`,
      'Open it to find your join code and share it with your students.',
    ],
    action: { label: 'Open classroom', url: opts.url },
  }),
})

export const classroomRejected = (opts: {
  className: string
  reason: string | null
}) => ({
  subject: `About your classroom request “${opts.className}”`,
  ...layout({
    heading: 'Classroom request not approved',
    paragraphs: [
      `We couldn’t approve “${opts.className}” right now.`,
      ...(opts.reason ? [`Reason: ${opts.reason}`] : []),
      'Reply to this email if you have questions.',
    ],
  }),
})
