import { describe, it, expect } from 'vitest'
import { getCatalogOverlay } from './catalogOverlays'

describe('catalogOverlays', () => {
  it('returns the real JPL SBDB record for 433 Eros', () => {
    const overlay = getCatalogOverlay('433-eros-2025-06')
    expect(overlay?.source).toBe('JPL Small-Body Database')
    expect(overlay?.status).toBe('ok')
    if (overlay?.source === 'JPL Small-Body Database') {
      expect(overlay.object?.fullname).toContain('Eros')
    }
  })

  it('reports the real Gaia DR3 fetch status for a star target instead of hiding it', () => {
    const overlay = getCatalogOverlay('barnards-star-2025-2026')
    expect(overlay?.source).toBe('Gaia DR3')
    expect(overlay?.query).toContain('gea.esac.esa.int')
  })

  it('returns undefined for a brown-dwarf target, which was intentionally skipped', () => {
    expect(getCatalogOverlay('epsilon-indi-b-2025-2026')).toBeUndefined()
  })

  it('returns undefined for a target id with no overlay entry at all', () => {
    expect(getCatalogOverlay('not-a-real-target')).toBeUndefined()
  })
})
