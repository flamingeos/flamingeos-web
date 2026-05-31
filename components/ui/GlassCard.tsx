'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={`glass ${className}`}
      whileHover={hover ? { y: -8, rotateX: 4, rotateY: -4, scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}
