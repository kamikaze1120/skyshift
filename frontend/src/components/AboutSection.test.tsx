import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AboutSection from './AboutSection'

describe('AboutSection', () => {
  it('explains that cutout images are placeholders, not generated pixels', () => {
    render(<AboutSection />)
    expect(screen.getByText(/placeholder/i)).toBeInTheDocument()
    expect(screen.getByText(/SPHEREx/)).toBeInTheDocument()
  })
})
