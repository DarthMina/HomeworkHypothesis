import { render, screen, fireEvent } from '@testing-library/react'
import EmojiSelector from '../EmojiSelector'

describe('EmojiSelector Component', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  test('should render emoji selector with field options', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    expect(screen.getByText('Physics')).toBeInTheDocument()
    expect(screen.getByText('Chemistry')).toBeInTheDocument()
    expect(screen.getByText('Biology')).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
  })

  test('should call onSelect with full field object when clicked', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const physicsButton = screen.getByText('Physics').closest('button')
    fireEvent.click(physicsButton)
    
    expect(mockOnSelect).toHaveBeenCalledWith({
      name: 'Physics',
      emojis: ['⚛️', '🌌', '⚡', '🔬', '🌊', '💫', '🔄', '⚙️', '🔋', '🌍']
    })
  })

  test('should render all field options with correct names', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const fields = [
      { name: 'Physics' },
      { name: 'Chemistry' },
      { name: 'Biology' },
      { name: 'Mathematics' },
      { name: 'Computer Science' },
      { name: 'Astronomy' },
      { name: 'Medical Science' }
    ]
    
    fields.forEach(field => {
      expect(screen.getByText(field.name)).toBeInTheDocument()
    })
  })

  test('should have correct styling classes', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const container = screen.getByTestId('emoji-selector')
    expect(container).toHaveClass('grid', 'grid-cols-2', 'gap-3', 'p-4')
  })

  test('should render buttons with correct styling', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveClass(
        'flex', 'flex-col', 'items-center', 'p-3', 'rounded-lg',
        'border-2', 'border-transparent', 'hover:border-blue-300',
        'transition-all', 'duration-200', 'hover:scale-105'
      )
    })
  })

  test('should handle multiple selections', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const physicsButton = screen.getByText('Physics').closest('button')
    const chemistryButton = screen.getByText('Chemistry').closest('button')
    
    fireEvent.click(physicsButton)
    fireEvent.click(chemistryButton)
    
    expect(mockOnSelect).toHaveBeenCalledTimes(2)
    expect(mockOnSelect).toHaveBeenNthCalledWith(1, {
      name: 'Physics',
      emojis: ['⚛️', '🌌', '⚡', '🔬', '🌊', '💫', '🔄', '⚙️', '🔋', '🌍']
    })
    expect(mockOnSelect).toHaveBeenNthCalledWith(2, {
      name: 'Chemistry',
      emojis: ['🧪', '⚗️', '🔬', '💊', '🧬', '⚛️', '🔥', '💧', '🧫', '🔋']
    })
  })

  test('should render emoji spans with correct styling', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const emojiSpans = screen.getAllByText(/[⚛️🧪🧬📐💻🔭🌋🧠]/)
    emojiSpans.forEach(span => {
      expect(span).toHaveClass('text-2xl', 'mb-2')
    })
  })

  test('should render field names with correct styling', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const fieldNames = screen.getAllByText(/Physics|Chemistry|Biology|Mathematics|Computer Science|Astronomy|Medical Science/)
    fieldNames.forEach(name => {
      expect(name).toHaveClass('text-sm', 'font-medium', 'text-gray-700')
    })
  })
}) 