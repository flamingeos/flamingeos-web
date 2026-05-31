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
      className="section flex-col"
      style={{ background: 'var(--zone-2-bg)' }}
      id="story"
    >
      <div className="section-inner">
        <motion.p
          className="text-chapter w-full"
          style={{ color: 'var(--accent)', opacity: 0.5 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          viewport={{ once: true }}
        >
          From Puerto Rico to the World
        </motion.p>

        <div className="w-full space-y-8 mt-4">
          {LINES.map((line, i) => (
            <p
              key={i}
              className="story-line text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
