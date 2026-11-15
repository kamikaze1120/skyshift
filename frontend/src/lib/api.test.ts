import { describe, it, expect, vi, afterEach } from 'vitest'
import { getTargetById, searchTargets, findTargetByCoordinates, searchArchive, submitFlag, getGlobalFlags, askSkyshift } from './api'

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
    const remoteTarget = { target_id: 'remote-1', display_name: 'Remote Object', observations: [{ image_url: 'a.png' }] }
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

  it('preserves a path prefix in the configured base URL, like its sibling endpoints do', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.skyshift.app/v1')
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    vi.stubGlobal('fetch', fetchSpy)
    await searchArchive({ query: 'Eros' })
    const calledUrl = fetchSpy.mock.calls[0][0].toString()
    expect(calledUrl.startsWith('https://api.skyshift.app/v1/search')).toBe(true)
  })

  it('drops a remote record with no observations instead of handing the app something that will crash the viewer', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    const good = { target_id: 'remote-1', display_name: 'Remote Object', observations: [{ image_url: 'a.png' }] }
    const malformed = { target_id: 'remote-2', display_name: 'Empty Object', observations: [] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [good, malformed] }))
    const result = await searchArchive({ query: 'Remote' })
    expect(result).toEqual([good])
  })
})

describe('submitFlag (backend, optional)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns false without calling fetch when no backend URL is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const result = await submitFlag({ target_id: '433-eros-2025-06' })
    expect(result).toBe(false)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns true when the backend accepts the flag', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }))
    const result = await submitFlag({ target_id: '433-eros-2025-06' })
    expect(result).toBe(true)
  })

  it('returns false, not a throw, when the backend is unreachable', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await submitFlag({ target_id: '433-eros-2025-06' })
    expect(result).toBe(false)
  })

  it('returns false when the backend responds but not ok', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await submitFlag({ target_id: '433-eros-2025-06' })
    expect(result).toBe(false)
  })
})

describe('getGlobalFlags (backend, optional)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('returns null without calling fetch when no backend URL is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const result = await getGlobalFlags()
    expect(result).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns the parsed country tally when the backend responds', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    const tally = [{ country: 'Kenya', count: 3 }, { country: 'Japan', count: 1 }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => tally }))
    const result = await getGlobalFlags()
    expect(result).toEqual(tally)
  })

  it('returns null, not a throw, when the backend is unreachable', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await getGlobalFlags()
    expect(result).toBeNull()
  })
})

describe('askSkyshift (backend, optional)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  const context = { targetName: '433 Eros', channel: 51 }

  it('returns null without calling fetch when no backend URL is configured', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const result = await askSkyshift('What moved?', context)
    expect(result).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('returns the real answer when the backend responds with one', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ answer: 'It drifted 604 arcsec.' }) }))
    const result = await askSkyshift('What moved?', context)
    expect(result).toBe('It drifted 604 arcsec.')
  })

  it('returns null instead of a fabricated answer when the backend response has no answer text', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ answer: '  ' }) }))
    const result = await askSkyshift('What moved?', context)
    expect(result).toBeNull()
  })

  it('returns null, not a throw, when the backend is unreachable', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await askSkyshift('What moved?', context)
    expect(result).toBeNull()
  })

  it('returns null when the backend responds but not ok', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8000')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await askSkyshift('What moved?', context)
    expect(result).toBeNull()
  })
})
