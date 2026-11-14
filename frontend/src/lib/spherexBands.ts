// Real, documented SPHEREx instrument facts (docs/CHALLENGE.md, docs/IRSA_DATA_GUIDE.md):
// the mission maps the sky in 102 bands of near-infrared light, 0.75-5.0 micron,
// split across 6 physical detector arrays per exposure. We don't have per-channel
// calibration data in this app, so wavelengths here are a linear approximation
// across that documented range, not a read from a real per-band lookup table.
export const SPHEREX_BAND_COUNT = 102
export const SPHEREX_WAVELENGTH_RANGE_UM: [number, number] = [0.75, 5.0]
export const SPHEREX_DETECTOR_COUNT = 6

export interface SpherexBand {
  index: number
  wavelengthUm: number
  detector: string
}

const DETECTOR_TAG_PATTERN = /^D[1-6]$/

// Fixture `wavelength_band` values are either a real detector tag (433 Eros's
// observations say "D1") or an honest "unknown — detector not logged in this
// pass" string. Anything that isn't a real tag is treated as not logged,
// rather than guessed at.
export function getLoggedDetector(wavelengthBand: string): string | null {
  return DETECTOR_TAG_PATTERN.test(wavelengthBand) ? wavelengthBand : null
}

export function getBand(index: number): SpherexBand {
  const clamped = Math.min(Math.max(1, Math.round(index)), SPHEREX_BAND_COUNT)
  const fraction = (clamped - 1) / (SPHEREX_BAND_COUNT - 1)
  const [minUm, maxUm] = SPHEREX_WAVELENGTH_RANGE_UM
  const wavelengthUm = minUm + fraction * (maxUm - minUm)
  const detectorIndex = Math.min(SPHEREX_DETECTOR_COUNT, Math.ceil((clamped / SPHEREX_BAND_COUNT) * SPHEREX_DETECTOR_COUNT))
  return { index: clamped, wavelengthUm, detector: `D${detectorIndex}` }
}
