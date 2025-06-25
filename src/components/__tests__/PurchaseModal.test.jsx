import { render, screen, fireEvent } from '@testing-library/react'
import PurchaseModal from '../PurchaseModal'

describe('PurchaseModal', () => {
  const mockItem = {
    id: 'static_galaxy',
    name: 'Galaxy Pattern',
    price: 150,
    emoji: '🌌',
    description: 'Starry night sky pattern'
  }

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    item: mockItem,
    currentPoints: 200
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    test('should not render when isOpen is false', () => {
      render(<PurchaseModal {...defaultProps} isOpen={false} />)
      
      expect(screen.queryByText('Galaxy Pattern')).not.toBeInTheDocument()
    })

    test('should render modal when isOpen is true', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      expect(screen.getByText('Galaxy Pattern')).toBeInTheDocument()
      expect(screen.getByText('🌌')).toBeInTheDocument()
      expect(screen.getByText('Starry night sky pattern')).toBeInTheDocument()
      expect(screen.getByText('150 pts')).toBeInTheDocument()
      expect(screen.getByText('Your balance: 200 pts')).toBeInTheDocument()
    })

    test('should display item details correctly', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      expect(screen.getByText('Galaxy Pattern')).toBeInTheDocument()
      expect(screen.getByText('Starry night sky pattern')).toBeInTheDocument()
      expect(screen.getByText('150 pts')).toBeInTheDocument()
    })

    test('should display current points balance', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={500} />)
      
      expect(screen.getByText('Your balance: 500 pts')).toBeInTheDocument()
    })
  })

  describe('Purchase Validation', () => {
    test('should enable purchase button when user has enough points', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={200} />)
      
      const purchaseButton = screen.getByText('🎉 Purchase!')
      expect(purchaseButton).toBeInTheDocument()
      expect(purchaseButton).not.toBeDisabled()
    })

    test('should disable purchase button when user has insufficient points', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={100} />)
      
      const purchaseButton = screen.getByText('Not Enough Points')
      expect(purchaseButton).toBeInTheDocument()
      expect(purchaseButton).toBeDisabled()
    })

    test('should show insufficient points message when user cannot afford item', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={100} />)
      
      expect(screen.getByText('❌ Insufficient Points')).toBeInTheDocument()
      expect(screen.getByText('You need 50 more points')).toBeInTheDocument()
    })

    test('should not show insufficient points message when user can afford item', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={200} />)
      
      expect(screen.queryByText('❌ Insufficient Points')).not.toBeInTheDocument()
      expect(screen.queryByText('You need')).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    test('should call onClose when cancel button is clicked', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })

    test('should call onConfirm when purchase button is clicked and user can afford', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={200} />)
      
      const purchaseButton = screen.getByText('🎉 Purchase!')
      fireEvent.click(purchaseButton)
      
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })

    test('should not call onConfirm when purchase button is clicked but user cannot afford', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={100} />)
      
      const purchaseButton = screen.getByText('Not Enough Points')
      fireEvent.click(purchaseButton)
      
      expect(defaultProps.onConfirm).not.toHaveBeenCalled()
    })
  })

  describe('Modal Styling', () => {
    test('should have proper modal backdrop', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      const backdrop = screen.getByText('Galaxy Pattern').closest('.fixed')
      expect(backdrop).toHaveClass('bg-black/50', 'backdrop-blur-sm')
    })

    test('should have glass styling on modal content', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      const modalContent = screen.getByText('Galaxy Pattern').closest('.glass-strong')
      expect(modalContent).toBeInTheDocument()
    })

    test('should have proper button styling', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      const cancelButton = screen.getByText('Cancel')
      const purchaseButton = screen.getByText('🎉 Purchase!')
      
      expect(cancelButton.closest('button')).toHaveClass('btn-secondary')
      expect(purchaseButton.closest('button')).toHaveClass('btn-primary')
    })
  })

  describe('Edge Cases', () => {
    test('should handle exact point balance', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={150} />)
      
      const purchaseButton = screen.getByText('🎉 Purchase!')
      expect(purchaseButton).toBeInTheDocument()
      expect(purchaseButton).not.toBeDisabled()
    })

    test('should handle zero points', () => {
      render(<PurchaseModal {...defaultProps} currentPoints={0} />)
      
      expect(screen.getByText('❌ Insufficient Points')).toBeInTheDocument()
      expect(screen.getByText('You need 150 more points')).toBeInTheDocument()
    })

    test('should handle very expensive items', () => {
      const expensiveItem = {
        ...mockItem,
        price: 10000
      }
      
      render(<PurchaseModal {...defaultProps} item={expensiveItem} currentPoints={5000} />)
      
      expect(screen.getByText('❌ Insufficient Points')).toBeInTheDocument()
      expect(screen.getByText('You need 5000 more points')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    test('should have proper button roles', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })
      const purchaseButton = screen.getByRole('button', { name: '🎉 Purchase!' })
      
      expect(cancelButton).toBeInTheDocument()
      expect(purchaseButton).toBeInTheDocument()
    })

    test('should have proper modal structure', () => {
      render(<PurchaseModal {...defaultProps} />)
      
      expect(screen.getByText('Galaxy Pattern')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('🎉 Purchase!')).toBeInTheDocument()
    })
  })
}) 