import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'
import targets from './fixtures/targets.json'
import type { TargetRecord } from './fixtures/types'

vi.mock('./components/SkyScanBackdrop3D', () => ({ default: () => <div data-testid="sky-scan-backdrop-mock" /> }))

const eros = (targets as TargetRecord[])[0]
const INTRO_SESSION_KEY = 'skyshift:introPlayed'

describe('App', () => {
  it('shows the intro on a fresh session with no deep link, then a target-selection screen, then reveals the app once a target is chosen', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('button', { name: /enter research bay/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /enter research bay/i }))

    // Lands on the selection screen first, not straight into the viewer.
    expect(screen.getByRole('heading', { name: /choose your target/i })).toBeInTheDocument()
    const barnardCard = screen.getByRole('listitem', { name: /barnard/i })
    fireEvent.click(barnardCard)
    fireEvent.click(screen.getByRole('button', { name: /begin research/i }))

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
  })

  it('skips the intro entirely on a deep link, even one that matches no fixture', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', '/?ra=100&dec=50&size=0.2')
    render(<App />)
    expect(screen.queryByRole('button', { name: /enter research bay/i })).not.toBeInTheDocument()
  })

  it('does not replay the intro on remount within the same session', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.queryByRole('button', { name: /enter research bay/i })).not.toBeInTheDocument()
  })

  it("with a deep-link matching a fixture, skips straight to that target's SourcePanel", () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    render(<App />)
    expect(screen.getByText(eros.observations[eros.observations.length - 1].doi)).toBeInTheDocument()
  })

  it("a deep-link's size param overrides the fixture's default field of view, instead of being silently dropped", () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=0.45`)
    render(<App />)
    expect(screen.getAllByText('0.45°').length).toBeGreaterThan(0)
  })

  it('with a malformed deep-link, falls back to Barnard\'s Star instead of crashing', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/?ra=not-a-number&dec=200')
    render(<App />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
  })

  it('with a syntactically-valid deep-link that matches no fixture, shows an honest not-in-demo-set status', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/?ra=100&dec=50&size=0.2')
    render(<App />)
    expect(screen.getByRole('status')).toHaveTextContent(/not.*(local|demo).*set/i)
  })

  it('offers a skip link to the sky viewer for keyboard users', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    const link = screen.getByRole('link', { name: /skip to.*(sky viewer|viewer)/i })
    expect(link).toHaveAttribute('href', '#viewer')
    expect(document.getElementById('viewer')).toBeInTheDocument()
  })

  it('shows the about section via the NavBar About control', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /about/i }))
    expect(screen.getByText(/note on what you're seeing/i)).toBeInTheDocument()
  })

  it('responds to browser Back/Forward via popstate, not just the URL present at mount', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')

    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    fireEvent(window, new PopStateEvent('popstate'))
    expect(screen.getByText(eros.observations[eros.observations.length - 1].doi)).toBeInTheDocument()
  })

  it('replaying the intro via the NavBar control clears the session gate and shows it again', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.queryByRole('button', { name: /enter research bay/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /replay intro/i }))
    expect(screen.getByRole('button', { name: /enter research bay/i })).toBeInTheDocument()
  })

  it('lets the user return to the target selection screen from the research bay without replaying the intro', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('slider')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^targets$/i }))

    expect(screen.getByRole('heading', { name: /choose your target/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /enter research bay/i })).not.toBeInTheDocument()
  })

  it('lets the user back out of the target selection screen without choosing, returning to the research bay', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /^targets$/i }))
    expect(screen.getByRole('heading', { name: /choose your target/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /back to research bay/i }))

    expect(screen.queryByRole('heading', { name: /choose your target/i })).not.toBeInTheDocument()
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })

  it('replaying the intro works even when the current session started from a deep link', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    render(<App />)
    expect(screen.queryByRole('button', { name: /enter research bay/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /replay intro/i }))
    expect(screen.getByRole('button', { name: /enter research bay/i })).toBeInTheDocument()
  })

  it('treats a malformed deep-link the same as no deep link at all, so the intro still plays once', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', '/?ra=not-a-number&dec=200')
    render(<App />)
    expect(screen.getByRole('button', { name: /enter research bay/i })).toBeInTheDocument()
  })

  it('still renders the shell even when sessionStorage access throws (e.g. a locked-down browser)', () => {
    const originalGetItem = Storage.prototype.getItem
    Storage.prototype.getItem = () => {
      throw new DOMException('blocked', 'SecurityError')
    }
    // No deep link, so the mount-time check actually has to read storage
    // (a deep link would short-circuit past that read entirely).
    window.history.pushState({}, '', '/')
    try {
      render(<App />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    } finally {
      Storage.prototype.getItem = originalGetItem
    }
  })
})
