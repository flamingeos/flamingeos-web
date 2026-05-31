import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'

describe('useDeviceCapability', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true, value: 8,
    })
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    })
  })

  it('returns high for desktop', () => {
    const { result } = renderHook(() => useDeviceCapability())
    expect(result.current).toBe('high')
  })

  it('returns medium for modern mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    })
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true, value: 6,
    })
    const { result } = renderHook(() => useDeviceCapability())
    expect(result.current).toBe('medium')
  })

  it('returns low for underpowered mobile', () => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: 'Mozilla/5.0 (Linux; Android 8.0; SM-G960F)',
    })
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true, value: 2,
    })
    const { result } = renderHook(() => useDeviceCapability())
    expect(result.current).toBe('low')
  })
})
