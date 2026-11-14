import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeroSection from './HeroSection'
import targets from '../fixtures/targets.json'
import type { TargetRecord } from '../fixtures/types'

const eros = (targets as TargetRecord[]).find(t => t.target_id === '433-eros-2025-06')!

describe('HeroSection', () => {
  it("shows Eros's real measured motion, not a made-up number", () => {
    render(<HeroSection erosTarget={eros} onWatchEros={() => {}} />)
    expect(screen.getAllByText(/604/).length).toBeGreaterThan(0)
  })
  it('discloses that no real sky pixels are shown yet', () => {
    render(<HeroSection erosTarget={eros} onWatchEros={() => {}} />)
    expect(screen.getByText(/never fabricates|no real.*(pixel|image)/i)).toBeInTheDocument()
  })
  it('clicking the CTA selects the real Eros fixture, not a placeholder', () => {
    const onWatchEros = vi.fn()
    render(<HeroSection erosTarget={eros} onWatchEros={onWatchEros} />)
    fireEvent.click(screen.getByRole('button', { name: /watch.*eros/i }))
    expect(onWatchEros).toHaveBeenCalledWith(eros)
  })
})
