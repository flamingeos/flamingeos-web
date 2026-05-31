# Flamingeos Web — Design Specification
**Date:** 2026-05-31
**Brand:** FLAMINGEOS / Juwany Roman
**Stack:** Next.js 15, Three.js / R3F, GSAP, Framer Motion, Lenis, Neon (Postgres), Drizzle ORM, Resend, Vercel
**Repo:** https://github.com/flamingeos/flamingeos-web

---

## 1. Vision

A premium interactive digital experience for creator Juwany Roman (@flamingeos). Not a portfolio. Not a Linktree. A cinematic, scroll-driven journey that makes visitors think "what the hell is this?" and keeps them scrolling to find out.

**North star:** Every 1–2 viewport heights introduces a new visual surprise. Design for emotional impact first, information second.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 15 (App Router) | Routing, SSR, API routes |
| 3D Engine | React Three Fiber + Three.js | Loading screen, hero, globe |
| Scroll | GSAP + ScrollTrigger + Lenis | All scroll-driven animations |
| Motion | Framer Motion | Component-level animations |
| Database | Neon (Postgres) + Drizzle ORM | Contact inquiries, future merch |
| Email | Resend | Contact form → hq@flamingeos.com |
| Hosting | Vercel | Deployment, edge functions |
| Fonts | Clash Display, General Sans, Space Mono, Cabinet Grotesk | Typography system |

---

## 3. Three.js Budget (3 Scenes Max)

Three.js / R3F is used **only** where CSS cannot replicate the effect:

| Scene | Technology | Justification |
|---|---|---|
| Loading screen — particle reveal + logo shatter | R3F | Geometry-based particle physics, WebGL required |
| Hero — video layer depth + camera drift + mouse tracking | R3F | True Z-axis camera movement |
| World Map — 3D globe with pins | R3F | Interactive 3D globe cannot be faked with CSS |

Everything else uses GSAP + Framer Motion. This is how we hit 60fps on iPhone.

---

## 4. Performance Targets

- 60 FPS on modern iPhones (iPhone 13+)
- Lighthouse score 95+
- Fast initial load via lazy-loaded R3F scenes wrapped in Suspense
- All Three.js canvases degrade gracefully to static images on low-end devices
- Device capability detection on mount: reduce particle counts and disable complex shaders on flagged devices
- No horizontal scroll anywhere on mobile
- Lenis `lerp: 0.08` — slower than default for cinematic feel

---

## 5. Loading Experience

**First visit (localStorage `geo_visited` not set):**
1. Black screen
2. Ambient sound toggle button appears (top-right)
3. Space Mono text fades in: "Every adventure starts somewhere."
4. Pause → fade out
5. "Puerto Rico." fades in → pause → fade out
6. "Creator. Entrepreneur. Explorer." fades in → pause → fade out
7. FLAMINGEOS logo appears in Clash Display
8. Screen shatters — geometry particles fly (R3F)
9. Website reveals beneath
10. Set `localStorage.setItem("geo_visited", "true")`

**Return visit (`geo_visited` = "true"):**
- 1.5-second Clash Display logo flash (FLAMINGEOS, centered, fades out)
- Hero loads immediately after

---

## 6. Color System & Atmospheric Zones

Five atmospheric zones that transition continuously as the user scrolls. Background, particle density, and accent colors all shift between zones.

| Zone | Section | Background | Accent | Mood |
|---|---|---|---|---|
| 1 — Void | Loading + Hero | `#080808` → `#0d0f14` | Electric ice `#a8d8ff` | Cinematic, mysterious |
| 2 — Ocean | From Puerto Rico to the World | `#0c1a2e` → `#0f2d4a` | Bioluminescent teal `#22d3ee` | Adventurous, alive |
| 3 — Energy | Creator Journey + Stats | `#0f0f0f` → `#1a0a00` | Ember orange `#f97316` | Dynamic, electric |
| 4 — Obsidian | Brand Partnerships | `#0a0a0a` → `#111111` | Muted gold `#c9a84c` | Luxury, premium |
| 5 — Focus | Join the Journey + Contact | `#0d0d0d` | Soft white `#f8f8f8` | Clean, elegant |

**Global overlays:**
- Noise texture at 3–5% opacity on every zone (film grain effect)
- Glass morphism cards use `backdrop-filter: blur` with zone-matched border colors
- No flat colors anywhere — all surfaces have subtle depth

