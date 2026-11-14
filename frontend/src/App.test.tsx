import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import targets from './fixtures/targets.json'
import type { TargetRecord } from './fixtures/types'

const eros = (targets as TargetRecord[])[0]
const INTRO_SESSION_KEY = 'skyshift:introPlayed'

describe('App', () => {
  it('shows the intro on a fresh session with no deep link, then reveals the app on completion', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('button', { name: /skip intro/i })).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
  })

  it('skips the intro entirely on a deep link, even one that matches no fixture', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', '/?ra=100&dec=50&size=0.2')
    render(<App />)
    expect(screen.queryByRole('button', { name: /skip intro/i })).not.toBeInTheDocument()
  })

  it('does not replay the intro on remount within the same session', () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.queryByRole('button', { name: /skip intro/i })).not.toBeInTheDocument()
  })

  it("with a deep-link matching a fixture, skips straight to that target's SourcePanel", () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    render(<App />)
    expect(screen.getByText(eros.observations[eros.observations.length - 1].doi)).toBeInTheDocument()
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
    expect(screen.queryByRole('button', { name: /skip intro/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /replay intro/i }))
    expect(screen.getByRole('button', { name: /skip intro/i })).toBeInTheDocument()
  })

  it('replaying the intro works even when the current session started from a deep link', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    render(<App />)
    expect(screen.queryByRole('button', { name: /skip intro/i })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /replay intro/i }))
    expect(screen.getByRole('button', { name: /skip intro/i })).toBeInTheDocument()
  })

  it('treats a malformed deep-link the same as no deep link at all, so the intro still plays once', () => {
    sessionStorage.clear()
    window.history.pushState({}, '', '/?ra=not-a-number&dec=200')
    render(<App />)
    expect(screen.getByRole('button', { name: /skip intro/i })).toBeInTheDocument()
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
