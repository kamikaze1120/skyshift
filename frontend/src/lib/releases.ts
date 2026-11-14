// New SPHEREx releases ship weekly. Adding one here is the only change
// needed — SourcePanel and AboutSection both render from this list, so a
// new release's DOI appears on the About page automatically instead of
// depending on someone remembering to update hand-written citation text.
export interface ReleaseConfig {
  id: string
  label: string
  doi: string
  starts: string
  ends: string | null
  enabled: boolean
}

export const RELEASES: ReleaseConfig[] = [
  {
    id: 'qr2',
    label: 'Quick Release 2',
    doi: '10.26131/IRSA652',
    starts: '2025-04-24',
    ends: '2026-07-20',
    enabled: true,
  },
]

export function releaseForDoi(doi: string): ReleaseConfig | undefined {
  return RELEASES.find(release => release.doi === doi)
}

export function enabledReleases(): ReleaseConfig[] {
  return RELEASES.filter(release => release.enabled)
}
