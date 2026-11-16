import overlaysData from '../fixtures/catalogOverlays.json'
import type { CatalogOverlay } from '../fixtures/types'

const OVERLAYS = overlaysData as CatalogOverlay[]

export function getCatalogOverlay(targetId: string): CatalogOverlay | undefined {
  return OVERLAYS.find(overlay => overlay.target_id === targetId)
}
