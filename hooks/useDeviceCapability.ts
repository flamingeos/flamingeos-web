'use client'
import { useMemo } from 'react'

export type DeviceCapability = 'high' | 'medium' | 'low'

export function useDeviceCapability(): DeviceCapability {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'high'

    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
    const cores = navigator.hardwareConcurrency ?? 4
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4

    if (!isMobile) return 'high'
    if (cores <= 2 || memory <= 1) return 'low'
    return 'medium'
  }, [])
}
