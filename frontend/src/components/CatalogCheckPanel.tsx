import { getCatalogOverlay } from '../lib/catalogOverlays'

interface CatalogCheckPanelProps {
  targetId: string
}

function CatalogCheckPanel({ targetId }: CatalogCheckPanelProps) {
  const overlay = getCatalogOverlay(targetId)
  if (!overlay) return null

  return (
    <div className="m-3 rounded-2xl border border-l-4 border-starlight/10 border-l-neon-blue/50 bg-starlight/[.035] px-4 py-4 sm:px-5">
      <p className="text-[9px] uppercase tracking-[.22em] text-moon/45">Catalog check</p>
      <h3 className="display-font mt-1 text-sm text-starlight">{overlay.source}</h3>

      {overlay.source === 'JPL Small-Body Database' && (
        <>
          {overlay.status === 'ok' && overlay.object ? (
            <div className="mt-2 space-y-1 text-[10px] leading-relaxed text-moon/65">
              <p>{overlay.object.fullname} — {overlay.object.orbit_class.name}-class{overlay.object.neo ? ', near-Earth object' : ''}</p>
              {overlay.discovery?.discovery && <p className="text-moon/45">{overlay.discovery.discovery}</p>}
            </div>
          ) : (
            <p className="mt-2 text-[10px] leading-relaxed text-accent-ember/75">
              JPL SBDB could not be reached when this was last checked.
            </p>
          )}
        </>
      )}

      {overlay.source === 'Gaia DR3' && (
        <>
          {overlay.status === 'ok' && overlay.sources.length > 0 ? (
            <ul className="mt-2 space-y-1 text-[10px] leading-relaxed text-moon/65">
              {overlay.sources.map(source => (
                <li key={source.source_id}>
                  Source {source.source_id} · G {source.phot_g_mean_mag?.toFixed(2) ?? '—'} mag
                  {source.parallax != null && ` · parallax ${source.parallax.toFixed(2)} mas`}
                </li>
              ))}
            </ul>
          ) : overlay.status === 'no_match' ? (
            <p className="mt-2 text-[10px] leading-relaxed text-moon/45">
              No Gaia DR3 source within 5 arcsec of this target.
            </p>
          ) : (
            <p className="mt-2 text-[10px] leading-relaxed text-accent-ember/75">
              Gaia DR3 could not be reached when this was last checked.
            </p>
          )}
        </>
      )}

      <p className="mt-3 border-t border-starlight/[.06] pt-2 text-[9px] text-moon/30">
        {overlay.query}
      </p>
    </div>
  )
}

export default CatalogCheckPanel
