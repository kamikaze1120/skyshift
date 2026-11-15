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
  const [targetMenuOpen, setTargetMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30">
      <div className="pointer-events-auto flex h-20 items-center border-b border-starlight/10 bg-space-950/40 px-5 backdrop-blur-sm sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="relative grid size-9 place-items-center" aria-hidden="true">
            <span className="absolute h-4 w-8 -rotate-12 rounded-[50%] border border-accent-ember/65" />
            <span className="size-2 rounded-full bg-starlight shadow-[0_0_14px_rgba(255,255,255,.7)]" />
          </span>
          <div>
            <span className="display-font block text-xl leading-none text-starlight">Skyshift</span>
            <span className="micro-label mt-1 block text-moon/40">SPHEREx · 2026</span>
          </div>
          <span className="mx-3 hidden h-6 w-px bg-starlight/10 sm:block" aria-hidden="true" />
          <img src="/brand/space-apps-mark.svg" alt="NASA Space Apps Challenge" className="hidden size-6 opacity-80 sm:block" />
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex">
          <button type="button" onClick={onReplayIntro} aria-label="Replay intro story" className="micro-label text-moon/45 transition hover:text-starlight focus-visible:outline-2 focus-visible:outline-accent-ember">
            Story
          </button>
          <button type="button" onClick={() => setSearchOpen(open => !open)} aria-expanded={searchOpen} aria-label="Search sky" className="micro-label text-moon/45 transition hover:text-starlight focus-visible:outline-2 focus-visible:outline-accent-ember">
            Explore
          </button>
          <button type="button" onClick={onToggleAbout} className="micro-label text-moon/45 transition hover:text-starlight focus-visible:outline-2 focus-visible:outline-accent-ember">
            About
          </button>
        </div>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ShareLinkBadge target={activeTarget} />
          <div className="relative">
            <button
              type="button"
              onClick={() => setTargetMenuOpen(open => !open)}
              aria-expanded={targetMenuOpen}
              aria-label={`Choose target: ${activeTarget.display_name}`}
              className="flex h-10 min-w-44 items-center justify-between gap-3 rounded-full border border-starlight/15 bg-black/20 px-4 text-xs text-starlight backdrop-blur-md transition hover:border-starlight/30 focus-visible:outline-2 focus-visible:outline-accent-ember"
            >
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-accent-ember shadow-[0_0_10px_rgba(255,176,32,.75)]" />
                {activeTarget.display_name}
              </span>
              <svg viewBox="0 0 20 20" className={`size-3.5 text-moon/45 transition ${targetMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true"><path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>

            {targetMenuOpen && (
              <div className="glass-panel absolute right-0 top-13 w-64 rounded-2xl p-2">
                <p className="micro-label px-3 pb-2 pt-2 text-moon/35">Curated objects</p>
                {curatedTargets.map((target, index) => (
                  <button
                    key={target.target_id}
                    type="button"
                    onClick={() => { onTargetSelected(target); setTargetMenuOpen(false) }}
                    aria-pressed={target.target_id === activeTarget.target_id}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${target.target_id === activeTarget.target_id ? 'bg-starlight/[.07] text-starlight' : 'text-moon/55 hover:bg-starlight/[.045] hover:text-starlight'}`}
                  >
                    <span className="text-[9px] tabular-nums text-moon/25">0{index + 1}</span>
                    <span className="display-font text-base">{target.display_name}</span>
                    <span className="ml-auto size-1.5 rounded-full border border-moon/25 group-hover:bg-accent-ember" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="button" onClick={() => setMobileMenuOpen(open => !open)} aria-expanded={mobileMenuOpen} className="ml-auto grid size-10 place-items-center rounded-full border border-starlight/15 bg-black/20 text-moon/70 backdrop-blur-md md:hidden">
          <span className="sr-only">Menu</span>
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M4 7h12M4 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>
      </div>

      {linkNotFound && (
        <p role="status" className="pointer-events-auto mx-auto mt-3 w-fit rounded-full border border-accent-ember/20 bg-space-950/70 px-4 py-2 text-[10px] text-accent-ember backdrop-blur-md">
          Not in the local demo set yet — showing a curated target instead.
        </p>
      )}

      {mobileMenuOpen && (
        <div className="pointer-events-auto absolute right-4 top-22 w-64 rounded-2xl border border-starlight/10 bg-space-950/90 p-2 backdrop-blur-xl md:hidden">
          {curatedTargets.map(target => (
            <button key={target.target_id} type="button" onClick={() => { onTargetSelected(target); setMobileMenuOpen(false) }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-moon/65 hover:bg-starlight/[.05] hover:text-starlight">
              {target.display_name}
            </button>
          ))}
          <div className="my-1 h-px bg-starlight/10" />
          <button type="button" onClick={() => { setSearchOpen(true); setMobileMenuOpen(false) }} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-moon/65">Explore</button>
          <button type="button" onClick={onReplayIntro} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-moon/65">Replay intro</button>
          <button type="button" onClick={onToggleAbout} className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-moon/65">About</button>
        </div>
      )}

      {searchOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-space-950/90 p-4 backdrop-blur-xl">
          <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-5 top-5 grid size-11 place-items-center rounded-full border border-starlight/15 text-moon/60 hover:text-starlight" aria-label="Close search">
            <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          <div className="w-full max-w-5xl">
            <CoordinateSearch onTargetSelected={target => { onTargetSelected(target); setSearchOpen(false) }} />
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
