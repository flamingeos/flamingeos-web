'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'

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

    tl.to(roadRef.current, { y: '-60%', ease: 'none' }, 0)

    const step = 0.22
    milestones.forEach((card, i) => {
      // Fade in
      tl.fromTo(
        card,
        { opacity: 0, scale: 0.88, y: 24 },
        { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: 'power2.out' },
        i * step
      )
      // Fade out (except last card stays visible)
      if (i < milestones.length - 1) {
        tl.to(card, { opacity: 0, scale: 0.92, duration: 0.1, ease: 'power2.in' }, i * step + 0.15)
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
      {/* CSS 3D road */}
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
            background: 'linear-gradient(to bottom, transparent, rgba(212,168,83,0.3), rgba(212,168,83,0.7))',
            left: '50%',
            position: 'absolute',
            top: '0',
          }}
        />
      </div>

      {/* Label — pinned at top, never overlaps cards */}
      <p
        className="absolute top-10 left-1/2 -translate-x-1/2 text-chapter text-white/20 z-10 whitespace-nowrap"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        The Journey
      </p>

      {/* All cards stacked at the same center position — GSAP fades one at a time */}
      <div className="relative z-10 w-full flex items-center justify-center" style={{ height: '100%' }}>
        {MILESTONES.map((m, i) => (
          <div
            key={i}
            className="milestone-card glass px-5 py-6 sm:px-8 sm:py-8 text-center w-full max-w-xs sm:max-w-sm absolute"
            style={{ opacity: 0 }}
          >
            <span
              className="block text-5xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}
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
