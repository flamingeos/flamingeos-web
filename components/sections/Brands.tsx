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
      <div className="section-inner">
        <motion.p
          className="text-chapter w-full"
          style={{ color: 'var(--accent)', opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.5 } : {}}
        >
          Trusted By
        </motion.p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-4">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.name}
              className="glass px-4 py-5 sm:px-6 text-center"
              initial={{ opacity: 0, x: DIRECTIONS[i][0], y: DIRECTIONS[i][1] }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="block text-xl sm:text-2xl font-bold mb-1"
                style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
              >
                {brand.initials}
              </span>
              <span className="text-xs text-white/40 tracking-widest uppercase">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
