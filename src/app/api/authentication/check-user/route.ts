import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const db = await getDb()
    // Check by provider field OR by presence of a password (handles corrupted provider state in prod)
    const user = await db.collection('users').findOne(
      { email, $or: [{ provider: { $in: ['credentials', 'both'] } }, { password: { $exists: true } }] },
      { projection: { emailVerified: 1, name: 1, provider: 1, password: 1 } }
    )
    if (!user) return NextResponse.json({ exists: false })

    // Self-heal: if password exists but provider is wrong, fix it
    if (user.password !== undefined && user.provider === 'google') {
      await db.collection('users').updateOne({ email }, { $set: { provider: 'both' } })
    }

    return NextResponse.json({ exists: true, emailVerified: user.emailVerified, name: user.name })
  } catch {
    return NextResponse.json({ exists: false }, { status: 500 })
  }
}
