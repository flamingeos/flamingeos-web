'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { SoundToggle } from '@/components/ui/SoundToggle'

const LoadingScene = dynamic(() => import('@/components/three/LoadingScene'), {
  ssr: false,
})

const SEQUENCE = [
  { text: 'Every adventure starts somewhere.', duration: 2200 },
  { text: 'Puerto Rico.', duration: 1600 },
  { text: 'Creator. Entrepreneur. Explorer.', duration: 1800 },
]

interface LoadingExperienceProps {
  onComplete: () => void
}

export function LoadingExperience({ onComplete }: LoadingExperienceProps) {
  const [phase, setPhase] = useState<'text' | 'logo' | 'shatter' | 'done'>('text')
  const [textIndex, setTextIndex] = useState(0)
  const [showText, setShowText] = useState(true)

  // Drive the text sequence
  useEffect(() => {
    if (phase !== 'text') return

    const item = SEQUENCE[textIndex]
    if (!item) {
      setPhase('logo')
      return
    }

    setShowText(true)
    const hideTimer = setTimeout(() => setShowText(false), item.duration - 600)
    const nextTimer = setTimeout(() => {
      setTextIndex((i) => i + 1)
    }, item.duration)

    return () => { clearTimeout(hideTimer); clearTimeout(nextTimer) }
  }, [phase, textIndex])

  // After logo phase, trigger shatter then complete
  useEffect(() => {
    if (phase === 'logo') {
      const t = setTimeout(() => setPhase('shatter'), 1200)
      return () => clearTimeout(t)
    }
    if (phase === 'shatter') {
      const t = setTimeout(() => {
        setPhase('done')
        onComplete()
      }, 1600)
      return () => clearTimeout(t)
    }
  }, [phase, onComplete])

  if (phase === 'done') return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'var(--zone-1-bg)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SoundToggle />

      {/* Text sequence */}
      <AnimatePresence mode="wait">
        {phase === 'text' && showText && SEQUENCE[textIndex] && (
          <motion.p
            key={textIndex}
            className="absolute text-center px-6 text-white/70 text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-mono)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {SEQUENCE[textIndex].text}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Logo + shatter scene */}
      {(phase === 'logo' || phase === 'shatter') && (
        <div className="w-full h-full absolute inset-0">
          <LoadingScene shatter={phase === 'shatter'} />
        </div>
      )}
    </motion.div>
  )
}
