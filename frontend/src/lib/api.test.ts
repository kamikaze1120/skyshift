import { describe, it, expect, vi, afterEach } from 'vitest'
import { getTargetById, searchTargets, findTargetByCoordinates, searchArchive } from './api'

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

describe('searchArchive (backend, optional)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns null without calling fetch when no backend URL is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const result = await searchArchive({ query: 'Eros' })
    expect(result).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns the parsed array when the backend responds with target records', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    const remoteTarget = { target_id: 'remote-1', display_name: 'Remote Object' }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [remoteTarget],
    }))
    const result = await searchArchive({ query: 'Remote' })
    expect(result).toEqual([remoteTarget])
  })

  it('returns null, not a throw, when the backend is unreachable', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await searchArchive({ query: 'Eros' })
    expect(result).toBeNull()
  })

  it('returns null when the backend responds but not ok', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => [] }))
    const result = await searchArchive({ query: 'Eros' })
    expect(result).toBeNull()
  })
})
