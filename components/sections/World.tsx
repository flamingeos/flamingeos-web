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
        style={{ fontFamily: 'var(--font-mono)' }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
      >
        Tap a pin to explore
      </motion.p>
    </section>
  )
}
