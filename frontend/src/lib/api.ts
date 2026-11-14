import targets from '../fixtures/targets.json'
import type { TargetRecord } from '../fixtures/types'

export interface ArchiveSearchParams {
  query?: string
  ra?: number
  dec?: number
}

// Athena's /search endpoint isn't live yet. Once VITE_API_BASE_URL points
// at it, this starts returning real archive results instead of null — no
// other code needs to change. Mirrors askSkyshift's graceful-degrade shape.
export async function searchArchive(params: ArchiveSearchParams): Promise<TargetRecord[] | null> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) return null

  try {
    const url = new URL('/search', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`)
    if (params.query) url.searchParams.set('q', params.query)
    if (params.ra !== undefined) url.searchParams.set('ra', String(params.ra))
    if (params.dec !== undefined) url.searchParams.set('dec', String(params.dec))

    const response = await fetch(url.toString())
    if (!response.ok) return null
    const payload = await response.json()
    return Array.isArray(payload) ? (payload as TargetRecord[]) : null
  } catch {
    return null
  }
}

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

export interface AssistantContext {
  targetName: string
  channel: number
}

export interface FlagSubmission {
  target_id: string
}

export interface FlagSummaryEntry {
  country: string
  count: number
}

// Country is derived server-side from the request, never sent by the
// client — anonymous by construction, per docs/RULES_COMPLIANCE.md.
export async function submitFlag(submission: FlagSubmission): Promise<boolean> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) return false

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/flags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })
    return response.ok
  } catch {
    return false
  }
}

export async function getGlobalFlags(): Promise<FlagSummaryEntry[] | null> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) return null

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/flags/summary`)
    if (!response.ok) return null
    const payload = await response.json()
    return Array.isArray(payload) ? (payload as FlagSummaryEntry[]) : null
  } catch {
    return null
  }
}

export async function askSkyshift(question: string, context: AssistantContext): Promise<string | null> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) return null

  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, '')}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context }),
    })
    if (!response.ok) return null
    const payload = (await response.json()) as { answer?: string }
    return typeof payload.answer === 'string' && payload.answer.trim() ? payload.answer : null
  } catch {
    return null
  }
}
