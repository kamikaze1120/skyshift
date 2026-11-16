import { useEffect, useState } from 'react'
import AppShell from './components/AppShell'
import IntroSequence from './components/IntroSequence'
import TargetSelectionScreen from './components/TargetSelectionScreen'
import { findTargetByCoordinates, getTargetById } from './lib/api'
import { parseTargetParams, buildTargetParams } from './lib/urlParams'
import type { TargetRecord } from './fixtures/types'

const BARNARD = getTargetById('barnards-star-2025-2026')!
const EROS = getTargetById('433-eros-2025-06')!
const RW_AURIGAE = getTargetById('rw-aurigae-2025-2026')!
const CURATED_TARGETS = [EROS, BARNARD, RW_AURIGAE]

// The five objects NASA named for this challenge — presented on the
// selection screen the user picks from after the intro, in the same order
// the challenge statement lists them.
const OFFICIAL_TARGETS = [
  BARNARD,
  RW_AURIGAE,
  getTargetById('r-draconis-2025-2026')!,
  getTargetById('wise-0855-2025-2026')!,
  getTargetById('epsilon-indi-b-2025-2026')!,
]

export const INTRO_SESSION_KEY = 'skyshift:introPlayed'

interface AppState {
  target: TargetRecord
  linkNotFound: boolean
}

function stateFromLocation(): AppState {
  const parsed = parseTargetParams(window.location.search)
  if (parsed) {
    const match = findTargetByCoordinates(parsed.ra, parsed.dec)
    if (match) {
      // size seeds the FOV slider — honor a link's explicit value instead
      // of silently falling back to the fixture's own default.
      const target = parsed.size !== undefined ? { ...match, size_deg: parsed.size } : match
      return { target, linkNotFound: false }
    }
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

type EntryStep = 'intro' | 'selecting' | 'done'

// A deep link bypasses both the intro and the selection screen on load (it
// already names a specific target), but "Replay intro" must still work
// afterwards — so the bypass is folded into the initial step instead of
// gating the render separately, which would otherwise leave "Replay intro"
// a dead control for anyone who arrived via a link.
function initialStep(): EntryStep {
  return isDeepLinkRequest() || readIntroPlayed() ? 'done' : 'intro'
}

function App() {
  const [{ target, linkNotFound }, setState] = useState(stateFromLocation)
  const [step, setStep] = useState<EntryStep>(initialStep)

  function handleIntroComplete() {
    setStep('selecting')
  }

  function handleOpenTargetSelection() {
    setStep('selecting')
  }

  function handleDismissTargetSelection() {
    setStep('done')
  }

  function handleTargetChosen(chosenTarget: TargetRecord) {
    writeIntroPlayed()
    setState({ target: chosenTarget, linkNotFound: false })
    window.history.pushState({}, '', buildTargetParams(chosenTarget))
    setStep('done')
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
      {step === 'intro' && <IntroSequence onComplete={handleIntroComplete} />}
      {step === 'selecting' && (
        <TargetSelectionScreen
          targets={OFFICIAL_TARGETS}
          onTargetChosen={handleTargetChosen}
          onDismiss={handleDismissTargetSelection}
        />
      )}
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
          clearIntroPlayed()
          setStep('intro')
        }}
        onOpenTargetSelection={handleOpenTargetSelection}
        linkNotFound={linkNotFound}
      />
    </>
  )
}

export default App
