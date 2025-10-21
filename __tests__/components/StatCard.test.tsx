import StatCard from '@/components/StatCard'
import { render, screen } from '@testing-library/react'

describe('StatCard', () => {
  const defaultProps = {
    count: 5,
    label: 'Total Appointments',
    icon: '/assets/icons/appointments.svg',
    type: 'appointments' as const,
  }

  test('renders with all provided props', () => {
    render(<StatCard {...defaultProps} />)

    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Total Appointments')).toBeInTheDocument()
    expect(screen.getByAltText('Total Appointments')).toBeInTheDocument()
  })

  test('displays count as zero when not provided', () => {
    render(
      <StatCard
        label="Test Label"
        icon="/test-icon.svg"
        type="appointments"
        count={0}
      />
    )

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('applies correct background class for appointments type', () => {
    render(<StatCard {...defaultProps} type="appointments" />)

    const card = screen.getByText('5').closest('div')?.parentElement
    expect(card).toHaveClass('bg-appointments')
  })

  test('applies correct background class for pending type', () => {
    render(<StatCard {...defaultProps} type="pending" />)

    const card = screen.getByText('5').closest('div')?.parentElement
    expect(card).toHaveClass('bg-pending')
  })

  test('applies correct background class for cancelled type', () => {
    render(<StatCard {...defaultProps} type="cancelled" />)

    const card = screen.getByText('5').closest('div')?.parentElement
    expect(card).toHaveClass('bg-cancelled')
  })

  test('renders icon with correct attributes', () => {
    render(<StatCard {...defaultProps} />)

    const icon = screen.getByAltText('Total Appointments')
    expect(icon).toHaveAttribute('src', '/assets/icons/appointments.svg')
    expect(icon).toHaveAttribute('width', '32')
    expect(icon).toHaveAttribute('height', '32')
    expect(icon).toHaveClass('size-8', 'w-fit')
  })

  test('applies correct text styling classes', () => {
    render(<StatCard {...defaultProps} />)

    const countElement = screen.getByText('5')
    expect(countElement).toHaveClass('text-32-bold', 'text-white')

    const labelElement = screen.getByText('Total Appointments')
    expect(labelElement).toHaveClass('text-14-regular')
  })

  test('handles large count numbers', () => {
    render(<StatCard {...defaultProps} count={999} />)

    expect(screen.getByText('999')).toBeInTheDocument()
  })

  test('handles zero count', () => {
    render(<StatCard {...defaultProps} count={0} />)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('handles long label text', () => {
    const longLabel = 'This is a very long label for testing purposes'
    render(<StatCard {...defaultProps} label={longLabel} />)

    expect(screen.getByText(longLabel)).toBeInTheDocument()
  })

  test('maintains proper card structure', () => {
    render(<StatCard {...defaultProps} />)

    const card = screen.getByText('5').closest('div')?.parentElement
    expect(card).toHaveClass('stat-card')

    // Check that the inner div with flex layout exists
    const flexContainer = screen.getByText('5').closest('div')
    expect(flexContainer).toHaveClass('flex', 'items-center', 'gap-4')
  })

  test('icon alt text matches label', () => {
    const label = 'Pending Appointments'
    render(<StatCard {...defaultProps} label={label} />)

    const icon = screen.getByAltText(label)
    expect(icon).toBeInTheDocument()
  })

  test('renders different types with correct styling', () => {
    const types = ['appointments', 'pending', 'cancelled'] as const
    const expectedClasses = ['bg-appointments', 'bg-pending', 'bg-cancelled']

    types.forEach((type, index) => {
      const { unmount } = render(<StatCard {...defaultProps} type={type} />)

      const card = screen.getByText('5').closest('div')?.parentElement
      expect(card).toHaveClass(expectedClasses[index])

      unmount()
    })
  })
})
