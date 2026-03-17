import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const db = await getDb()
    const user = await db.collection('users').findOne(
      { email, provider: { $in: ['credentials', 'both'] } },
      { projection: { emailVerified: 1, name: 1 } }
    )
    if (!user) return NextResponse.json({ exists: false })
    return NextResponse.json({ exists: true, emailVerified: user.emailVerified, name: user.name })
  } catch {
    return NextResponse.json({ exists: false }, { status: 500 })
  }
}
