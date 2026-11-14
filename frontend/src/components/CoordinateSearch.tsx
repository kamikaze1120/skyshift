import { useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import { searchTargets, findTargetByCoordinates } from '../lib/api'
import targets from '../fixtures/targets.json'

interface CoordinateSearchProps {
  onTargetSelected: (target: TargetRecord) => void
}

function CoordinateSearch({ onTargetSelected }: CoordinateSearchProps) {
  const [nameQuery, setNameQuery] = useState('')
  const [raQuery, setRaQuery] = useState('')
  const [decQuery, setDecQuery] = useState('')
  const [notFound, setNotFound] = useState(false)

  function handleNameSearch(event: React.FormEvent) {
    event.preventDefault()
    const matches = searchTargets(nameQuery)
    if (matches.length > 0) {
      setNotFound(false)
      onTargetSelected(matches[0])
    } else {
      setNotFound(true)
    }
  }

  function handleCoordinateSearch(event: React.FormEvent) {
    event.preventDefault()
    const ra = Number.parseFloat(raQuery)
    const dec = Number.parseFloat(decQuery)
    const match = Number.isFinite(ra) && Number.isFinite(dec) ? findTargetByCoordinates(ra, dec) : undefined
    if (match) {
      setNotFound(false)
      onTargetSelected(match)
    } else {
      setNotFound(true)
    }
  }

  const inputClass = 'mt-1.5 h-10 rounded-xl border border-starlight/10 bg-black/15 px-3 text-sm text-starlight outline-none transition placeholder:text-moon/25 focus:border-orbit/35 focus:bg-black/25'

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4 px-1">
        <div>
          <p className="text-[9px] uppercase tracking-[.22em] text-orbit/60">Navigate the archive</p>
          <h2 className="display-font mt-1 text-2xl text-starlight">Where should we look?</h2>
        </div>
        <span className="hidden text-[10px] text-moon/35 sm:block">Try “Eros” or enter sky coordinates</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <form className="flex items-end gap-2 rounded-xl border border-starlight/[.07] bg-starlight/[.025] p-3" onSubmit={handleNameSearch}>
          <label className="flex min-w-0 flex-1 flex-col text-[10px] uppercase tracking-[.15em] text-moon/45">
            Name or designation
            <input type="text" value={nameQuery} onChange={e => setNameQuery(e.target.value)} placeholder="433 Eros" className={inputClass} />
          </label>
          <button type="submit" className="h-10 rounded-xl bg-starlight px-4 text-xs font-medium text-space-950 transition hover:bg-orbit focus-visible:outline-2 focus-visible:outline-orbit">
            Search
          </button>
        </form>

        <div className="hidden items-center text-[9px] uppercase tracking-[.2em] text-moon/25 lg:flex">or</div>

        <form className="flex items-end gap-2 rounded-xl border border-starlight/[.07] bg-starlight/[.025] p-3" onSubmit={handleCoordinateSearch}>
          <label className="flex min-w-0 flex-1 flex-col text-[10px] uppercase tracking-[.15em] text-moon/45">
            RA (deg)
            <input type="number" value={raQuery} onChange={e => setRaQuery(e.target.value)} placeholder="269.446" className={inputClass} />
          </label>
          <label className="flex min-w-0 flex-1 flex-col text-[10px] uppercase tracking-[.15em] text-moon/45">
            Dec (deg)
            <input type="number" value={decQuery} onChange={e => setDecQuery(e.target.value)} placeholder="+4.767" className={inputClass} />
          </label>
          <button type="submit" className="h-10 rounded-xl border border-starlight/15 bg-starlight/[.06] px-4 text-xs text-starlight transition hover:bg-starlight/10 focus-visible:outline-2 focus-visible:outline-orbit">
            Find
          </button>
        </form>
      </div>

      {notFound && <p role="status" className="mt-3 rounded-xl border border-accent-ember/15 bg-accent-ember/[.05] px-3 py-2 text-xs text-accent-ember">Not in the local demo set yet — try one of the curated targets below.</p>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(targets as TargetRecord[]).map(target => (
          <button
            key={target.target_id}
            type="button"
            onClick={() => { setNotFound(false); onTargetSelected(target) }}
            className="flex items-center gap-1.5 rounded-full border border-starlight/10 bg-starlight/[.035] px-2.5 py-1.5 text-[10px] text-moon/65 transition hover:border-lilac/25 hover:bg-lilac/[.07] hover:text-starlight focus-visible:outline-2 focus-visible:outline-orbit"
          >
            {target.display_name}
            <span className={`size-1.5 rounded-full ${target.verified ? 'bg-orbit/70' : 'bg-accent-ember/70'}`} />
            <span className="sr-only">{target.verified ? 'Verified' : 'Unconfirmed'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CoordinateSearch
