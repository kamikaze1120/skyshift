import { useState } from 'react'
import type { TargetRecord } from '../fixtures/types'
import CoordinateSearch from './CoordinateSearch'
import ShareLinkBadge from './ShareLinkBadge'

interface NavBarProps {
  curatedTargets: TargetRecord[]
  activeTarget: TargetRecord
  onTargetSelected: (target: TargetRecord) => void
  onReplayIntro: () => void
  onToggleAbout: () => void
  linkNotFound: boolean
}

function NavBar({ curatedTargets, activeTarget, onTargetSelected, onReplayIntro, onToggleAbout, linkNotFound }: NavBarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="flex flex-col gap-3 border-b border-starlight/20 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-lg font-semibold tracking-wide">Skyshift</span>

        <div className="flex flex-wrap gap-1.5">
          {curatedTargets.map(target => (
            <button
              key={target.target_id}
              type="button"
              onClick={() => onTargetSelected(target)}
              aria-pressed={target.target_id === activeTarget.target_id}
              className={`rounded border px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ember ${
                target.target_id === activeTarget.target_id
                  ? 'border-accent-ember text-accent-ember'
                  : 'border-starlight/30 text-starlight'
              }`}
            >
              {target.display_name}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(open => !open)}
          aria-expanded={searchOpen}
          className="rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ember"
        >
          Search
        </button>

        <button
          type="button"
          onClick={onReplayIntro}
          className="rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ember"
        >
          Replay intro
        </button>

        <div className="ml-auto flex items-center gap-3">
          <ShareLinkBadge target={activeTarget} />
          <button
            type="button"
            onClick={onToggleAbout}
            className="rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-ember"
          >
            About
          </button>
        </div>
      </div>

      {linkNotFound && (
        <p role="status" className="text-accent-ember">
          Not in the local demo set yet — here are the curated targets you can explore instead.
        </p>
      )}

      {searchOpen && (
        <div className="mt-1">
          <CoordinateSearch onTargetSelected={onTargetSelected} />
        </div>
      )}
    </header>
  )
}

export default NavBar
