import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AppShell from './AppShell'
import { getTargetById } from '../lib/api'

const EROS = getTargetById('433-eros-2025-06')!
const BARNARD = getTargetById('barnards-star-2025-2026')!
const RW_AUR = getTargetById('rw-aurigae-2025-2026')!

describe('AppShell', () => {
  it('renders as a fixed, non-scrolling viewport (no page-level overflow class on the root)', () => {
    const { container } = render(
      <AppShell target={BARNARD} curatedTargets={[EROS, BARNARD, RW_AUR]} onTargetSelected={vi.fn()} onReplayIntro={vi.fn()} linkNotFound={false} />,
    )
    expect(container.firstChild).toHaveClass('h-dvh')
  })

  it('shows the always-visible honesty badge near the workspace', () => {
    render(
      <AppShell target={BARNARD} curatedTargets={[EROS, BARNARD, RW_AUR]} onTargetSelected={vi.fn()} onReplayIntro={vi.fn()} linkNotFound={false} />,
    )
    // SkyFrame already discloses its own per-frame "Placeholder visual" text,
    // so this targets the shell's persistent badge specifically rather than
    // the ambiguous bare word, which would otherwise match both.
    expect(screen.getByTestId('honesty-badge')).toHaveTextContent(/placeholder/i)
  })

  it('toggles the About panel via the NavBar control', () => {
    render(
      <AppShell target={BARNARD} curatedTargets={[EROS, BARNARD, RW_AUR]} onTargetSelected={vi.fn()} onReplayIntro={vi.fn()} linkNotFound={false} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /about/i }))
    expect(screen.getByText(/note on what you're seeing/i)).toBeInTheDocument()
  })

  it('renders the active target in the workspace (sequence viewer + provenance panel)', () => {
    render(
      <AppShell target={EROS} curatedTargets={[EROS, BARNARD, RW_AUR]} onTargetSelected={vi.fn()} onReplayIntro={vi.fn()} linkNotFound={false} />,
    )
    expect(screen.getByText(EROS.observations[EROS.observations.length - 1].doi)).toBeInTheDocument()
  })
})
