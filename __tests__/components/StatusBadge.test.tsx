import StatusBadge from '@/components/StatusBadge'
import { render, screen } from '@testing-library/react'

describe('StatusBadge', () => {
  test('renders scheduled status correctly', () => {
    render(<StatusBadge status="scheduled" />)

    expect(screen.getByText('scheduled')).toBeInTheDocument()
    expect(screen.getByAltText('scheduled')).toBeInTheDocument()

    const statusText = screen.getByText('scheduled')
    expect(statusText).toHaveClass('text-green-500')

    const badge = statusText.closest('div')
    expect(badge).toHaveClass('bg-green-600')
  })

  test('renders pending status correctly', () => {
    render(<StatusBadge status="pending" />)

    expect(screen.getByText('pending')).toBeInTheDocument()
    expect(screen.getByAltText('pending')).toBeInTheDocument()

    const statusText = screen.getByText('pending')
    expect(statusText).toHaveClass('text-blue-500')

    const badge = statusText.closest('div')
    expect(badge).toHaveClass('bg-blue-600')
  })

  test('renders cancelled status correctly', () => {
    render(<StatusBadge status="cancelled" />)

    expect(screen.getByText('cancelled')).toBeInTheDocument()
    expect(screen.getByAltText('cancelled')).toBeInTheDocument()

    const statusText = screen.getByText('cancelled')
    expect(statusText).toHaveClass('text-red-500')

    const badge = statusText.closest('div')
    expect(badge).toHaveClass('bg-red-600')
  })

  test('displays correct icon for each status', () => {
    const { rerender } = render(<StatusBadge status="scheduled" />)
    let icon = screen.getByAltText('scheduled')
    expect(icon).toHaveAttribute('src', '/assets/icons/check.svg')

    rerender(<StatusBadge status="pending" />)
    icon = screen.getByAltText('pending')
    expect(icon).toHaveAttribute('src', '/assets/icons/pending.svg')

    rerender(<StatusBadge status="cancelled" />)
    icon = screen.getByAltText('cancelled')
    expect(icon).toHaveAttribute('src', '/assets/icons/cancelled.svg')
  })

  test('applies consistent base classes', () => {
    render(<StatusBadge status="scheduled" />)

    const badge = screen.getByText('scheduled').closest('div')
    expect(badge).toHaveClass('status-badge')

    const statusText = screen.getByText('scheduled')
    expect(statusText).toHaveClass('text-12-semibold', 'capitalize')
  })

  test('icon has correct dimensions and classes', () => {
    render(<StatusBadge status="scheduled" />)

    const icon = screen.getByAltText('scheduled')
    expect(icon).toHaveAttribute('width', '24')
    expect(icon).toHaveAttribute('height', '24')
    expect(icon).toHaveClass('h-fit', 'w-3')
  })

  test('status text is capitalized', () => {
    render(<StatusBadge status="scheduled" />)

    const statusText = screen.getByText('scheduled')
    expect(statusText).toHaveClass('capitalize')
  })

  test('badge structure is correct', () => {
    render(<StatusBadge status="pending" />)

    const badge = screen.getByText('pending').closest('div')
    expect(badge).toContainElement(screen.getByAltText('pending'))
    expect(badge).toContainElement(screen.getByText('pending'))
  })
})
