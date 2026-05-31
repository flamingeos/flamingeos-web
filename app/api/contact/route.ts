import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contactInquiries } from '@/lib/db/schema'
import { sendContactNotification } from '@/lib/email/resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, brand, email, message, budget } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      )
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    await db.insert(contactInquiries).values({
      name: String(name).trim(),
      brand: brand ? String(brand).trim() : null,
      email: String(email).trim().toLowerCase(),
      message: String(message).trim(),
      budget: budget ? String(budget).trim() : null,
    })

    await sendContactNotification({ name, brand, email, message, budget })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[contact] error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
