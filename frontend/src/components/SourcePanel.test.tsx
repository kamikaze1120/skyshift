import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SourcePanel from './SourcePanel'

const obs = { epoch: '2025-06-25T00:12:09Z', wavelength_band: 'D1', image_url: 'fixture-placeholder://x', source_file: 'some/file.fits', doi: '10.26131/IRSA652' }

describe('SourcePanel', () => {
  it('shows the source file and DOI for traceability', () => {
    render(<SourcePanel observation={obs} verified={true} />)
    expect(screen.getByText(/some\/file\.fits/)).toBeInTheDocument()
    expect(screen.getByText(/10\.26131\/IRSA652/)).toBeInTheDocument()
  })
  it('renders the DOI as a real clickable link to doi.org, opening in a new tab', () => {
    render(<SourcePanel observation={obs} verified={true} />)
    const link = screen.getByRole('link', { name: /10\.26131\/IRSA652/ })
    expect(link).toHaveAttribute('href', 'https://doi.org/10.26131/IRSA652')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })
  it('shows a generic not-yet-confirmed note when verified is false and no storyNote is given', () => {
    render(<SourcePanel observation={obs} verified={false} storyNote={null} />)
    expect(screen.getByText(/not.*confirmed|needs.*re-check|unconfirmed/i)).toBeInTheDocument()
  })
  it('shows the fixture\'s own honest story note instead of the generic message when one is given', () => {
    const honestNote = 'SPHEREx has excellent coverage here, but no source is visible at this position — an honest miss.'
    render(<SourcePanel observation={obs} verified={false} storyNote={honestNote} />)
    expect(screen.getByText(honestNote)).toBeInTheDocument()
    expect(screen.queryByText(/needs a re-check before it's treated as a success/i)).not.toBeInTheDocument()
  })
  it('shows the real release label resolved from the DOI, not a guessed suffix match', () => {
    render(<SourcePanel observation={obs} verified={true} />)
    expect(screen.getByText('Quick Release 2')).toBeInTheDocument()
  })
  it('shows an honest "unlisted release" label when the DOI matches no known release', () => {
    const unlistedObs = { ...obs, doi: '10.26131/IRSA999' }
    render(<SourcePanel observation={unlistedObs} verified={true} />)
    expect(screen.getByText(/unlisted release/i)).toBeInTheDocument()
  })
})
