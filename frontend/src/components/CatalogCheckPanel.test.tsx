import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CatalogCheckPanel from './CatalogCheckPanel'

describe('CatalogCheckPanel', () => {
  it('shows the real JPL SBDB discovery record for 433 Eros', () => {
    render(<CatalogCheckPanel targetId="433-eros-2025-06" />)
    expect(screen.getByText(/jpl small-body database/i)).toBeInTheDocument()
    expect(screen.getByText(/witt, g\./i)).toBeInTheDocument()
  })

  it('honestly reports that the Gaia DR3 check could not reach the archive, instead of hiding it', () => {
    render(<CatalogCheckPanel targetId="barnards-star-2025-2026" />)
    expect(screen.getByRole('heading', { name: /gaia dr3/i })).toBeInTheDocument()
    expect(screen.getByText(/could not be reached/i)).toBeInTheDocument()
  })

  it('renders nothing for a target with no catalog overlay entry', () => {
    const { container } = render(<CatalogCheckPanel targetId="epsilon-indi-b-2025-2026" />)
    expect(container).toBeEmptyDOMElement()
  })
})
