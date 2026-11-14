import { describe, it, expect } from 'vitest'
import { SPHEREX_BAND_COUNT, SPHEREX_WAVELENGTH_RANGE_UM, getBand, getLoggedDetector } from './spherexBands'

describe('spherexBands', () => {
  it('exposes the official band count and wavelength range from the challenge statement', () => {
    expect(SPHEREX_BAND_COUNT).toBe(102)
    expect(SPHEREX_WAVELENGTH_RANGE_UM).toEqual([0.75, 5.0])
  })

  it('band 1 sits at the start of the documented wavelength range, on detector D1', () => {
    const band = getBand(1)
    expect(band.wavelengthUm).toBeCloseTo(0.75, 2)
    expect(band.detector).toBe('D1')
  })

  it('the last band sits at the end of the documented wavelength range, on detector D6', () => {
    const band = getBand(SPHEREX_BAND_COUNT)
    expect(band.wavelengthUm).toBeCloseTo(5.0, 2)
    expect(band.detector).toBe('D6')
  })

  it('clamps an out-of-range index instead of returning a nonsensical band', () => {
    expect(getBand(0).index).toBe(1)
    expect(getBand(9999).index).toBe(SPHEREX_BAND_COUNT)
  })

  it('wavelength increases monotonically with band index', () => {
    const low = getBand(10)
    const high = getBand(90)
    expect(high.wavelengthUm).toBeGreaterThan(low.wavelengthUm)
  })

  it('recognizes a real logged detector tag, like the one our 433 Eros fixture actually has', () => {
    expect(getLoggedDetector('D1')).toBe('D1')
  })

  it('treats an unlogged detector honestly as null instead of guessing', () => {
    expect(getLoggedDetector('unknown — detector not logged in this pass')).toBeNull()
  })
})
