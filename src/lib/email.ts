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

export function getVerificationEmailTemplate(code: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Finance App'
  return `
<div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:Arial,sans-serif;">
  <h2 style="margin:0 0 16px 0;">Verify your ${site} account</h2>
  <p style="font-size:15px;color:#444;margin:0 0 24px 0;">Enter this code to complete your sign-up. Valid for 10 minutes.</p>
  <div style="font-size:42px;font-weight:bold;letter-spacing:10px;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;margin-bottom:24px;">
    ${code}
  </div>
  <p style="font-size:13px;color:#888;">If you didn't create an account, ignore this email.</p>
</div>`
}

export function getPasswordResetEmailTemplate(code: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_NAME || 'Finance App'
  return `
<div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:Arial,sans-serif;">
  <h2 style="margin:0 0 16px 0;">Reset your ${site} password</h2>
  <p style="font-size:15px;color:#444;margin:0 0 24px 0;">Enter this code to reset your password. Valid for 10 minutes.</p>
  <div style="font-size:42px;font-weight:bold;letter-spacing:10px;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;margin-bottom:24px;">
    ${code}
  </div>
  <p style="font-size:13px;color:#888;">If you didn't request a password reset, ignore this email.</p>
</div>`
}
