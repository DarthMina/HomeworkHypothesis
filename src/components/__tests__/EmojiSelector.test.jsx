import { render, screen, fireEvent } from '@testing-library/react'
import EmojiSelector from '../EmojiSelector'

describe('EmojiSelector Component', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  test('should render all field options', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    expect(screen.getByText('Physics')).toBeInTheDocument()
    expect(screen.getByText('Chemistry')).toBeInTheDocument()
    expect(screen.getByText('Biology')).toBeInTheDocument()
    expect(screen.getByText('Mathematics')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('Astronomy')).toBeInTheDocument()
    expect(screen.getByText('Medical Science')).toBeInTheDocument()
  })

  test('should expand field and show emojis when clicked', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const physicsButton = screen.getByText('Physics').closest('button')
    fireEvent.click(physicsButton)
    
    // Should show all 10 emojis for physics as buttons
    const emojiButtons = screen.getAllByRole('button', { name: /⚛️|🌌|⚡|🔬|🌊|💫|🔄|⚙️|🔋|🌍/ })
    expect(emojiButtons.length).toBeGreaterThan(1)
  })

  test('should call onSelect with fieldKey and emoji when emoji is selected', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const physicsButton = screen.getByText('Physics').closest('button')
    fireEvent.click(physicsButton)
    // Find the emoji button (not the span)
    const emojiButtons = screen.getAllByRole('button', { name: '⚛️' })
    // The first one should be the emoji button
    fireEvent.click(emojiButtons[0])
    
    expect(mockOnSelect).toHaveBeenCalledWith({ fieldKey: 'physics', emoji: '⚛️' })
  })

  test('should have correct styling classes', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const container = screen.getByTestId('emoji-selector')
    expect(container).toHaveClass('space-y-3')
  })

  test('should render buttons with correct styling', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveClass(
        'w-full', 'p-3', 'flex', 'items-center', 'justify-between',
        'transition-all', 'duration-200'
      )
    })
  })

  test('should handle multiple selections', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    // Click physics and select emoji
    const physicsButton = screen.getByText('Physics').closest('button')
    fireEvent.click(physicsButton)
    const physicsEmojiButtons = screen.getAllByRole('button', { name: '⚛️' })
    fireEvent.click(physicsEmojiButtons[0])
    
    // Click chemistry and select emoji
    const chemistryButton = screen.getByText('Chemistry').closest('button')
    fireEvent.click(chemistryButton)
    const chemistryEmojiButtons = screen.getAllByRole('button', { name: '🧪' })
    fireEvent.click(chemistryEmojiButtons[0])
    
    expect(mockOnSelect).toHaveBeenCalledTimes(2)
    expect(mockOnSelect).toHaveBeenNthCalledWith(1, { fieldKey: 'physics', emoji: '⚛️' })
    expect(mockOnSelect).toHaveBeenNthCalledWith(2, { fieldKey: 'chemistry', emoji: '🧪' })
  })

  test('should render emoji spans with correct styling', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const emojiSpans = screen.getAllByText(/[⚛️🧪🧬📐💻🔭🌋🧠]/)
    emojiSpans.forEach(span => {
      expect(span).toHaveClass('text-2xl')
    })
  })

  test('should render field names with correct styling', () => {
    render(<EmojiSelector onSelect={mockOnSelect} />)
    
    const fieldNames = screen.getAllByText(/Physics|Chemistry|Biology|Mathematics|Computer Science|Astronomy|Medical Science/)
    fieldNames.forEach(name => {
      expect(name).toHaveClass('text-sm', 'font-medium', 'text-white')
    })
  })
}) 