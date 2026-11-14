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

// A deep link is present only when ra/dec parse to something in range; a
// malformed query (e.g. ?ra=not-a-number) is treated the same as "no link
// was given" and still gets the intro once per session — this matches
// stateFromLocation's own fallback branch for malformed input above.
function isDeepLinkRequest(): boolean {
  return parseTargetParams(window.location.search) !== null
}

// sessionStorage can throw (blocked site data, a sandboxed iframe) — that
// should degrade to "play the intro" or "replay silently did nothing",
// never crash the whole app.
function readIntroPlayed(): boolean {
  try {
    return Boolean(sessionStorage.getItem(INTRO_SESSION_KEY))
  } catch {
    return false
  }
}

function writeIntroPlayed() {
  try {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
  } catch {
    // see readIntroPlayed
  }
}

function clearIntroPlayed() {
  try {
    sessionStorage.removeItem(INTRO_SESSION_KEY)
  } catch {
    // see readIntroPlayed
  }
}

function App() {
  const [{ target, linkNotFound }, setState] = useState(stateFromLocation)
  // A deep link bypasses the intro on load, but "Replay intro" must still
  // work afterwards — so the bypass is folded into introDone's initial
  // value instead of gating the render separately, which would otherwise
  // leave "Replay intro" a dead control for anyone who arrived via a link.
  const [introDone, setIntroDone] = useState(() => isDeepLinkRequest() || readIntroPlayed())

  function handleIntroComplete() {
    writeIntroPlayed()
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
      {!introDone && <IntroSequence onComplete={handleIntroComplete} />}
      <a
        href="#viewer"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-accent-amber focus:px-3 focus:py-2 focus:text-space-950"
      >
        Skip to the sky viewer
      </a>
      <AppShell
        target={target}
        curatedTargets={CURATED_TARGETS}
        onTargetSelected={handleTargetSelected}
        onReplayIntro={() => {
          clearIntroPlayed()
          setIntroDone(false)
        }}
        linkNotFound={linkNotFound}
      />
    </>
  )
}

export default App
