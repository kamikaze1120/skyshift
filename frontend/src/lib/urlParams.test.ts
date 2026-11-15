import { describe, it, expect } from 'vitest'
import { parseTargetParams, buildTargetParams } from './urlParams'
import targets from '../fixtures/targets.json'
import type { TargetRecord } from '../fixtures/types'

describe('urlParams', () => {
  it('parses valid ra/dec/size', () => {
    expect(parseTargetParams('?ra=7.41&dec=9.98&size=0.3')).toEqual({ ra: 7.41, dec: 9.98, size: 0.3 })
  })
  it('parses valid ra/dec when size is absent, without inventing one', () => {
    expect(parseTargetParams('?ra=7.41&dec=9.98')).toEqual({ ra: 7.41, dec: 9.98 })
  })
  it('drops an unusable size instead of rejecting an otherwise-valid link', () => {
    expect(parseTargetParams('?ra=7.41&dec=9.98&size=not-a-number')).toEqual({ ra: 7.41, dec: 9.98 })
  })
  it('drops a size outside the FOV slider\'s representable range (0.05-0.5)', () => {
    expect(parseTargetParams('?ra=7.41&dec=9.98&size=100')).toEqual({ ra: 7.41, dec: 9.98 })
  })
  it('returns null for missing params', () => {
    expect(parseTargetParams('')).toBeNull()
  })
  it('returns null for out-of-range dec', () => {
    expect(parseTargetParams('?ra=7.41&dec=200&size=0.3')).toBeNull()
  })
  it('returns null for non-numeric ra', () => {
    expect(parseTargetParams('?ra=abc&dec=9.98')).toBeNull()
  })
  it('builds a round-trippable param string for a fixture target, including size', () => {
    const eros = (targets as TargetRecord[])[0]
    const built = buildTargetParams(eros)
    expect(parseTargetParams(built)).toEqual({ ra: eros.coordinates.ra_deg, dec: eros.coordinates.dec_deg, size: eros.size_deg })
  })
})
