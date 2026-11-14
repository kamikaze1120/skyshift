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

  return (
    <div className="flex flex-col gap-4 rounded border border-starlight/20 p-4">
      <form className="flex flex-wrap items-end gap-2" onSubmit={handleNameSearch}>
        <label className="flex flex-col text-sm">
          Name or designation
          <input
            type="text"
            value={nameQuery}
            onChange={e => setNameQuery(e.target.value)}
            className="rounded border border-starlight/30 bg-transparent px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
        >
          Search
        </button>
      </form>

      <form className="flex flex-wrap items-end gap-2" onSubmit={handleCoordinateSearch}>
        <label className="flex flex-col text-sm">
          RA (deg)
          <input
            type="number"
            value={raQuery}
            onChange={e => setRaQuery(e.target.value)}
            className="w-28 rounded border border-starlight/30 bg-transparent px-2 py-1"
          />
        </label>
        <label className="flex flex-col text-sm">
          Dec (deg)
          <input
            type="number"
            value={decQuery}
            onChange={e => setDecQuery(e.target.value)}
            className="w-28 rounded border border-starlight/30 bg-transparent px-2 py-1"
          />
        </label>
        <button
          type="submit"
          className="rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
        >
          Find by coordinates
        </button>
      </form>

      {notFound && (
        <p role="status" className="text-accent-amber">Not in the local demo set yet — try one of the curated targets below.</p>
      )}

      <div className="flex flex-wrap gap-2">
        {(targets as TargetRecord[]).map(target => (
          <button
            key={target.target_id}
            type="button"
            onClick={() => {
              setNotFound(false)
              onTargetSelected(target)
            }}
            className="flex items-center gap-1.5 rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
          >
            {target.display_name}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] uppercase tracking-wide ${
                target.verified ? 'bg-starlight/15 text-starlight/70' : 'bg-accent-amber/20 text-accent-amber'
              }`}
            >
              {target.verified ? 'Verified' : 'Unconfirmed'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CoordinateSearch
