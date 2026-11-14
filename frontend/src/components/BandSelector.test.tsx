import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BandSelector from './BandSelector'

describe('BandSelector', () => {
  it('renders a slider spanning all 102 real SPHEREx bands', () => {
    render(<BandSelector selectedBand={1} onBandChange={vi.fn()} loggedDetector={null} />)
    const slider = screen.getByRole('slider', { name: /band/i })
    expect(slider).toHaveAttribute('aria-valuemin', '1')
    expect(slider).toHaveAttribute('aria-valuemax', '102')
    expect(slider).toHaveAttribute('aria-valuenow', '1')
  })

  it('shows the approximate wavelength for the selected band, labeled as approximate', () => {
    render(<BandSelector selectedBand={1} onBandChange={vi.fn()} loggedDetector={null} />)
    expect(screen.getByText(/0\.75.*approx/i)).toBeInTheDocument()
  })

  it('moving the slider right calls onBandChange with the next band', () => {
    const onBandChange = vi.fn()
    render(<BandSelector selectedBand={10} onBandChange={onBandChange} loggedDetector={null} />)
    fireEvent.keyDown(screen.getByRole('slider', { name: /band/i }), { key: 'ArrowRight' })
    expect(onBandChange).toHaveBeenCalledWith(11)
  })

  it("flags when the selected band matches this observation's real logged detector", () => {
    // Band 1 maps to detector D1 (see spherexBands.getBand).
    render(<BandSelector selectedBand={1} onBandChange={vi.fn()} loggedDetector="D1" />)
    expect(screen.getByText(/logged for this observation/i)).toBeInTheDocument()
  })

  it('is honest when this observation never logged which detector it used', () => {
    render(<BandSelector selectedBand={1} onBandChange={vi.fn()} loggedDetector={null} />)
    expect(screen.getByText(/not logged for this observation/i)).toBeInTheDocument()
  })
})
