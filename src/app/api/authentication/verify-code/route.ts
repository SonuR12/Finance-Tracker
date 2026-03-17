import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { pendingUsers } from '../signup/route'

export async function POST(req: Request) {
  try {
    const { code, email } = await req.json()

    const pending = pendingUsers.get(email)
    if (!pending) {
      return NextResponse.json({ error: 'Verification session expired. Please sign up again.' }, { status: 404 })
    }

    if (pending.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
    }

    if (pending.expires < new Date()) {
      pendingUsers.delete(email)
      return NextResponse.json({ error: 'Code expired. Please sign up again.' }, { status: 400 })
    }

    const AVATAR_COLORS = [
      'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
      'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
    ]
    const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]

    const db = await getDb()
    const existing = await db.collection('users').findOne({ email: pending.email })
    if (existing) {
      // Google user adding credentials — merge
      await db.collection('users').updateOne(
        { email: pending.email },
        { $set: { password: pending.password, provider: 'both', emailVerified: true } }
      )
    } else {
      await db.collection('users').insertOne({
        email: pending.email,
        name: pending.name,
        password: pending.password,
        role: 'user',
        provider: 'credentials',
        emailVerified: true,
        avatarColor,
        createdAt: new Date(),
      })
    }

    pendingUsers.delete(email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
