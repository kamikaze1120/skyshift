export type ObjectType = 'asteroid' | 'comet' | 'star' | 'brown_dwarf' | 'unknown'

export interface Observation {
  epoch: string // ISO 8601
  wavelength_band: string
  image_url: string // Browser-friendly cutout URL; fixture-placeholder://<slug> is used when unavailable
  source_file: string
  doi: string
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
