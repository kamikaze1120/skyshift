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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="flex flex-col gap-2 border-b border-starlight/10 bg-space-950/80 px-3 py-2 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-display text-base italic tracking-wide text-starlight">Skyshift</span>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(open => !open)}
          aria-expanded={mobileMenuOpen}
          className="ml-auto rounded border border-starlight/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime md:hidden"
        >
          Menu
        </button>

        <div
          className={`${mobileMenuOpen ? 'flex' : 'hidden'} w-full flex-col gap-1.5 md:flex md:w-auto md:flex-row md:items-center md:gap-2`}
        >
          <div className="flex flex-wrap gap-1.5">
            {curatedTargets.map(target => (
              <button
                key={target.target_id}
                type="button"
                onClick={() => onTargetSelected(target)}
                aria-pressed={target.target_id === activeTarget.target_id}
                className={`rounded border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime ${
                  target.target_id === activeTarget.target_id
                    ? 'border-accent-lime text-accent-lime'
                    : 'border-starlight/20 text-starlight/80'
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
            className="rounded border border-starlight/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime"
          >
            Search
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ShareLinkBadge target={activeTarget} />
          <button
            type="button"
            onClick={onReplayIntro}
            className="rounded border border-starlight/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-starlight/70 hover:text-starlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime"
          >
            Replay intro
          </button>
          <button
            type="button"
            onClick={onToggleAbout}
            className="rounded border border-starlight/20 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-lime"
          >
            About
          </button>
        </div>
      </div>

      {linkNotFound && (
        <p role="status" className="font-mono text-xs text-accent-lime">
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
