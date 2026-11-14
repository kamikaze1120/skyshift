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

  it('marks exactly three targets verified: true', () => {
    const verifiedCount = (targets as TargetRecord[]).filter(t => t.verified).length
    expect(verifiedCount).toBe(3)
  })
})
