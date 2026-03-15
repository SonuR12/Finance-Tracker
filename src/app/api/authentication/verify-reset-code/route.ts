import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { code, email, password } = await req.json()

    const db = await getDb()
    const user = await db.collection('users').findOne({ email, provider: 'credentials' })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.resetPasswordToken) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 })
    }

    const isValid = await bcrypt.compare(code, user.resetPasswordToken)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: '', resetPasswordExpires: '' },
      }
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
