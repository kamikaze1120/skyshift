import { describe, it, expect } from 'vitest'
import { getTargetById, searchTargets, findTargetByCoordinates } from './api'

describe('api (fixture-backed)', () => {
  it('getTargetById returns the matching record', () => {
    expect(getTargetById('433-eros-2025-06')?.display_name).toBe('433 Eros')
  })
  it('getTargetById returns undefined for an unknown id', () => {
    expect(getTargetById('nonexistent')).toBeUndefined()
  })
  it('searchTargets matches case-insensitive substrings of display_name', () => {
    expect(searchTargets('barnard').map(t => t.target_id)).toContain('barnards-star-2025-2026')
  })
  it('searchTargets returns no results for an empty or blank query, instead of matching everything', () => {
    expect(searchTargets('')).toEqual([])
    expect(searchTargets('   ')).toEqual([])
  })
  it('findTargetByCoordinates matches within the default tolerance', () => {
    expect(findTargetByCoordinates(7.41, 9.98)?.target_id).toBe('433-eros-2025-06')
  })
  it('findTargetByCoordinates returns undefined far from any fixture', () => {
    expect(findTargetByCoordinates(0, 0)).toBeUndefined()
  })
})
