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
        {/* Animated SVG connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isInView &&
            BRANDS.slice(1).map((_, i) => (
              <motion.line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${20 + ((i + 1) % 3) * 30}%`}
                y2={`${25 + Math.floor((i + 1) / 3) * 50}%`}
                stroke="#c9a84c"
                strokeWidth="0.5"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + (i + 1) * 0.15, duration: 0.8 }}
              />
            ))}
        </svg>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.name}
              className="glass px-6 py-5 text-center"
              initial={{ opacity: 0, x: DIRECTIONS[i][0], y: DIRECTIONS[i][1] }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
