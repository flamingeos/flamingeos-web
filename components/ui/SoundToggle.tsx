'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function SoundToggle() {
  const [on, setOn] = useState(false)

  return (
    <motion.button
      onClick={() => setOn(!on)}
      className="fixed top-6 right-6 z-50 glass px-4 py-2 text-xs text-white/60 hover:text-white transition-colors"
      style={{ fontFamily: 'var(--font-mono)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      aria-label={on ? 'Mute ambient sound' : 'Enable ambient sound'}
    >
      {on ? '◼ SOUND' : '▶ SOUND'}
    </motion.button>
  )
}
