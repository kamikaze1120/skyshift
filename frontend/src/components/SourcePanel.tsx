import type { Observation } from '../fixtures/types'
import { releaseForDoi } from '../lib/releases'

interface SourcePanelProps {
  observation: Observation
  verified: boolean
  storyNote?: string | null
}

function shortFile(sourceFile: string) {
  const segments = sourceFile.split('/')
  return segments.length > 1 ? segments.at(-1) : sourceFile
}

function releaseLabel(doi: string) {
  return releaseForDoi(doi)?.label ?? 'Unlisted release'
}

function flagsLabel(flags: string[] | undefined) {
  if (flags === undefined) return 'Not logged in this pass'
  if (flags.length === 0) return 'No flags raised'
  return flags.join(', ')
}

function SourcePanel({ observation, verified, storyNote = null }: SourcePanelProps) {
  return (
    <div className="soft-scrollbar flex max-h-full flex-col overflow-y-auto p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-[.22em] text-moon/45">Archive details</p>
          <h2 className="display-font mt-1 text-xl text-starlight">Research record</h2>
        </div>
        <span className={`rounded-full border px-2 py-1 text-[8px] uppercase tracking-[.16em] ${verified ? 'border-orbit/20 bg-orbit/8 text-orbit/75' : 'border-accent-ember/20 bg-accent-ember/8 text-accent-ember/75'}`}>
          {verified ? 'Verified' : 'Review'}
        </span>
      </div>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-[9px] uppercase tracking-[.16em] text-moon/35">Observation date</dt>
          <dd className="mt-1 text-xs leading-relaxed text-moon/75">{observation.epoch}</dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-[9px] uppercase tracking-[.16em] text-moon/35">Detector band</dt>
            <dd className="mt-1 text-xs leading-relaxed text-moon/75">{observation.wavelength_band}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-[.16em] text-moon/35">Release</dt>
            <dd className="mt-1 text-xs text-moon/75">{releaseLabel(observation.doi)}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-[.16em] text-moon/35">Quality flags</dt>
            <dd className={`mt-1 text-xs ${observation.flags && observation.flags.length > 0 ? 'text-accent-ember/80' : 'text-moon/75'}`}>
              {flagsLabel(observation.flags)}
            </dd>
          </div>
        </div>
        <div>
          <dt className="text-[9px] uppercase tracking-[.16em] text-moon/35">Source file</dt>
          <dd className="mt-1 break-all rounded-xl border border-starlight/[.07] bg-black/15 px-2.5 py-2 text-[10px] leading-relaxed text-moon/60" title={observation.source_file}>
            {shortFile(observation.source_file)}
            <span className="sr-only">{observation.source_file}</span>
          </dd>
        </div>
        <div>
          <dt className="text-[9px] uppercase tracking-[.16em] text-moon/35">Persistent record</dt>
          <dd className="mt-1">
            <a
              href={`https://doi.org/${observation.doi}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-lilac/15 bg-lilac/[.055] px-3 py-2 text-xs text-lilac/80 transition hover:border-lilac/30 hover:bg-lilac/10 hover:text-starlight focus-visible:outline-2 focus-visible:outline-orbit"
            >
              {observation.doi}
              <svg viewBox="0 0 20 20" className="size-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"><path d="M7 5h8v8M15 5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </dd>
        </div>
      </dl>

      {!verified && (
        <p className="mt-5 rounded-xl border border-accent-ember/15 bg-accent-ember/[.055] px-3 py-2.5 text-[10px] leading-relaxed text-accent-ember/75">
          {storyNote ?? "Not yet confirmed — this detection needs a re-check before it's treated as a success."}
        </p>
      )}
    </div>
  )
}

export default SourcePanel
