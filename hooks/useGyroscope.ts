'use client'
import { useState, useEffect } from 'react'

export function useGyroscope() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('DeviceOrientationEvent' in window)) return

    const handler = (e: DeviceOrientationEvent) => {
      const x = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 45))
      const y = Math.max(-1, Math.min(1, (e.beta ?? 0) / 45))
      setTilt({ x, y })
    }

    window.addEventListener('deviceorientation', handler)
    return () => window.removeEventListener('deviceorientation', handler)
  }, [])

  return tilt
}
