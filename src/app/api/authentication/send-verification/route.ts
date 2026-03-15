import { NextResponse } from 'next/server'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'
import { pendingUsers } from '../signup/route'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const pending = pendingUsers.get(email)
    if (!pending) {
      return NextResponse.json({ error: 'Verification session expired. Please sign up again.' }, { status: 404 })
    }

    const code = generateVerificationCode()
    pending.code = code
    pending.expires = generateCodeExpiry()
    pendingUsers.set(email, pending)

    await sendEmail(email, 'Verify your Finance App account', getVerificationEmailTemplate(code))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 })
  }
}
