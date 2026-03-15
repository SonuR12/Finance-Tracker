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

    const db = await getDb()
    await db.collection('users').insertOne({
      email: pending.email,
      name: pending.name,
      password: pending.password,
      role: 'user',
      provider: 'credentials',
      emailVerified: true,
      createdAt: new Date(),
    })

    pendingUsers.delete(email)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}
