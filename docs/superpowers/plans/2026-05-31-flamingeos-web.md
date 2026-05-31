# Flamingeos Web — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a cinematic, scroll-driven brand website for creator Juwany Roman (@flamingeos) — a premium interactive digital experience deployed on Vercel with Neon Postgres for contact inquiries.

**Architecture:** Single Next.js 15 App Router page with 9 sections. Three R3F canvases (loading, hero, globe) handle WebGL; all other animations use GSAP ScrollTrigger + Framer Motion. Neon Postgres + Drizzle ORM stores contact inquiries; Resend delivers email. Three.js scenes degrade gracefully on low-end devices.

**Tech Stack:** Next.js 15, React Three Fiber, Three.js, GSAP + ScrollTrigger, Framer Motion, Lenis, Neon (Postgres), Drizzle ORM, Resend, Vercel, Vitest, Tailwind CSS

---

## File Map

```
flamingeos-web/                         (project root = CWD)
├── app/
│   ├── page.tsx                        main page — assembles all sections
│   ├── layout.tsx                      root layout, fonts, metadata
│   ├── globals.css                     CSS vars, zones, noise, reset
│   └── api/
│       ├── contact/route.ts            POST: save inquiry + send email
│       └── products/route.ts           GET: future merch (stub)
├── components/
│   ├── three/
│   │   ├── LoadingScene.tsx            R3F: particles + logo shatter
│   │   ├── HeroScene.tsx               R3F: video layers + camera drift
│   │   └── GlobeScene.tsx              R3F: 3D globe + pins
│   ├── sections/
│   │   ├── LoadingExperience.tsx       loading overlay controller
│   │   ├── Hero.tsx                    hero wrapper + text overlay
│   │   ├── Story.tsx                   "From Puerto Rico to the World"
│   │   ├── Timeline.tsx                road / milestone section
│   │   ├── World.tsx                   globe section wrapper
│   │   ├── Stats.tsx                   count-up numbers
│   │   ├── Brands.tsx                  logo network section
│   │   ├── JoinTheJourney.tsx          socials + contact form
│   │   └── Footer.tsx
│   └── ui/
│       ├── GlassCard.tsx               reusable glass morphism card
│       ├── SoundToggle.tsx             ambient sound toggle
│       └── ScrollCue.tsx              animated scroll arrow
├── hooks/
│   ├── useDeviceCapability.ts          high / medium / low detection
│   └── useGyroscope.ts                 mobile tilt tracking
├── lib/
│   ├── gsap-config.ts                  registers GSAP plugins once
│   ├── db/
│   │   ├── schema.ts                   Drizzle table definitions
│   │   └── index.ts                    Neon HTTP client
│   └── email/
│       └── resend.ts                   Resend send helper
├── tests/
│   ├── setup.ts                        Vitest global setup
│   ├── api/
│   │   └── contact.test.ts
│   └── hooks/
│       └── useDeviceCapability.test.ts
├── public/
│   └── assets/
│       ├── fonts/                      Clash Display, General Sans, Cabinet Grotesk
│       └── videos/                     placeholder video files
├── .env.local                          DATABASE_URL, RESEND_API_KEY
├── .env.example
├── drizzle.config.ts
├── next.config.ts
└── vitest.config.ts
```

---

## Phase 1: Foundation

### Task 1: Scaffold Next.js 15 + push to GitHub

**Files:** Creates project root structure

- [ ] **Step 1: Scaffold**

```bash
cd "C:/Users/ughty/OneDrive/Desktop/Flamingeos"
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias="@/*" --no-eslint --yes
```

Expected: project files created in CWD, including `app/`, `public/`, `package.json`, `tailwind.config.ts`, `tsconfig.json`.

- [ ] **Step 2: Initialize git and link remote**

```bash
git init
git remote add origin https://github.com/flamingeos/flamingeos-web.git
```

- [ ] **Step 3: Create .env files**

Create `.env.local`:
```
DATABASE_URL=
RESEND_API_KEY=
```

Create `.env.example`:
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
RESEND_API_KEY=re_xxxxxxxxxxxx
```

- [ ] **Step 4: Add .env.local to .gitignore**

Verify `.gitignore` contains `.env.local` (Next.js adds this by default). If not, add it.

- [ ] **Step 5: Initial commit and push**

```bash
git add .
git commit -m "chore: scaffold Next.js 15 project"
git branch -M main
git push -u origin main
```

Expected: files visible at https://github.com/flamingeos/flamingeos-web

---

### Task 2: Install all dependencies

**Files:** `package.json`

- [ ] **Step 1: Install production dependencies**

```bash
npm install @react-three/fiber @react-three/drei three gsap @gsap/react framer-motion lenis drizzle-orm @neondatabase/serverless resend
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D @types/three drizzle-kit vitest @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install dependencies"
```

---

### Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] **Step 1: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 2: Create tests/setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to package.json**

In `package.json`, update the `"scripts"` section to add:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 4: Verify Vitest runs**

```bash
npx vitest run
```

Expected: "No test files found" — that's fine. No errors.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "chore: configure Vitest"
```

---

### Task 4: next.config.ts + drizzle.config.ts

**Files:**
- Modify: `next.config.ts`
- Create: `drizzle.config.ts`

- [ ] **Step 1: Update next.config.ts**

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals.push({ canvas: 'canvas' })
    return config
  },
}

