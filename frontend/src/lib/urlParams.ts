import type { TargetRecord } from '../fixtures/types'

// Matches the FOV slider's min/max in SequenceViewer.tsx — a size outside
// this range would seed state the slider can't represent.
const MIN_FOV_DEG = 0.05
const MAX_FOV_DEG = 0.5

export function parseTargetParams(search: string): { ra: number; dec: number; size?: number } | null {
  const params = new URLSearchParams(search)
  const raStr = params.get('ra')
  const decStr = params.get('dec')
  if (raStr === null || decStr === null) return null

  const ra = Number.parseFloat(raStr)
  const dec = Number.parseFloat(decStr)
  if (!Number.isFinite(ra) || !Number.isFinite(dec)) return null
  if (ra < 0 || ra >= 360) return null
  if (dec < -90 || dec > 90) return null

  // size is informational (it seeds the FOV slider) — an unusable value
  // is dropped rather than invalidating an otherwise-good ra/dec link.
  const sizeStr = params.get('size')
  const size = sizeStr !== null ? Number.parseFloat(sizeStr) : NaN
  if (Number.isFinite(size) && size >= MIN_FOV_DEG && size <= MAX_FOV_DEG) return { ra, dec, size }

  return { ra, dec }
}

export function buildTargetParams(target: TargetRecord): string {
  const params = new URLSearchParams({
    ra: String(target.coordinates.ra_deg),
    dec: String(target.coordinates.dec_deg),
    size: String(target.size_deg),
  })
  return `?${params.toString()}`
}
