import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'
import targets from './fixtures/targets.json'
import type { TargetRecord } from './fixtures/types'

const eros = (targets as TargetRecord[])[0]

describe('App', () => {
  it("with no URL params, loads Barnard's Star paused at the first frame", () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
  })

  it("with a deep-link matching a fixture, skips straight to that target's SourcePanel, no narration", () => {
    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    render(<App />)
    expect(screen.getByText(eros.observations[eros.observations.length - 1].doi)).toBeInTheDocument()
  })

  it('with a malformed deep-link, falls back to Barnard\'s Star instead of crashing', () => {
    window.history.pushState({}, '', '/?ra=not-a-number&dec=200')
    render(<App />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')
  })

  it('with a syntactically-valid deep-link that matches no fixture, shows an honest not-in-demo-set message', () => {
    window.history.pushState({}, '', '/?ra=100&dec=50&size=0.2')
    render(<App />)
    expect(screen.getByText(/not.*(local|demo).*set/i)).toBeInTheDocument()
  })

  it('offers a skip link to the sky viewer for keyboard users', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    const link = screen.getByRole('link', { name: /skip to.*(sky viewer|viewer)/i })
    expect(link).toHaveAttribute('href', '#viewer')
    expect(document.getElementById('viewer')).toBeInTheDocument()
  })

  it('shows the about section', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByText(/note on what you're seeing/i)).toBeInTheDocument()
  })

  it('responds to browser Back/Forward via popstate, not just the URL present at mount', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0')

    window.history.pushState({}, '', `/?ra=${eros.coordinates.ra_deg}&dec=${eros.coordinates.dec_deg}&size=${eros.size_deg}`)
    fireEvent(window, new PopStateEvent('popstate'))
    expect(screen.getByText(eros.observations[eros.observations.length - 1].doi)).toBeInTheDocument()
  })
})
