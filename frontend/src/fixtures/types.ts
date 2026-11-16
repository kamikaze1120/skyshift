export type ObjectType = 'asteroid' | 'comet' | 'star' | 'brown_dwarf' | 'unknown'

export interface Observation {
  epoch: string // ISO 8601
  wavelength_band: string
  image_url: string // Browser-friendly cutout URL; fixture-placeholder://<slug> is used when unavailable
  source_file: string
  doi: string
  // Contamination flag names from the FITS FLAGS extension. undefined means
  // this pass never logged them (honest gap, not "none found"); an empty
  // array means they were checked and none were raised.
  flags?: string[]
}

export interface TargetRecord {
  target_id: string
  display_name: string
  object_type: ObjectType
  coordinates: { ra_deg: number; dec_deg: number }
  size_deg: number // fixed per-target FOV for the ?size= URL param
  observations: Observation[] // length >= 2
  known_motion_arcsec: number | null
  verified: boolean
  story_note: string | null
}

// Produced by scripts/fetch_catalog_overlays.py. Not every target has an
// entry — brown dwarfs are skipped for Gaia (too faint for its optical
// catalog) and only 433 Eros gets an SBDB entry (the one solar-system body).
export type CatalogOverlayStatus = 'ok' | 'no_match' | 'service_unreachable'

export interface GaiaSource {
  source_id: number
  ra: number
  dec: number
  phot_g_mean_mag: number | null
  parallax: number | null
  pmra: number | null
  pmdec: number | null
}

export interface GaiaOverlay {
  target_id: string
  source: 'Gaia DR3'
  query: string
  fetched_at: string
  status: CatalogOverlayStatus
  detail?: string
  sources: GaiaSource[]
}

export interface SbdbOverlay {
  target_id: string
  source: 'JPL Small-Body Database'
  query: string
  fetched_at: string
  status: CatalogOverlayStatus
  detail?: string
  object?: {
    shortname: string
    fullname: string
    neo: boolean
    pha: boolean
    orbit_class: { code: string; name: string }
  }
  discovery?: {
    discovery: string | null
    date: string | null
  } | null
}

export type CatalogOverlay = GaiaOverlay | SbdbOverlay
