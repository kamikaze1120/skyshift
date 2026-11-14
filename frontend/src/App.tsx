import { useEffect, useState } from 'react'
import StarfieldBackdrop from './components/StarfieldBackdrop'
import SequenceViewer from './components/SequenceViewer'
import CoordinateSearch from './components/CoordinateSearch'
import ShareLinkBadge from './components/ShareLinkBadge'
import HeroSection from './components/HeroSection'
import AboutSection from './components/AboutSection'
import { findTargetByCoordinates, getTargetById } from './lib/api'
import { parseTargetParams, buildTargetParams } from './lib/urlParams'
import type { TargetRecord } from './fixtures/types'

const BARNARD = getTargetById('barnards-star-2025-2026')!
const EROS = getTargetById('433-eros-2025-06')!

interface AppState {
  target: TargetRecord
  autoplayNarration: string | null
  linkNotFound: boolean
}

function stateFromLocation(): AppState {
  const parsed = parseTargetParams(window.location.search)
  if (parsed) {
    const match = findTargetByCoordinates(parsed.ra, parsed.dec)
    if (match) return { target: match, autoplayNarration: null, linkNotFound: false }
    // A syntactically-valid deep link that matches nothing in the local
    // demo set is not the same as "no link was given" — silently falling
    // back to Barnard's autoplay would hide that the link didn't resolve.
    return { target: BARNARD, autoplayNarration: null, linkNotFound: true }
  }
  return { target: BARNARD, autoplayNarration: BARNARD.story_note, linkNotFound: false }
}

function App() {
  const [{ target, autoplayNarration, linkNotFound }, setState] = useState(stateFromLocation)

  useEffect(() => {
    function handlePopState() {
      setState(stateFromLocation())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function handleTargetSelected(newTarget: TargetRecord) {
    setState({ target: newTarget, autoplayNarration: null, linkNotFound: false })
    window.history.pushState({}, '', buildTargetParams(newTarget))
  }

  return (
    <div className="relative mx-auto min-h-screen max-w-3xl px-4 py-8 text-starlight">
      <a
        href="#viewer"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-accent-ember focus:px-3 focus:py-2 focus:text-space-950"
      >
        Skip to the sky viewer
      </a>
      <StarfieldBackdrop />
      <h1 className="mb-6 text-2xl font-semibold">Skyshift</h1>
      <HeroSection erosTarget={EROS} onWatchEros={handleTargetSelected} />
      {linkNotFound && (
        <p role="status" className="mb-4 text-accent-ember">
          Not in the local demo set yet — here are the curated targets you can explore instead.
        </p>
      )}
      <div id="viewer">
        <SequenceViewer target={target} autoplayNarration={autoplayNarration} />
      </div>
      <div className="mt-6">
        <CoordinateSearch onTargetSelected={handleTargetSelected} />
      </div>
      <div className="mt-4">
        <ShareLinkBadge target={target} />
      </div>
      <AboutSection />
    </div>
  )
}

export default App
