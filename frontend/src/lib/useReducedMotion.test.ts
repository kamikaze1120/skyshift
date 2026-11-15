import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  it('reflects a live change to the media query, not just the value at mount', () => {
    let listener: (e: { matches: boolean }) => void = () => {}
    const mql = {
      matches: false,
      addEventListener: (_: string, cb: typeof listener) => { listener = cb },
      removeEventListener: vi.fn(),
    }
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))
    const { result } = renderHook(() => useReducedMotion())
    expect(result.current).toBe(false)
    act(() => { listener({ matches: true }) })
    expect(result.current).toBe(true)
  })
})
