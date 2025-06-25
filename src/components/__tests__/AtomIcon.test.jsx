import { render, screen } from '@testing-library/react'
import AtomIcon from '../AtomIcon'

describe('AtomIcon Component', () => {
  test('should render atom icon with default props', () => {
    render(<AtomIcon />)
    
    const atomIcon = screen.getByTestId('atom-icon')
    expect(atomIcon).toBeInTheDocument()
    expect(atomIcon).toHaveClass('w-8', 'h-8')
  })

  test('should render with custom size', () => {
    render(<AtomIcon size="w-12 h-12" />)
    
    const atomIcon = screen.getByTestId('atom-icon')
    expect(atomIcon).toHaveClass('w-12', 'h-12')
    expect(atomIcon).not.toHaveClass('w-8', 'h-8')
  })

  test('should render with custom color', () => {
    render(<AtomIcon color="text-blue-500" />)
    
    const atomIcon = screen.getByTestId('atom-icon')
    expect(atomIcon).toHaveClass('text-blue-500')
  })

  test('should render with custom className', () => {
    render(<AtomIcon className="custom-class" />)
    
    const atomIcon = screen.getByTestId('atom-icon')
    expect(atomIcon).toHaveClass('custom-class')
  })

  test('should render with animation classes', () => {
    render(<AtomIcon />)
    
    const atomIcon = screen.getByTestId('atom-icon')
    expect(atomIcon).toHaveClass('animate-spin')
  })

  test('should combine all props correctly', () => {
    render(
      <AtomIcon 
        size="w-16 h-16" 
        color="text-green-500" 
        className="my-custom-class"
      />
    )
    
    const atomIcon = screen.getByTestId('atom-icon')
    expect(atomIcon).toHaveClass('w-16', 'h-16', 'text-green-500', 'my-custom-class', 'animate-spin')
  })
}) 