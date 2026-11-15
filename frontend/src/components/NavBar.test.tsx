import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import NavBar from './NavBar'
import { getTargetById } from '../lib/api'

const EROS = getTargetById('433-eros-2025-06')!
const BARNARD = getTargetById('barnards-star-2025-2026')!
const RW_AUR = getTargetById('rw-aurigae-2025-2026')!

describe('NavBar', () => {
  it('keeps curated targets in a compact picker and selects on click', () => {
    const onTargetSelected = vi.fn()
    render(
      <NavBar
        curatedTargets={[EROS, BARNARD, RW_AUR]}
        activeTarget={BARNARD}
        onTargetSelected={onTargetSelected}
        onReplayIntro={vi.fn()}
        onToggleAbout={vi.fn()}
        linkNotFound={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /choose target/i }))
    fireEvent.click(screen.getByRole('button', { name: /433 eros/i }))
    expect(onTargetSelected).toHaveBeenCalledWith(EROS)
  })

  it('opens an expandable search panel containing the full target gallery, not just the 3 curated chips', () => {
    render(
      <NavBar
        curatedTargets={[EROS, BARNARD, RW_AUR]}
        activeTarget={BARNARD}
        onTargetSelected={vi.fn()}
        onReplayIntro={vi.fn()}
        onToggleAbout={vi.fn()}
        linkNotFound={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /search/i }))
    expect(screen.getByRole('button', { name: /r draconis.*unconfirmed/i })).toBeInTheDocument()
  })

  it('shows a not-found status when linkNotFound is true', () => {
    render(
      <NavBar
        curatedTargets={[EROS, BARNARD, RW_AUR]}
        activeTarget={BARNARD}
        onTargetSelected={vi.fn()}
        onReplayIntro={vi.fn()}
        onToggleAbout={vi.fn()}
        linkNotFound={true}
      />,
    )
    expect(screen.getByRole('status')).toHaveTextContent(/not.*(local|demo).*set/i)
  })

  it('shows the official NASA Space Apps Orbit mark in the header', () => {
    render(
      <NavBar
        curatedTargets={[EROS, BARNARD, RW_AUR]}
        activeTarget={BARNARD}
        onTargetSelected={vi.fn()}
        onReplayIntro={vi.fn()}
        onToggleAbout={vi.fn()}
        linkNotFound={false}
      />,
    )
    expect(screen.getByRole('img', { name: /nasa space apps/i })).toBeInTheDocument()
  })

  it('is operable by keyboard: Tab reaches the search toggle and the About toggle', () => {
    render(
      <NavBar
        curatedTargets={[EROS, BARNARD, RW_AUR]}
        activeTarget={BARNARD}
        onTargetSelected={vi.fn()}
        onReplayIntro={vi.fn()}
        onToggleAbout={vi.fn()}
        linkNotFound={false}
      />,
    )
    expect(screen.getByRole('button', { name: /search/i })).not.toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('button', { name: /about/i })).not.toHaveAttribute('tabindex', '-1')
  })
})
