import { NextRequest, NextResponse } from 'next/server'

const store = new Map<string, { count: number; reset: number }>()

export function rateLimit(req: NextRequest, limit = 10, windowMs = 60_000) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const key = `${req.nextUrl.pathname}:${ip}`
  const now = Date.now()

  const entry = store.get(key)
  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs })
    return null
  }

  entry.count++
  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.reset - now) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  return null
}
