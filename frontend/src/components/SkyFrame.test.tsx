import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SkyFrame from './SkyFrame'

const obs = { epoch: '2025-06-25T00:12:09Z', wavelength_band: 'D1', image_url: 'fixture-placeholder://x', source_file: 'f', doi: 'd' }

describe('SkyFrame', () => {
  it('renders a placeholder-disclosure accessible text for a fixture-placeholder image_url', () => {
    render(<SkyFrame observation={obs} index={0} reducedMotion={false} showsMotion={true} />)
    expect(screen.getByText(/placeholder/i)).toBeInTheDocument()
  })
  it('renders visibly differently for different index values', () => {
    const { container: c0 } = render(<SkyFrame observation={obs} index={0} reducedMotion={false} showsMotion={true} />)
    const { container: c1 } = render(<SkyFrame observation={obs} index={1} reducedMotion={false} showsMotion={true} />)
    expect(c0.innerHTML).not.toBe(c1.innerHTML)
  })
  it('does not fabricate marker motion when showsMotion is false, even across different indices', () => {
    const { container: c0 } = render(<SkyFrame observation={obs} index={0} reducedMotion={false} showsMotion={false} />)
    const { container: c1 } = render(<SkyFrame observation={obs} index={1} reducedMotion={false} showsMotion={false} />)
    const marker0 = c0.querySelector('[data-marker]') as HTMLElement
    const marker1 = c1.querySelector('[data-marker]') as HTMLElement
    expect(marker0.style.top).toBe(marker1.style.top)
    expect(marker0.style.left).toBe(marker1.style.left)
  })
})