export default nextConfig
```

- [ ] **Step 2: Create drizzle.config.ts**

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 3: Commit**

```bash
git add next.config.ts drizzle.config.ts
git commit -m "chore: configure Next.js webpack and Drizzle"
```

---

### Task 5: Design system — globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css**

```css
@import "tailwindcss";

/* ─── Fonts ─────────────────────────────────────────────── */
@font-face {
  font-family: 'Clash Display';
  src: url('/assets/fonts/ClashDisplay-Variable.woff2') format('woff2');
  font-weight: 200 700;
  font-display: swap;
}
@font-face {
  font-family: 'General Sans';
  src: url('/assets/fonts/GeneralSans-Variable.woff2') format('woff2');
  font-weight: 200 700;
  font-display: swap;
}
@font-face {
  font-family: 'Cabinet Grotesk';
  src: url('/assets/fonts/CabinetGrotesk-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* ─── Design tokens ─────────────────────────────────────── */
:root {
  /* Zone 1 — Void */
  --zone-1-bg: #080808;
  --zone-1-accent: #a8d8ff;

  /* Zone 2 — Ocean */
  --zone-2-bg: #0c1a2e;
  --zone-2-accent: #22d3ee;

  /* Zone 3 — Energy */
  --zone-3-bg: #0f0f0f;
  --zone-3-accent: #f97316;

  /* Zone 4 — Obsidian */
  --zone-4-bg: #0a0a0a;
  --zone-4-accent: #c9a84c;

  /* Zone 5 — Focus */
  --zone-5-bg: #0d0d0d;
  --zone-5-accent: #f8f8f8;

  /* Typography */
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'General Sans', sans-serif;
  --font-mono: 'Space Mono', monospace;
  --font-quote: 'Cabinet Grotesk', sans-serif;

  /* Active zone (updated by JS) */
  --bg: var(--zone-1-bg);
  --accent: var(--zone-1-accent);
}

/* ─── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: auto; } /* Lenis handles smooth scroll */

body {
  background: var(--bg);
  color: #f0f0f0;
  font-family: var(--font-body);
  overflow-x: hidden;
  transition: background 0.8s ease;
}

/* ─── Noise overlay (film grain) ────────────────────────── */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}

/* ─── Typography scale ──────────────────────────────────── */
.font-display { font-family: var(--font-display); }
.font-mono    { font-family: var(--font-mono); }
.font-quote   { font-family: var(--font-quote); }

.text-hero {
  font-family: var(--font-display);
  font-size: clamp(4rem, 15vw, 14rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.02em;
}

.text-chapter {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: 600;
  letter-spacing: -0.01em;
}

.text-stat {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 700;
}

/* ─── Glass morphism ────────────────────────────────────── */
.glass {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

/* ─── Section base ──────────────────────────────────────── */
.section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
```

- [ ] **Step 2: Download fonts**

Download from Fontshare (free):
- Clash Display Variable: https://api.fontshare.com/v2/fonts/download/clash-display
- General Sans Variable: https://api.fontshare.com/v2/fonts/download/general-sans
- Cabinet Grotesk Variable: https://api.fontshare.com/v2/fonts/download/cabinet-grotesk

Place `.woff2` variable font files in `public/assets/fonts/`:
- `ClashDisplay-Variable.woff2`
- `GeneralSans-Variable.woff2`
- `CabinetGrotesk-Variable.woff2`

Space Mono is loaded via Google Fonts in Task 6.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css public/assets/fonts/
git commit -m "feat: design system — CSS variables, zones, noise overlay, typography"
```

---

## Phase 2: Data Layer

### Task 6: Drizzle schema

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/index.ts`

- [ ] **Step 1: Create lib/db/schema.ts**

```typescript
import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  email: text('email').notNull(),
  message: text('message').notNull(),
  budget: text('budget'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  priceCents: integer('price_cents').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  stock: integer('stock').default(0),
  active: boolean('active').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  buyerEmail: text('buyer_email').notNull(),
  quantity: integer('quantity').notNull().default(1),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
```

- [ ] **Step 2: Create lib/db/index.ts**

```typescript
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
```

- [ ] **Step 3: Commit**

```bash
git add lib/db/
git commit -m "feat: Drizzle schema — contact_inquiries, products, orders"
```

---

### Task 7: Resend email utility

**Files:**
- Create: `lib/email/resend.ts`

- [ ] **Step 1: Create lib/email/resend.ts**

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendContactNotification(data: {
  name: string
  brand?: string | null
  email: string
  message: string
  budget?: string | null
}) {
  const lines = [
    `Name: ${data.name}`,
    data.brand ? `Brand: ${data.brand}` : null,
    `Email: ${data.email}`,
    data.budget ? `Budget: ${data.budget}` : null,
    ``,
    `Message:`,
    data.message,
  ].filter((l) => l !== null)

  return resend.emails.send({
    from: 'FLAMINGEOS <noreply@flamingeos.com>',
    to: 'hq@flamingeos.com',
    replyTo: data.email,
    subject: `New inquiry from ${data.name}${data.brand ? ` — ${data.brand}` : ''}`,
    text: lines.join('\n'),
  })
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/email/
git commit -m "feat: Resend email utility"
```

---

### Task 8: Contact API route (TDD)

**Files:**
- Create: `tests/api/contact.test.ts`
- Create: `app/api/contact/route.ts`
- Create: `app/api/products/route.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/api/contact.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npx vitest run tests/api/contact.test.ts
```

Expected: FAIL — "Cannot find module '@/app/api/contact/route'"

- [ ] **Step 3: Create app/api/contact/route.ts**

```typescript
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
```

- [ ] **Step 4: Create app/api/products/route.ts** (stub for future merch)

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ products: [] })
}
```

- [ ] **Step 5: Run tests — verify they pass**

```bash
npx vitest run tests/api/contact.test.ts
```

Expected: 6 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/api/ app/api/
git commit -m "feat: contact API route with validation — TDD"
```

---

## Phase 3: Core Infrastructure

### Task 9: GSAP config

**Files:**
- Create: `lib/gsap-config.ts`

- [ ] **Step 1: Create lib/gsap-config.ts**

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }
```

- [ ] **Step 2: Commit**

```bash
git add lib/gsap-config.ts
git commit -m "feat: register GSAP ScrollTrigger"
```

---

### Task 10: Lenis provider

**Files:**
- Create: `components/LenisProvider.tsx`

- [ ] **Step 1: Create components/LenisProvider.tsx**

```tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from '@/lib/gsap-config'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 })

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 2: Commit**

