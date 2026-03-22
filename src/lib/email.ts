import nodemailer from 'nodemailer'
import crypto from 'crypto'

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateCodeExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!, // Gmail App Password (16-char, no spaces)
    },
  })

  await transporter.sendMail({
    from: `"${process.env.NEXT_PUBLIC_SITE_NAME || 'Finance App'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}

const P = (text: string) =>
  `<p style="margin:0 0 16px 0;font-size:15px;color:#1a1a1a;line-height:1.7;">${text}</p>`

function baseTemplate(body: string): string {
  const supportEmail = process.env.SMTP_USER || 'support@financetrack.com'
  const year = new Date().getFullYear()
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:32px 0;">
    <tr><td align="left" style="padding:0 32px;">
      <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

        <!-- Body -->
        <tr>
          <td style="padding:0 0 24px 0;">
            ${body}
          </td>
        </tr>

        <!-- Divider + reply note -->
        <tr>
          <td style="padding:0 0 16px 0;">
            <p style="margin:0 0 6px 0;font-size:13px;color:#555;">===============================================================</p>
            <p style="margin:0 0 6px 0;font-size:13px;color:#555;">For continued support regarding your query, please respond to this email sent from ${supportEmail}</p>
            <p style="margin:0 0 16px 0;font-size:13px;color:#555;">===============================================================</p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td>
            <p style="margin:0 0 6px 0;font-size:12px;color:#555;font-weight:700;">Finance Tracker, Inc. and affiliates</p>
            <p style="margin:0 0 6px 0;font-size:12px;color:#767676;line-height:1.6;">Finance Tracker, Inc. is a registered trademark. This message was produced and distributed by Finance Tracker, Inc. or its affiliates.</p>
            <p style="margin:0;font-size:12px;color:#767676;">&copy; ${year}, Finance Tracker, Inc. or its affiliates. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export function getVerificationEmailTemplate(code: string): string {
  const body = `
    ${P('Hello there,')}
    ${P('Thank you for signing up! To complete your registration and verify your email address, please use the one-time verification code below.')}
    ${P('We understand the importance of keeping your account secure. This code confirms that you are the owner of this email address.')}
    <p style="margin:0 0 24px 0;font-size:15px;color:#1a1a1a;line-height:1.7;">Your verification code is:</p>
    <p style="margin:0 0 24px 0;font-size:36px;font-weight:700;color:#232f3e;letter-spacing:10px;font-family:'Courier New',monospace;">${code}</p>
    ${P('This code is valid for <strong>10 minutes</strong>. Please do not share this code with anyone. Our support team will never ask you for this code.')}
    ${P('If you did not create an account with us, you can safely ignore this email. Someone may have entered your email address by mistake. Your email address will not be used without verification.')}
    ${P('If you have any questions or concerns, please don\'t hesitate to reply to this email. Our support team is available 24/7 to assist you.')}
    <p style="margin:0 0 4px 0;font-size:15px;color:#1a1a1a;">Best regards,</p>
    <p style="margin:0 0 4px 0;font-size:15px;color:#1a1a1a;font-weight:700;">Finance Tracker Support Team</p>
  `
  return baseTemplate(body)
}

export function getPasswordResetEmailTemplate(code: string): string {
  const body = `
    ${P('Hello there,')}
    ${P('We received a request to reset the password associated with your account. If you made this request, please use the one-time code below to proceed with resetting your password.')}
    ${P('We take the security of your account seriously. Our security team has logged this password reset request and will monitor your account for any unusual activity.')}
    <p style="margin:0 0 24px 0;font-size:15px;color:#1a1a1a;line-height:1.7;">Your password reset code is:</p>
    <p style="margin:0 0 24px 0;font-size:36px;font-weight:700;color:#232f3e;letter-spacing:10px;font-family:'Courier New',monospace;">${code}</p>
    ${P('This code is valid for <strong>10 minutes</strong>. For your security, please do not share this code with anyone. Our support team will <strong>never</strong> ask you for your password or this code.')}
    ${P('If you did not request a password reset, please ignore this email. Your password will remain unchanged and your account is safe. We recommend keeping an eye on your email inbox for any further updates regarding your account status.')}
    ${P('If you have any questions or concerns in the meantime, please don\'t hesitate to reply to this email. Our support team is available 24/7 to assist you.')}
    <p style="margin:0 0 4px 0;font-size:15px;color:#1a1a1a;">Best regards,</p>
    <p style="margin:0 0 4px 0;font-size:15px;color:#1a1a1a;font-weight:700;">Finance Tracker Support Team</p>
  `
  return baseTemplate(body)
}
