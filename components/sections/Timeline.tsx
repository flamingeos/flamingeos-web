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
            background: 'linear-gradient(to bottom, transparent, rgba(249,115,22,0.3), rgba(249,115,22,0.7))',
            left: '50%',
            position: 'absolute',
            top: '0',
          }}
        />
      </div>

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
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--zone-3-accent)' }}
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
