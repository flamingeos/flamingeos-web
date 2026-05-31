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
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window
  const activeMouse = isTouchDevice ? gyro : mouse

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
          style={{ fontFamily: 'var(--font-mono)' }}
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
