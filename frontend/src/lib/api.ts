import targets from '../fixtures/targets.json'
import type { TargetRecord } from '../fixtures/types'

const COORDINATE_TOLERANCE_DEG = 0.05

export function getTargetById(id: string): TargetRecord | undefined {
  return (targets as TargetRecord[]).find(t => t.target_id === id)
}

export function searchTargets(query: string): TargetRecord[] {
  const needle = query.trim().toLowerCase()
  if (needle === '') return []
  return (targets as TargetRecord[]).filter(t =>
    t.display_name.toLowerCase().includes(needle)
  )
}

export function findTargetByCoordinates(
  ra_deg: number,
  dec_deg: number,
  toleranceDeg: number = COORDINATE_TOLERANCE_DEG
): TargetRecord | undefined {
  return (targets as TargetRecord[]).find(
    t =>
      Math.abs(t.coordinates.ra_deg - ra_deg) <= toleranceDeg &&
      Math.abs(t.coordinates.dec_deg - dec_deg) <= toleranceDeg
  )
}
