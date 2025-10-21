import SubmitButton from '@/components/SubmitButton'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('SubmitButton', () => {
  test('renders children when not loading', () => {
    render(<SubmitButton>Submit Form</SubmitButton>)

    expect(screen.getByText('Submit Form')).toBeInTheDocument()
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  test('shows loading state when isLoading is true', () => {
    render(<SubmitButton isLoading={true}>Submit Form</SubmitButton>)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.queryByText('Submit Form')).not.toBeInTheDocument()
  })

  test('applies default className when none provided', () => {
    render(<SubmitButton>Submit</SubmitButton>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('shad-primary-btn', 'w-full')
  })

  test('applies custom className when provided', () => {
    render(<SubmitButton className="custom-class">Submit</SubmitButton>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
    expect(button).not.toHaveClass('shad-primary-btn')
  })

  test('has correct button type', () => {
    render(<SubmitButton>Submit</SubmitButton>)

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  test('shows loader icon when loading', () => {
    render(<SubmitButton isLoading={true}>Submit</SubmitButton>)

    const loaderImage = screen.getByAltText('loader')
    expect(loaderImage).toBeInTheDocument()
    expect(loaderImage).toHaveAttribute('src', '/assets/icons/loader.svg')
    expect(loaderImage).toHaveClass('animate-spin')
  })

  test('button is disabled only when loading', () => {
    const { rerender } = render(<SubmitButton isLoading={false}>Submit</SubmitButton>)
    expect(screen.getByRole('button')).not.toBeDisabled()

    rerender(<SubmitButton isLoading={true}>Submit</SubmitButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  test('handles no children gracefully', () => {
    render(<SubmitButton />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('')
  })

  test('handles complex children elements', () => {
    render(
      <SubmitButton>
        <span>Complex</span> <strong>Children</strong>
      </SubmitButton>
    )

    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
  })
})
