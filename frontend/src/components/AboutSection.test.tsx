import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AboutSection from './AboutSection'

describe('AboutSection', () => {
  it('explains that cutout images are placeholders, not generated pixels', () => {
    render(<AboutSection />)
    expect(screen.getByText(/placeholder/i)).toBeInTheDocument()
    expect(screen.getByText(/SPHEREx maps the entire sky/)).toBeInTheDocument()
  })

  it('cites the required SPHEREx acknowledgement text verbatim, with the DOI for the release this app actually serves', () => {
    render(<AboutSection />)
    expect(
      screen.getByText(
        /This publication makes use of data products from the Spectro-Photometer for the History of the/,
      ),
    ).toBeInTheDocument()
    expect(screen.getByText(/10\.26131\/IRSA652/)).toBeInTheDocument()
  })

  it('discloses that AI tools were used to build this project, with a guarantee that no sky data is AI-generated', () => {
    render(<AboutSection />)
    expect(screen.getByText(/No sky\/astronomy data is ever AI-generated or fabricated/i)).toBeInTheDocument()
  })

  it('states that no accounts or personal data are collected', () => {
    render(<AboutSection />)
    expect(screen.getByText(/no accounts.*no personal data/i)).toBeInTheDocument()
  })
})
