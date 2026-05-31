'use client'
import { motion } from 'framer-motion'

export function ScrollCue() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
    >
      <span
        className="text-xs tracking-widest text-white/30 uppercase"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        scroll
      </span>
      <motion.div
        className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent"
        animate={{ scaleY: [1, 0.4, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
