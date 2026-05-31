'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap-config'
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

    lines.forEach((line) => {
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
