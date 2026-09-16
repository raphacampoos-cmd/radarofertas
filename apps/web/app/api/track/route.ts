import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Proxy para a API com o IP real
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'

    await fetch(`${API_URL}/api/clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': ip,
        'user-agent': req.headers.get('user-agent') || '',
        'referer': req.headers.get('referer') || '',
      },
      body: JSON.stringify(body),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
