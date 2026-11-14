import { describe, it, expect } from 'vitest'
import { computeDifference } from './imageDiff'

function frame(width: number, height: number, pixels: number[][]): { width: number; height: number; data: Uint8ClampedArray } {
  const data = new Uint8ClampedArray(width * height * 4)
  pixels.forEach(([r, g, b, a], i) => {
    data.set([r, g, b, a], i * 4)
  })
  return { width, height, data }
}

describe('computeDifference', () => {
  it('returns an all-zero, fully-opaque frame when the two inputs are identical', () => {
    const a = frame(1, 2, [[10, 20, 30, 255], [40, 50, 60, 255]])
    const b = frame(1, 2, [[10, 20, 30, 255], [40, 50, 60, 255]])
    const result = computeDifference(a, b)
    expect(result).not.toBeNull()
    expect(Array.from(result!.data)).toEqual([0, 0, 0, 255, 0, 0, 0, 255])
  })

  it('returns the real per-channel absolute difference for mismatched pixels', () => {
    const a = frame(1, 1, [[200, 10, 0, 255]])
    const b = frame(1, 1, [[50, 90, 5, 255]])
    const result = computeDifference(a, b)
    expect(Array.from(result!.data)).toEqual([150, 80, 5, 255])
  })

  it('returns null instead of throwing when frame dimensions do not match', () => {
    const a = frame(2, 2, [[0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255], [0, 0, 0, 255]])
    const b = frame(1, 1, [[0, 0, 0, 255]])
    expect(computeDifference(a, b)).toBeNull()
  })
})
