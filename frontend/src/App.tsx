import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import IntroSequence from './components/IntroSequence'
import { findTargetByCoordinates, getTargetById } from './lib/api'
import { parseTargetParams, buildTargetParams } from './lib/urlParams'
import type { TargetRecord } from './fixtures/types'

const BARNARD = getTargetById('barnards-star-2025-2026')!
const EROS = getTargetById('433-eros-2025-06')!
const RW_AURIGAE = getTargetById('rw-aurigae-2025-2026')!
const CURATED_TARGETS = [EROS, BARNARD, RW_AURIGAE]

export const INTRO_SESSION_KEY = 'skyshift:introPlayed'

interface AppState {
  target: TargetRecord
  linkNotFound: boolean
}

function stateFromLocation(): AppState {
  const parsed = parseTargetParams(window.location.search)
  if (parsed) {
    const match = findTargetByCoordinates(parsed.ra, parsed.dec)
    if (match) return { target: match, linkNotFound: false }
    // A syntactically-valid deep link that matches nothing in the local
    // demo set is not the same as "no link was given" — silently falling
    // back to Barnard's autoplay would hide that the link didn't resolve.
    return { target: BARNARD, linkNotFound: true }
  }
  return { target: BARNARD, linkNotFound: false }
}

function App() {
  const [{ target, linkNotFound }, setState] = useState(stateFromLocation)
  const [introDone, setIntroDone] = useState(() => Boolean(sessionStorage.getItem(INTRO_SESSION_KEY)))
  // A deep link is present whether or not it parses to something in range —
  // a malformed one (e.g. ?ra=not-a-number) still represents an attempted
  // link, not "no link was given", so it skips the intro the same way
  // stateFromLocation already treats it the same as an unmatched one.
  const [isDeepLink] = useState(() => parseTargetParams(window.location.search) !== null)

  function handleIntroComplete() {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    setIntroDone(true)
  }

  useEffect(() => {
    function handlePopState() {
      setState(stateFromLocation())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function handleTargetSelected(newTarget: TargetRecord) {
    setState({ target: newTarget, linkNotFound: false })
    window.history.pushState({}, '', buildTargetParams(newTarget))
  }

  return (
    <>
      {!introDone && !isDeepLink && <IntroSequence onComplete={handleIntroComplete} />}
      <a
        href="#viewer"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-accent-ember focus:px-3 focus:py-2 focus:text-space-950"
      >
        Skip to the sky viewer
      </a>
      <AppShell
        target={target}
        curatedTargets={CURATED_TARGETS}
        onTargetSelected={handleTargetSelected}
        onReplayIntro={() => {
          sessionStorage.removeItem(INTRO_SESSION_KEY)
          setIntroDone(false)
        }}
        linkNotFound={linkNotFound}
      />
    </>
  )
}

export default App
