import { describe, it, expect } from 'vitest'
import { RELEASES, releaseForDoi, enabledReleases } from './releases'

describe('releases config', () => {
  it('resolves the real QR2 DOI this app actually cites to its release entry', () => {
    const release = releaseForDoi('10.26131/IRSA652')
    expect(release?.id).toBe('qr2')
    expect(release?.label).toBe('Quick Release 2')
  })

  it('returns undefined for a DOI with no matching release, instead of guessing one', () => {
    expect(releaseForDoi('10.26131/not-a-real-doi')).toBeUndefined()
  })

  it('enabledReleases only returns releases marked enabled', () => {
    expect(enabledReleases().every(r => r.enabled)).toBe(true)
    expect(enabledReleases().length).toBeGreaterThan(0)
  })

  it('every release carries the fields a generated citation needs', () => {
    for (const release of RELEASES) {
      expect(release.id).toBeTruthy()
      expect(release.label).toBeTruthy()
      expect(release.doi).toMatch(/^10\.26131\/IRSA\d+$/)
    }
  })
})
