'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: 2500000, label: 'TikTok Followers' },
  { value: 913000, label: 'Instagram Followers' },
  { value: 520000, label: 'YouTube Subscribers' },
  { value: 125700000, label: 'Total Likes' },
]

function CountUp({ target, inView }: { target: number; inView: boolean }) {
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

  const formatted =
    current >= 1_000_000
      ? `${(current / 1_000_000).toFixed(1)}M`
      : current >= 1000
      ? `${(current / 1000).toFixed(0)}K`
      : current.toString()

  return <span>{formatted}</span>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-4xl">
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
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)' }}
            >
              <CountUp target={stat.value} inView={isInView} />
            </div>
            <p
              className="text-xs text-white/40 tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
