import type { Observation } from '../fixtures/types'

interface SourcePanelProps {
  observation: Observation
  verified: boolean
  storyNote?: string | null
}

function SourcePanel({ observation, verified, storyNote = null }: SourcePanelProps) {
  return (
    <div className="rounded border border-starlight/20 bg-black/30 p-3 text-sm">
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
        <dt className="text-starlight/60">Source file</dt>
        <dd className="break-all">{observation.source_file}</dd>
        <dt className="text-starlight/60">DOI</dt>
        <dd>
          <a
            href={`https://doi.org/${observation.doi}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-accent-ember"
          >
            {observation.doi}
          </a>
        </dd>
        <dt className="text-starlight/60">Epoch</dt>
        <dd>{observation.epoch}</dd>
        <dt className="text-starlight/60">Band</dt>
        <dd>{observation.wavelength_band}</dd>
      </dl>
      {!verified && (
        <p className="mt-2 text-accent-ember">
          {storyNote ?? "Not yet confirmed — this detection needs a re-check before it's treated as a success."}
        </p>
      )}
    </div>
  )
}

export default SourcePanel