---

## 7. Typography System

| Role | Font | Weight | Usage |
|---|---|---|---|
| Display | Clash Display | 400–700 | Hero "FLAMINGEOS", section chapter titles |
| Heading | General Sans | 700–800 | Section subheads, card titles |
| Body | General Sans | 400–500 | Bio text, descriptions, form labels |
| Accent | Space Mono | 400 | Years (2015, 2018…), stats, data labels |
| Quote | Cabinet Grotesk | 400 italic | Pull quotes, taglines |

- Fluid type scale using `clamp()` throughout — no breakpoint jumps
- "FLAMINGEOS" in hero is viewport-width sized on desktop, scales to fill mobile
- Loading screen text in Space Mono for typewriter/monospaced feel

---

## 8. Animation Philosophy

**Core rule:** Sections don't appear — they emerge. Outgoing sections transform into incoming sections rather than fading away.

**Transition method:** GSAP ScrollTrigger pin + scrub at every section boundary. Outgoing elements morph or become the background of the next section.

**Curiosity cadence:** Every 1–2vh of scroll introduces one new element (a single object, word, or particle) — not a full section reveal.

**Animation principles:**
- Entrances: from natural direction (text from left, images from depth/scale)
- Exits: elements dissolve into next section's atmosphere
- Hover: spring physics (`stiffness: 200, damping: 20`) — physical, not mechanical
- Scroll easing: Lenis `lerp: 0.08` — slower, more cinematic than default

**Mobile adaptation:**
- Pinned scroll sequences replaced with threshold-triggered Framer Motion animations
- Same storytelling, different mechanism
- No pinning on mobile (causes scroll jank on iOS)

---

## 9. Section-by-Section Breakdown

### 9.1 Hero — Zone 1 (Void)

- Cinematic video collage: silhouette shots, creator clips, streaming moments, travel footage, Puerto Rico — you are the brand, not the drone
- R3F scene: video layers at different Z depths, subtle camera drift, mouse tracking shifts layers (parallax)
- Clash Display: "FLAMINGEOS" full-width
- General Sans subtext: "Creator. Explorer. Entrepreneur." fades in after 1.5s
- Scroll cue: animated arrow pulses at bottom
- Mobile: gyroscope-based parallax instead of mouse tracking

### 9.2 From Puerto Rico to the World — Zone 1→2

- Section title in Clash Display, feels like a chapter opening
- Story told in short punchy lines (not paragraphs):
  - "Born in Puerto Rico."
  - "Built an audience from nothing."
  - "2.5 million people listen when he talks."
  - "This is how it started."
- Lines stagger in on scroll, parallax text layers separate as user scrolls deeper
- Background begins shifting toward ocean blue (`#0c1a2e`)
- Photo placeholder with depth parallax

### 9.3 Creator Journey — Road Section — Zone 2→3

- CSS 3D road perspective + GSAP ScrollTrigger scrub
- Camera appears to travel forward as user scrolls
- Milestone cards appear at scroll positions:
  - **2015** — Musical.ly, first following
  - **2018** — First viral moment
  - **2020** — Streaming era, pandemic growth
  - **2023** — 2.5M TikTok, brand deals
  - **2026** — Building businesses
- Zone shifts from ocean blue to ember orange mid-road
- Years rendered in Space Mono
- Mobile: vertical stacked timeline with Framer Motion entrance animations

### 9.4 The World — "Holy Shit" Moment — Zone 2

- Trigger: user reaches scroll position after Creator Journey
- Page appears to zoom out — R3F globe emerges from center
- Dark globe with custom shader: atmosphere glow, subtle star field
- Pins drop sequentially with spring animation:
  - Puerto Rico — "Where it started"
  - Miami — "Where it's based"
  - Los Angeles — "Content capital"
  - Medellín — "The adventures"
  - Additional pins for future destinations
- Tap/click a pin → card slides up with video/photo placeholder + short caption
- Globe rotates slowly on idle; gyroscope-reactive on mobile
- Ambient particles if sound is on
- This is the moment people screenshot and share

### 9.5 Stats — Zone 3 (Energy)

