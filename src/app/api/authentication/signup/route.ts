import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getVerificationEmailTemplate } from '@/lib/email'

// In-memory pending users (cleared on server restart — fine for dev/small scale)
export const pendingUsers = new Map<string, {
  email: string; password: string; name: string; code: string; expires: Date
}>()

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const db = await getDb()
    const existing = await db.collection('users').findOne({ email, provider: 'credentials' })
    if (existing) {
      return NextResponse.json({ error: 'Account already exists. Please sign in.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const code = generateVerificationCode()
    const expires = generateCodeExpiry()

    pendingUsers.set(email, {
      email,
      password: hashedPassword,
      name: name || email.split('@')[0],
      code,
      expires,
    })

    await sendEmail(email, 'Verify your Finance App account', getVerificationEmailTemplate(code))

    return NextResponse.json({ success: true, message: 'Verification code sent to your email!' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create account' }, { status: 500 })
  }
}
