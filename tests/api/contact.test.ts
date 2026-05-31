import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
  },
}))

vi.mock('@/lib/email/resend', () => ({
  sendContactNotification: vi.fn().mockResolvedValue({ id: 'mock-id' }),
}))

function makeRequest(body: object) {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', message: 'hello' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error).toBeDefined()
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ name: 'Test', message: 'hello' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when message is missing', async () => {
    const res = await POST(makeRequest({ name: 'Test', email: 'a@b.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({ name: 'Test', email: 'notanemail', message: 'hello' }))
    expect(res.status).toBe(400)
  })

  it('returns 200 with valid data', async () => {
    const res = await POST(makeRequest({
      name: 'Brand Manager',
      brand: 'Coca-Cola',
      email: 'brand@coca-cola.com',
      message: 'We want to work with you',
      budget: '$10k–$50k',
    }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 200 with only required fields', async () => {
    const res = await POST(makeRequest({
      name: 'Fan',
      email: 'fan@example.com',
      message: 'Love your content',
    }))
    expect(res.status).toBe(200)
  })
})
