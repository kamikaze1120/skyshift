import { describe, it, expect } from 'vitest'
import targets from './targets.json'
import type { TargetRecord } from './types'

describe('targets fixture', () => {
  it('has exactly six records, each with at least two observations', () => {
    expect(targets).toHaveLength(6)
    for (const t of targets as TargetRecord[]) {
      expect(t.observations.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('marks exactly five targets verified: true', () => {
    // WISE 0855 and Epsilon Indi B moved from 3 to 5 once the proper-motion
    // fix (backend PR #77) turned their searches from empty into real hits.
    const verifiedCount = (targets as TargetRecord[]).filter(t => t.verified).length
    expect(verifiedCount).toBe(5)
  })
})
