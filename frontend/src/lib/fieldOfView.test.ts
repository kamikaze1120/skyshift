import { describe, it, expect } from 'vitest'
import { fovToScale } from './fieldOfView'

describe('fovToScale', () => {
  it('shows no crop at the widest field of view', () => {
    expect(fovToScale(0.5)).toBe(1)
  })

  it('crops in the most at the closest field of view', () => {
    expect(fovToScale(0.05)).toBe(2.5)
  })

  it('is monotonically larger as the field of view narrows', () => {
    expect(fovToScale(0.1)).toBeGreaterThan(fovToScale(0.3))
    expect(fovToScale(0.3)).toBeGreaterThan(fovToScale(0.5))
  })

  it('clamps out-of-range values instead of extrapolating past the slider bounds', () => {
    expect(fovToScale(1)).toBe(1)
    expect(fovToScale(0)).toBe(2.5)
  })
})
