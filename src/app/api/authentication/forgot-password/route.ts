import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { generateVerificationCode, generateCodeExpiry, sendEmail, getPasswordResetEmailTemplate } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const db = await getDb()
    const user = await db.collection('users').findOne({ email, provider: 'credentials' })
    if (!user) {
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })
    }

    const code = generateVerificationCode()
    const expires = generateCodeExpiry()
    const hashedCode = await bcrypt.hash(code, 4)

    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { resetPasswordToken: hashedCode, resetPasswordExpires: expires } }
    )

    await sendEmail(email, 'Reset your Finance App password', getPasswordResetEmailTemplate(code))

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 })
  }
}