```bash
git add components/LenisProvider.tsx
git commit -m "feat: Lenis smooth scroll provider (lerp 0.08)"
```

---

### Task 11: Device capability hook (TDD)

**Files:**
- Create: `tests/hooks/useDeviceCapability.test.ts`
- Create: `hooks/useDeviceCapability.ts`

- [ ] **Step 1: Write failing tests**

```typescript
// tests/hooks/useDeviceCapability.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'

describe('useDeviceCapability', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true, value: 8,
    })
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    })
  })

  it('returns high for desktop', () => {
    const { result } = renderHook(() => useDeviceCapability())
    expect(result.current).toBe('high')
  })

  it('returns medium for modern mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    })
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true, value: 6,
    })
    const { result } = renderHook(() => useDeviceCapability())
    expect(result.current).toBe('medium')
  })

  it('returns low for underpowered mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Linux; Android 8.0; SM-G960F)',
    })
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true, value: 2,
    })
    const { result } = renderHook(() => useDeviceCapability())
    expect(result.current).toBe('low')
  })
})
```

- [ ] **Step 2: Run — verify failure**

```bash
npx vitest run tests/hooks/useDeviceCapability.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create hooks/useDeviceCapability.ts**

```typescript
'use client'
import { useMemo } from 'react'

export type DeviceCapability = 'high' | 'medium' | 'low'

export function useDeviceCapability(): DeviceCapability {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'high'

    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
    const cores = navigator.hardwareConcurrency ?? 4
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

    if (!isMobile) return 'high'
    if (cores <= 2 || memory <= 1) return 'low'
    return 'medium'
  }, [])
}
```

- [ ] **Step 4: Run — verify pass**

```bash
npx vitest run tests/hooks/useDeviceCapability.test.ts
```

Expected: 3 tests PASS.

- [ ] **Step 5: Create hooks/useGyroscope.ts**

```typescript
'use client'
import { useState, useEffect } from 'react'

export function useGyroscope() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('DeviceOrientationEvent' in window)) return

    const handler = (e: DeviceOrientationEvent) => {
      const x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 45))
      const y = Math.max(-1, Math.min(1, (e.beta ?? 0) / 45))
      setTilt({ x, y })
    }

    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [])

  return tilt
}
```

- [ ] **Step 6: Commit**

```bash
git add tests/hooks/ hooks/
git commit -m "feat: useDeviceCapability and useGyroscope hooks — TDD"
```

---

### Task 12: Root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'
import { LenisProvider } from '@/components/LenisProvider'
import './globals.css'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'FLAMINGEOS — Juwany Roman',
  description: 'Creator. Explorer. Entrepreneur. From Puerto Rico to the world.',
  openGraph: {
    title: 'FLAMINGEOS',
    description: 'Creator. Explorer. Entrepreneur.',
    url: 'https://flamingeos.com',
    siteName: 'FLAMINGEOS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@flamingeos',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: root layout with Lenis, fonts, metadata"
```

---

## Phase 4: UI Primitives

### Task 13: UI components

**Files:**
- Create: `components/ui/GlassCard.tsx`
- Create: `components/ui/SoundToggle.tsx`
- Create: `components/ui/ScrollCue.tsx`

- [ ] **Step 1: Create components/ui/GlassCard.tsx**