- 2.5M / 913K / 520K / 125.7M
- Count-up animation on scroll enter (CountUp.js or custom)
- Labels: "TikTok Followers", "Instagram Followers", "YouTube Subscribers", "Total Likes"
- Energetic stagger entrance

### 9.6 Brand Partnerships — Zone 3→4

- Zone transitions to luxury obsidian + gold
- Brands: Coca-Cola, Twix, Univision, Burger King, Fashion Nova
- Logos fly in from 6 different directions on scroll, settle into grid
- SVG animated lines draw between logos (network map aesthetic)
- Muted gold `#c9a84c` accent lines on the network

### 9.7 Join the Journey — Zone 5 (Focus)

Two clear paths presented side by side (stacked on mobile):

**Follow the Adventure**
- TikTok, Instagram, YouTube, Twitch
- Glass morphism cards with follower counts
- Hover: card lifts, rotates toward camera, edge glows
- Mobile tap: flip card to reveal link + count
- Goal: audience growth

**Work Together**
- Form fields: Name, Brand/Company, Email, Message, Budget range
- Submit: POST to `/api/contact` → Neon `contact_inquiries` table → Resend → `hq@flamingeos.com`
- Success: animated confirmation state, no page reload
- Goal: brand deals

### 9.8 Footer

- Minimal: © 2026 FLAMINGEOS
- Social icon row
- Tagline: "From Puerto Rico, to wherever is next."

---

## 10. Data Layer

### Database Schema (Neon / Postgres)

```sql
-- Immediate use: contact inquiries
CREATE TABLE contact_inquiries (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  brand       TEXT,
  email       TEXT NOT NULL,
  message     TEXT NOT NULL,
  budget      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Future: merch / e-commerce (scaffolded, not implemented)
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  price_cents INTEGER NOT NULL,
  description TEXT,
  image_url   TEXT,
  stock       INTEGER DEFAULT 0,
  active      BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER REFERENCES products(id),
  buyer_email TEXT NOT NULL,
  quantity    INTEGER NOT NULL DEFAULT 1,
  status      TEXT DEFAULT 'pending',
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Save inquiry to Neon + send email via Resend |
| `/api/products` | GET | Future: list active products |

---

## 11. Mobile-First Specifics

- All touch targets minimum 44×44px
- Thumb-friendly: primary CTAs in bottom 60% of screen
- Smooth momentum scrolling via Lenis
- Gyroscope parallax replaces mouse tracking on mobile
- No pinned scroll sequences on mobile (replaced with threshold animations)
- Three.js scenes: reduce particle count by 60% on mobile, disable complex shaders on flagged devices
- Globe section: simplified pin interaction on mobile (tap to expand card)

---

## 12. Project Structure

```
flamingeos-web/
├── app/
│   ├── page.tsx                  # Single-page entry
│   ├── layout.tsx                # Root layout, font loading, Lenis init
│   ├── globals.css               # CSS custom properties, noise overlay
│   └── api/
│       ├── contact/route.ts      # Contact form handler
│       └── products/route.ts     # Future merch
├── components/
│   ├── three/
│   │   ├── LoadingScene.tsx      # Particle shatter + logo reveal
│   │   ├── HeroScene.tsx         # Video layers + camera drift
│   │   └── GlobeScene.tsx        # 3D world map
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── Story.tsx             # "From Puerto Rico to the World"
│   │   ├── Timeline.tsx          # Road section
│   │   ├── World.tsx             # Globe wrapper
│   │   ├── Stats.tsx
│   │   ├── Brands.tsx
│   │   ├── JoinTheJourney.tsx    # Socials + contact form
│   │   └── Footer.tsx
│   └── ui/
│       ├── GlassCard.tsx
│       ├── SoundToggle.tsx
│       └── ScrollCue.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts             # Drizzle schema
│   │   └── index.ts              # Neon client
│   └── email/
│       └── resend.ts             # Resend client
├── hooks/
│   ├── useDeviceCapability.ts    # Low-end device detection
│   └── useGyroscope.ts           # Mobile parallax
└── public/
    └── assets/                   # Video, images, fonts
```

---

## 13. Deployment

- GitHub repo: `flamingeos/flamingeos-web`
- Vercel project linked to repo, auto-deploy on push to `main`
- Environment variables: `DATABASE_URL` (Neon), `RESEND_API_KEY`
- Vercel Edge Functions for `/api/contact` (low latency globally)
