import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getDb } from '@/lib/mongodb'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60_000)
  if (limited) return limited

  try {
    const { email } = await req.json()

    const db = await getDb()
    const pending = await db.collection('pendingVerifications').findOne({ email })
    if (!pending) {
      return NextResponse.json({ error: 'Verification session expired. Please sign up again.' }, { status: 404 })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()
    await db.collection('pendingVerifications').updateOne({ email }, { $set: { code, expires } })

    await sendEmail(email, 'Verify your Finance App account', getVerificationEmailTemplate(code))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to resend code' }, { status: 500 })
  }
}