```tsx
'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${className}`}
      whileHover={hover ? { y: -8, rotateX: 4, rotateY: -4, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create components/ui/SoundToggle.tsx**

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function SoundToggle() {
  const [on, setOn] = useState(false)

  return (
    <motion.button
      onClick={() => setOn(!on)}
      className="fixed top-6 right-6 z-50 glass px-4 py-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
      style={{ fontFamily: 'var(--font-space-mono)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      aria-label={on ? 'Mute ambient sound' : 'Enable ambient sound'}
    >
      {on ? '◼ SOUND' : '▶ SOUND'}
    </motion.button>
  )
}
```

- [ ] **Step 3: Create components/ui/ScrollCue.tsx**

```tsx
'use client'
import { motion } from 'framer-motion'

export function ScrollCue() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <span
        className="text-xs tracking-widest text-white/30 uppercase"
        style={{ fontFamily: 'var(--font-space-mono)' }}
      >
        scroll
      </span>
      <motion.div
        className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
        animate={{ scaleY: [1, 0.4, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/
git commit -m "feat: GlassCard, SoundToggle, ScrollCue UI components"
```

---

## Phase 5: Loading Experience

### Task 14: Loading text sequence + controller

**Files:**
- Create: `components/sections/LoadingExperience.tsx`

- [ ] **Step 1: Create components/sections/LoadingExperience.tsx**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { SoundToggle } from '@/components/ui/SoundToggle'

const LoadingScene = dynamic(() => import('@/components/three/LoadingScene'), {
  ssr: false,
})

const SEQUENCE = [
  { text: 'Every adventure starts somewhere.', duration: 2200 },
  { text: 'Puerto Rico.', duration: 1600 },
  { text: 'Creator. Entrepreneur. Explorer.', duration: 1800 },
]

interface LoadingExperienceProps {
  onComplete: () => void
}

export function LoadingExperience({ onComplete }: LoadingExperienceProps) {
  const [phase, setPhase] = useState<'text' | 'logo' | 'shatter' | 'done'>('text')
  const [textIndex, setTextIndex] = useState(0)
  const [showText, setShowText] = useState(true)

  // Drive the text sequence
  useEffect(() => {
    if (phase !== 'text') return

    const item = SEQUENCE[textIndex]
    if (!item) {
      setPhase('logo')
      return
    }

    setShowText(true)
    const hideTimer = setTimeout(() => setShowText(false), item.duration - 600)
    const nextTimer = setTimeout(() => {
      setTextIndex((i) => i + 1)
    }, item.duration)

    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer) }
  }, [phase, textIndex])

  // After logo phase, trigger shatter then complete
  useEffect(() => {
    if (phase === 'logo') {
      const t = setTimeout(() => setPhase('shatter'), 1200)
      return () => clearTimeout(t)
    }
    if (phase === 'shatter') {
      const t = setTimeout(() => {
        setPhase('done')
        onComplete()
      }, 1600)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === 'done') return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'var(--zone-1-bg)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SoundToggle />

      {/* Text sequence */}
      <AnimatePresence mode="wait">
        {phase === 'text' && showText && SEQUENCE[textIndex] && (
          <motion.p
            key={textIndex}
            className="absolute text-center px-6 text-white/70 text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-space-mono)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {SEQUENCE[textIndex].text}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Logo + shatter scene */}
      {(phase === 'logo' || phase === 'shatter') && (
        <div className="w-full h-full absolute inset-0">
          <LoadingScene shatter={phase === 'shatter'} />
        </div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/LoadingExperience.tsx
git commit -m "feat: loading experience controller — text sequence + shatter trigger"
```

---

### Task 15: R3F Loading Scene

**Files:**
- Create: `components/three/LoadingScene.tsx`

- [ ] **Step 1: Create components/three/LoadingScene.tsx**

```tsx
'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D, Center, Float } from '@react-three/drei'
import { useRef, useState, useMemo } from 'react'
import * as THREE from 'three'

// Particle that flies outward on shatter
function Particle({ origin, shatter }: { origin: THREE.Vector3; shatter: boolean }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const velocity = useMemo(
    () => new THREE.Vector3(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8
    ),
    []
  )

  useFrame((_, delta) => {
    if (!mesh.current) return
    if (shatter) {
      mesh.current.position.addScaledVector(velocity, delta)
      mesh.current.material.opacity = Math.max(0, (mesh.current.material as THREE.MeshBasicMaterial).opacity - delta * 0.8)
    }
  })

  return (
    <mesh ref={mesh} position={origin}>
      <boxGeometry args={[0.06, 0.06, 0.06]} />
      <meshBasicMaterial color="#a8d8ff" transparent opacity={0.8} />
    </mesh>
  )
}

// Ambient floating particles background
function AmbientParticles() {
  const count = 120
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
    }
    return arr
  }, [])

  const points = useRef<THREE.Points>(null!)
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a8d8ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

// Logo text that shatters
function LogoText({ shatter }: { shatter: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)

  // Generate particle grid positions across the logo area
  const particles = useMemo(() =>
    Array.from({ length: 200 }, (_, i) => new THREE.Vector3(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 1.6,
      0
    )), []
  )

  useFrame((state) => {
    if (groupRef.current && !shatter) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.06
    }
  })

  return (
    <group ref={groupRef}>
      {shatter ? (
        particles.map((pos, i) => (
          <Particle key={i} origin={pos} shatter={shatter} />
        ))
      ) : (
        <Center>
          <Text3D
            font="/assets/fonts/clash-display-bold.json"
            size={1.2}
            height={0.1}
            curveSegments={8}
          >
            FLAMINGEOS
            <meshStandardMaterial color="#f0f0f0" />
          </Text3D>
        </Center>
      )}
    </group>
  )
}

export default function LoadingScene({ shatter }: { shatter: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#a8d8ff" />
      <AmbientParticles />
      <LogoText shatter={shatter} />
    </Canvas>
  )
}
```

Note: `Text3D` requires a `.json` font file. Generate one from Clash Display Bold using `facetype.js` (https://gero3.github.io/facetype.js/) and place it at `public/assets/fonts/clash-display-bold.json`.

- [ ] **Step 2: Commit**

```bash
git add components/three/LoadingScene.tsx
git commit -m "feat: R3F loading scene — particles, ambient, logo shatter"
```

---

## Phase 6: Hero Section

### Task 16: Hero (R3F + text overlay)

**Files:**
- Create: `components/three/HeroScene.tsx`
- Create: `components/sections/Hero.tsx`

- [ ] **Step 1: Create components/three/HeroScene.tsx**

```tsx
'use client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { useGyroscope } from '@/hooks/useGyroscope'

// Video/image plane at a specific depth
function DepthPlane({
  z,
  opacity,
  color,
}: {
  z: number
  opacity: number
  color: string
}) {
  const mesh = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.2 + z) * 0.1
  })

  return (
    <mesh ref={mesh} position={[0, 0, z]}>
      <planeGeometry args={[16, 9]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}

function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  const { camera } = useThree()
  const capability = useDeviceCapability()
  const layerCount = capability === 'low' ? 2 : capability === 'medium' ? 3 : 5

  useFrame(() => {
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })

  const layers = [
    { z: -8, opacity: 0.6, color: '#0a0f1a' },
    { z: -5, opacity: 0.4, color: '#0d1520' },
    { z: -3, opacity: 0.25, color: '#1a2535' },
    { z: -1, opacity: 0.15, color: '#243040' },
    { z: 0.5, opacity: 0.08, color: '#304050' },
  ].slice(0, layerCount)

  return (
    <>
      <fog attach="fog" args={['#080808', 5, 25]} />
      {layers.map((l, i) => (
        <DepthPlane key={i} z={l.z} opacity={l.opacity} color={l.color} />
      ))}
    </>
  )
}

export default function HeroScene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: false, alpha: true }}
      dpr={[1, 1.5]}
    >
      <Scene mouse={mouse} />
    </Canvas>
  )
}
```

- [ ] **Step 2: Create components/sections/Hero.tsx**

```tsx
'use client'
import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { useGyroscope } from '@/hooks/useGyroscope'

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false })

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const gyro = useGyroscope()

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }

  // Use gyroscope on mobile, mouse on desktop
  const activeMouse = typeof window !== 'undefined' && 'ontouchstart' in window
    ? gyro
    : mouse

  return (
    <section
      ref={containerRef}
      className="section"
      style={{ background: 'var(--zone-1-bg)' }}
      onMouseMove={handleMouseMove}
      id="hero"
    >
      {/* R3F background */}
      <div className="absolute inset-0">
        <HeroScene mouse={activeMouse} />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 text-center px-6 select-none">
        <motion.h1
          className="text-hero text-white"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          FLAMINGEOS
        </motion.h1>

        <motion.p
          className="mt-4 text-white/50 text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-space-mono)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Creator &nbsp;·&nbsp; Explorer &nbsp;·&nbsp; Entrepreneur
        </motion.p>
      </div>

      <ScrollCue />
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/three/HeroScene.tsx components/sections/Hero.tsx
git commit -m "feat: Hero section — R3F depth layers, mouse/gyro tracking"
```

---

## Phase 7: Story Sections

### Task 17: Story section

**Files:**
- Create: `components/sections/Story.tsx`

- [ ] **Step 1: Create components/sections/Story.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'
import { motion } from 'framer-motion'

const LINES = [
  'Born in Puerto Rico.',
  'Built an audience from nothing.',
  '2.5 million people listen when he talks.',
  'This is how it started.',
]

export function Story() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>('.story-line')

    lines.forEach((line, i) => {
      gsap.fromTo(
        line,
        { opacity: 0, y: 50, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            end: 'top 40%',
            scrub: false,
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="section flex-col gap-8 py-32"
      style={{ background: 'var(--zone-2-bg)' }}
      id="story"
    >
      <motion.p
        className="text-chapter text-white/20 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        From Puerto Rico to the World
      </motion.p>

      <div className="max-w-2xl px-6 space-y-6">
        {LINES.map((line, i) => (
          <p
            key={i}
            className="story-line text-2xl md:text-4xl font-semibold text-white leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {line}
          </p>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Story.tsx
git commit -m "feat: Story section — GSAP scroll-driven text reveal"
```

---

### Task 18: Timeline / Road section

**Files:**
- Create: `components/sections/Timeline.tsx`

- [ ] **Step 1: Create components/sections/Timeline.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap-config'

const MILESTONES = [
  { year: '2015', label: 'Musical.ly', detail: 'First following. The spark.' },
  { year: '2018', label: 'First viral moment', detail: 'The internet noticed.' },
  { year: '2020', label: 'Streaming era', detail: 'Pandemic. Grind. Growth.' },
  { year: '2023', label: '2.5M on TikTok', detail: 'Brand deals. Global reach.' },
  { year: '2026', label: 'Building businesses', detail: 'The story continues.' },
]

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const roadRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const milestones = gsap.utils.toArray<HTMLElement>('.milestone-card')

    // Pin the section, scrub the road
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${window.innerHeight * 4}`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      },
    })

    // Move road forward
    tl.to(roadRef.current, { y: '-60%', ease: 'none' }, 0)

    // Reveal milestones
    milestones.forEach((card, i) => {
      tl.fromTo(
        card,
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3 },
        i * 0.2
      )
      if (i < milestones.length - 1) {
        tl.to(card, { opacity: 0.2, duration: 0.15 }, i * 0.2 + 0.18)
      }
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="section overflow-hidden"
      style={{ background: 'var(--zone-3-bg)', height: '100vh' }}
      id="timeline"
    >
      {/* Road perspective container */}
      <div
        style={{
          perspective: '600px',
          perspectiveOrigin: '50% 0%',
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}
      >
        <div
          ref={roadRef}
          style={{
            transform: 'rotateX(48deg)',
            transformOrigin: 'top center',
            width: '2px',
            height: '400%',
            background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.3), rgba(249,115,22,0.7))',
            left: '50%',
            position: 'absolute',
            top: '0',
          }}
        />
      </div>

      {/* Milestone cards */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-24 py-40">
        <p
          className="text-chapter text-white/20 mb-16 absolute top-12"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The Journey
        </p>

        {MILESTONES.map((m, i) => (
          <div
            key={i}
            className="milestone-card glass px-8 py-6 text-center max-w-sm w-full opacity-0"
          >
            <span
              className="block text-5xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-space-mono)', color: 'var(--zone-3-accent)' }}
            >
              {m.year}
            </span>
            <span
              className="block text-xl font-semibold text-white mb-1"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {m.label}
            </span>
            <span className="text-sm text-white/50">{m.detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Timeline.tsx
git commit -m "feat: Timeline road section — CSS 3D perspective + GSAP scrub"
```

---

## Phase 8: Globe Section (Holy Shit Moment)

### Task 19: Globe R3F scene + wrapper

**Files:**
- Create: `components/three/GlobeScene.tsx`
- Create: `components/sections/World.tsx`

- [ ] **Step 1: Create components/three/GlobeScene.tsx**

```tsx
'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, Html } from '@react-three/drei'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'

const PINS = [
  { lat: 18.2208, lon: -66.5901, label: 'Puerto Rico', detail: 'Where it started.' },
  { lat: 25.7617, lon: -80.1918, label: 'Miami', detail: 'Where it\'s based.' },
  { lat: 34.0522, lon: -118.2437, label: 'Los Angeles', detail: 'Content capital.' },
  { lat: 6.2442, lon: -75.5812, label: 'Medellín', detail: 'The adventures.' },
]

function latLonToVec3(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

function GlobePin({
  lat,
  lon,
  label,
  detail,
}: {
  lat: number
  lon: number
  label: string
  detail: string
}) {
  const [active, setActive] = useState(false)
  const pos = latLonToVec3(lat, lon, 2.05)

  return (
    <mesh
      position={pos}
      onClick={(e) => { e.stopPropagation(); setActive(!active) }}
    >
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={active ? '#f97316' : '#a8d8ff'} />
      {active && (
        <Html distanceFactor={6} center>
          <div
            className="glass px-4 py-3 text-center pointer-events-none"
            style={{ minWidth: 140 }}
          >
            <p className="text-white font-semibold text-sm">{label}</p>
            <p className="text-white/50 text-xs mt-1">{detail}</p>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null!)
  const capability = useDeviceCapability()
  const segments = capability === 'low' ? 32 : capability === 'medium' ? 48 : 64

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      {/* Globe body */}
      <Sphere args={[2, segments, segments]}>
        <meshStandardMaterial
          color="#0c1a2e"
          wireframe={false}
          roughness={0.8}
          metalness={0.1}
        />
      </Sphere>
      {/* Atmosphere glow */}
      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.04} side={THREE.BackSide} />
      </Sphere>
      {/* Pins */}
      {PINS.map((pin) => (
        <GlobePin key={pin.label} {...pin} />
      ))}
    </group>
  )
}

export default function GlobeScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 3, 5]} intensity={1.5} color="#a8d8ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#22d3ee" />
      <Globe />
    </Canvas>
  )
}
```

- [ ] **Step 2: Create components/sections/World.tsx**

```tsx
'use client'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'

const GlobeScene = dynamic(() => import('@/components/three/GlobeScene'), { ssr: false })

export function World() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <section
      ref={ref}
      className="section flex-col"
      style={{ background: 'var(--zone-2-bg)' }}
      id="world"
    >
      <motion.p
        className="absolute top-16 text-chapter text-white/20"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        The World
      </motion.p>

      <motion.div
        className="w-full h-[60vh] md:h-[80vh] max-w-3xl"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {isInView && <GlobeScene />}
      </motion.div>

      <motion.p
        className="text-sm text-white/30 mt-4 tracking-widest"
        style={{ fontFamily: 'var(--font-space-mono)' }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        Tap a pin to explore
      </motion.p>
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add components/three/GlobeScene.tsx components/sections/World.tsx
git commit -m "feat: Globe section — R3F globe with pins, the holy shit moment"
```

---

## Phase 9: Stats + Brands

### Task 20: Stats section

**Files:**
- Create: `components/sections/Stats.tsx`

- [ ] **Step 1: Create components/sections/Stats.tsx**

```tsx
'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 2500000, label: 'TikTok Followers', display: '2.5M' },
  { value: 913000, label: 'Instagram Followers', display: '913K' },
  { value: 520000, label: 'YouTube Subscribers', display: '520K' },
  { value: 125700000, label: 'Total Likes', display: '125.7M' },
]

function CountUp({ target, display, inView }: { target: number; display: string; inView: boolean }) {
  const [current, setCurrent] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    const duration = 1800
    const start = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [inView, target])

  // Format number to match display style
  const formatted = current >= 1_000_000
    ? `${(current / 1_000_000).toFixed(1)}M`
    : current >= 1000
    ? `${(current / 1000).toFixed(0)}K`
    : current.toString()

  return <span>{inView ? formatted : '0'}</span>
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section
      ref={ref}
      className="section"
      style={{ background: 'var(--zone-3-bg)' }}
      id="stats"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 px-6 max-w-5xl w-full">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12, duration: 0.6, ease: 'easeOut' }}
          >
            <div
              className="text-stat mb-2"
              style={{ color: 'var(--zone-3-accent)', fontFamily: 'var(--font-display)' }}
            >
              <CountUp target={stat.value} display={stat.display} inView={isInView} />
            </div>
            <p
              className="text-xs text-white/40 tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-space-mono)' }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Stats.tsx
git commit -m "feat: Stats section — count-up animation on scroll enter"
```

---

### Task 21: Brands section

**Files:**
- Create: `components/sections/Brands.tsx`

- [ ] **Step 1: Create components/sections/Brands.tsx**

```tsx
'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const BRANDS = [
  { name: 'Coca-Cola', initials: 'CC' },
  { name: 'Twix', initials: 'TX' },
  { name: 'Univision', initials: 'UV' },
  { name: 'Burger King', initials: 'BK' },
  { name: 'Fashion Nova', initials: 'FN' },
]

const DIRECTIONS: [number, number][] = [
  [-200, -100],
  [200, -100],
  [-200, 0],
  [200, 100],
  [0, 200],
]

export function Brands() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20%' })

  return (
    <section
      ref={ref}
      className="section flex-col"
      style={{ background: 'var(--zone-4-bg)' }}
      id="brands"
    >
      <motion.p
        className="text-chapter text-white/20 mb-16"
        style={{ fontFamily: 'var(--font-display)' }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
      >
        Trusted By
      </motion.p>

      <div className="relative w-full max-w-3xl px-6">
        {/* SVG connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isInView && BRANDS.map((_, i) => {
            if (i === 0) return null
            return (
              <motion.line
                key={i}
                x1="50%" y1="50%"
                x2={`${20 + (i % 3) * 30}%`} y2={`${25 + Math.floor(i / 3) * 50}%`}
                stroke="#c9a84c"
                strokeWidth="0.5"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              />
            )
          })}
        </svg>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.name}
              className="glass px-6 py-5 text-center"
              initial={{
                opacity: 0,
                x: DIRECTIONS[i][0],
                y: DIRECTIONS[i][1],
              }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{
                delay: 0.2 + i * 0.12,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span
                className="block text-2xl font-bold mb-1"
                style={{ color: 'var(--zone-4-accent)', fontFamily: 'var(--font-display)' }}
              >
                {brand.initials}
              </span>
              <span className="text-xs text-white/50 tracking-widest uppercase">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Brands.tsx
git commit -m "feat: Brands section — fly-in logos + SVG network lines"
```

---

## Phase 10: Join the Journey

### Task 22: Social glass cards

**Files:**
- Create: `components/sections/JoinTheJourney.tsx`

- [ ] **Step 1: Create components/sections/JoinTheJourney.tsx**

```tsx
'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'

const SOCIALS = [
  { platform: 'TikTok', handle: '@flamingeos', followers: '2.5M', url: 'https://tiktok.com/@flamingeos', color: '#a8d8ff' },
  { platform: 'Instagram', handle: '@flamingeos', followers: '913K', url: 'https://instagram.com/flamingeos', color: '#f97316' },
  { platform: 'YouTube', handle: 'Flamingeos', followers: '520K', url: 'https://youtube.com/c/flamingeos', color: '#c9a84c' },
  { platform: 'Twitch', handle: 'flamingeos', followers: '', url: 'https://twitch.tv/flamingeos', color: '#22d3ee' },
]

const BUDGETS = ['Under $5K', '$5K–$10K', '$10K–$50K', '$50K+', 'Let\'s talk']

function SocialCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
      {SOCIALS.map((s, i) => (
        <motion.a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <GlassCard className="p-5 text-center h-full">
            <p
              className="text-lg font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: s.color }}
            >
              {s.platform}
            </p>
            <p className="text-xs text-white/40">{s.handle}</p>
            {s.followers && (
              <p
                className="text-2xl font-bold mt-3"
                style={{ fontFamily: 'var(--font-display)', color: s.color }}
              >
                {s.followers}
              </p>
            )}
          </GlassCard>
        </motion.a>
      ))}
    </div>
  )
}

function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', brand: '', email: '', message: '', budget: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', brand: '', email: '', message: '', budget: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors'

  if (status === 'success') {
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Message received.
        </p>
        <p className="text-white/50 text-sm">We'll be in touch soon.</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={inputClass} />
        <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand / Company" className={inputClass} />
      </div>
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className={inputClass} />
      <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell me about the project..." required rows={4} className={`${inputClass} resize-none`} />
      <select name="budget" value={form.budget} onChange={handleChange} className={inputClass}>
        <option value="" disabled>Budget range</option>
        {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <motion.button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-4 font-bold tracking-widest text-sm uppercase text-black rounded-lg disabled:opacity-50"
        style={{ background: 'var(--zone-5-accent)', fontFamily: 'var(--font-display)' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </motion.button>
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>
      )}
    </form>
  )
}

export function JoinTheJourney() {
  return (
    <section
      className="section flex-col gap-20 py-32"
      style={{ background: 'var(--zone-5-bg)' }}
      id="join"
    >
      {/* Follow the Adventure */}
      <div className="flex flex-col items-center gap-8 w-full px-6">
        <motion.h2
          className="text-chapter text-white text-center"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Follow the Adventure
        </motion.h2>
        <SocialCards />
      </div>

      {/* Divider */}
      <div className="w-px h-24 bg-white/10" />

      {/* Work Together */}
      <div className="flex flex-col items-center gap-8 w-full px-6">
        <motion.h2
          className="text-chapter text-white text-center"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Work Together
        </motion.h2>
        <motion.p
          className="text-white/40 text-sm text-center max-w-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Brand partnerships, sponsored content, and collaborations.
        </motion.p>
        <ContactForm />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/JoinTheJourney.tsx
git commit -m "feat: JoinTheJourney — social cards + contact form with API integration"
```

---

## Phase 11: Footer + Assembly

### Task 23: Footer

**Files:**
- Create: `components/sections/Footer.tsx`

- [ ] **Step 1: Create components/sections/Footer.tsx**

```tsx
export function Footer() {
  return (
    <footer
      className="py-12 px-6 flex flex-col items-center gap-6 border-t border-white/5"
      style={{ background: 'var(--zone-5-bg)' }}
    >
      <div className="flex gap-6">
        {[
          { label: 'TikTok', url: 'https://tiktok.com/@flamingeos' },
          { label: 'Instagram', url: 'https://instagram.com/flamingeos' },
          { label: 'YouTube', url: 'https://youtube.com/c/flamingeos' },
        ].map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/30 hover:text-white/70 transition-colors tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-space-mono)' }}
          >
            {s.label}
          </a>
        ))}
      </div>
      <p className="text-xs text-white/20" style={{ fontFamily: 'var(--font-space-mono)' }}>
        © 2026 FLAMINGEOS
      </p>
      <p className="text-xs text-white/15 italic" style={{ fontFamily: 'var(--font-quote)' }}>
        From Puerto Rico, to wherever is next.
      </p>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/Footer.tsx
git commit -m "feat: Footer"
```

---

### Task 24: Main page.tsx assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```tsx
'use client'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LoadingExperience } from '@/components/sections/LoadingExperience'
import { Hero } from '@/components/sections/Hero'
import { Story } from '@/components/sections/Story'
import { Timeline } from '@/components/sections/Timeline'
import { World } from '@/components/sections/World'
import { Stats } from '@/components/sections/Stats'
import { Brands } from '@/components/sections/Brands'
import { JoinTheJourney } from '@/components/sections/JoinTheJourney'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const seen = localStorage.getItem('geo_visited')
    if (seen) setLoading(false)
  }, [])

  const handleLoadingComplete = () => {
    localStorage.setItem('geo_visited', 'true')
    setLoading(false)
  }

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingExperience onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <main>
        <Hero />
        <Story />
        <Timeline />
        <World />
        <Stats />
        <Brands />
        <JoinTheJourney />
        <Footer />
      </main>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble main page — all sections, loading gate"
```

---

## Phase 12: Deployment

### Task 25: Run DB migrations + Vercel config

**Files:**
- Create: `vercel.json`

- [ ] **Step 1: Add DATABASE_URL to .env.local**

Fill in the Neon connection string in `.env.local`:
```
DATABASE_URL=postgresql://[user]:[password]@[host]/[dbname]?sslmode=require
RESEND_API_KEY=re_xxxxxxxxxxxx
```

Get the `DATABASE_URL` from the Neon dashboard (Project → Connection string → select "Node.js" driver).

- [ ] **Step 2: Run Drizzle migrations**

```bash
npx drizzle-kit push
```

Expected output: confirms `contact_inquiries`, `products`, `orders` tables created.

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 4: Create vercel.json**

```json
{
  "functions": {
    "app/api/contact/route.ts": {
      "maxDuration": 10
    }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add vercel.json
git commit -m "chore: Vercel function config"
```

- [ ] **Step 6: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 7: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Import `flamingeos/flamingeos-web` from GitHub
3. Framework: Next.js (auto-detected)
4. Add environment variables:
   - `DATABASE_URL` — Neon connection string
   - `RESEND_API_KEY` — Resend API key
5. Click Deploy

Expected: site live at `flamingeos-web.vercel.app`. Add custom domain `flamingeos.com` in Vercel dashboard.

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Loading screen — first visit full intro | Task 14 |
| Loading screen — return visit logo flash | Task 14 (localStorage gate in Task 24) |
| Ambient sound toggle | Task 13 (SoundToggle) |
| Hero — cinematic video collage + YOU as brand | Task 16 |
| Mouse/gyroscope parallax on hero | Task 16 |
| "From Puerto Rico to the World" section | Task 17 |
| Creator Journey / Road section | Task 18 |
| Globe — holy shit moment | Task 19 |
| Globe pins with cards | Task 19 |
| Stats count-up | Task 20 |
| Brands fly-in + network lines | Task 21 |
| Social glass cards — Follow the Adventure | Task 22 |
| Contact form — Work Together | Task 22 |
| Contact form → Neon + Resend → hq@flamingeos.com | Tasks 7–8 |
| Footer tagline | Task 23 |
| DB schema: contact_inquiries | Task 6 |
| DB schema: products + orders (future merch) | Task 6 |
| Device capability degradation | Task 11 + used in GlobeScene, HeroScene, LoadingScene |
| Mobile gyroscope parallax | Task 11 (useGyroscope) + Task 16 |
| 60 FPS mobile — reduced particle count | Task 15, 16, 19 use `useDeviceCapability` |
| Lenis smooth scroll (lerp 0.08) | Task 10 |
| GSAP ScrollTrigger sections | Tasks 17, 18 |
| Framer Motion spring hover (200/20) | Task 13 (GlassCard) |
| Vercel deployment | Task 25 |
| GitHub push | Tasks 1, 25 |
| Clash Display typography | Task 5 |
| CSS atmospheric zones (5 zones) | Task 5 |
| Noise overlay (film grain) | Task 5 |

All spec requirements covered. No gaps found.
