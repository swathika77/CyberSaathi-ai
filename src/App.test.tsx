import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('CyberSaathi app', () => {
  it('renders the landing page hero headline', () => {
    render(<App />)

    expect(
      screen.getByText('Build Safer Digital Habits Through Interactive Learning'),
    ).toBeInTheDocument()
  })
})
