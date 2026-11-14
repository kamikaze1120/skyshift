import type { Observation } from '../fixtures/types'

interface SourcePanelProps {
  observation: Observation
  verified: boolean
  storyNote?: string | null
}

function SourcePanel({ observation, verified, storyNote = null }: SourcePanelProps) {
  return (
    <div className="rounded border border-starlight/20 bg-black/30 p-3 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
        <dt className="font-mono text-[10px] uppercase tracking-wide text-starlight/50">Source file</dt>
        <dd className="break-all font-mono text-xs text-starlight/90">{observation.source_file}</dd>
        <dt className="font-mono text-[10px] uppercase tracking-wide text-starlight/50">DOI</dt>
        <dd className="font-mono text-xs">
          <a
            href={`https://doi.org/${observation.doi}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-accent-amber"
          >
            {observation.doi}
          </a>
        </dd>
        <dt className="font-mono text-[10px] uppercase tracking-wide text-starlight/50">Epoch</dt>
        <dd className="font-mono text-xs text-starlight/90">{observation.epoch}</dd>
        <dt className="font-mono text-[10px] uppercase tracking-wide text-starlight/50">Band</dt>
        <dd className="font-mono text-xs text-starlight/90">{observation.wavelength_band}</dd>
      </dl>
      {!verified && (
        <p className="mt-2 text-accent-amber">
          {storyNote ?? "Not yet confirmed — this detection needs a re-check before it's treated as a success."}
        </p>
      )}
    </div>
  )
}

export default SourcePanel
