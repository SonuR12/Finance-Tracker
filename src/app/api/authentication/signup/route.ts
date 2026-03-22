import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 5, 60_000)
  if (limited) return limited

  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection('users').findOne({ email })
    if (existing && existing.provider !== 'google') {
      return NextResponse.json({ error: 'Account already exists. Please sign in.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const code = generateVerificationCode()
    const expires = generateCodeExpiry()

    await db.collection('pendingVerifications').updateOne(
      { email },
      { $set: { email, password: hashedPassword, name: name || email.split('@')[0], code, expires } },
      { upsert: true }
    )

    await sendEmail(email, 'Verify your Finance App account', getVerificationEmailTemplate(code))

    return NextResponse.json({ success: true, message: 'Verification code sent to your email!' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 })
  }
}
