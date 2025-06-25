import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Shop from '../Shop'
import { useProfile } from '../../hooks/useProfile'
import { useShop } from '../../hooks/useShop'

// Mock the hooks
jest.mock('../../hooks/useProfile')
jest.mock('../../hooks/useShop')

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Shop Page', () => {
  const mockProfile = {
    name: 'Test User',
    points: 500,
    xp: 100,
    level: 2
  }

  const mockShopData = {
    shopItems: {
      banners: {
        static: [
          {
            id: 'static_galaxy',
            name: 'Galaxy Pattern',
            price: 150,
            emoji: '🌌',
            description: 'Starry night sky pattern',
            preview: 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900'
          }
        ],
        colored: [
          {
            id: 'colored_purple',
            name: 'Purple Nebula',
            price: 80,
            emoji: '💜',
            description: 'Soft purple gradient',
            preview: 'bg-gradient-to-br from-purple-400 via-pink-400 to-purple-600'
          }
        ]
      },
      icons: {
        static: [
          {
            id: 'static_atom',
            name: 'Atom',
            price: 80,
            emoji: '⚛️',
            description: 'Classic atom symbol'
          }
        ]
      },
      themes: {
        colored: [
          {
            id: 'theme_purple_dream',
            name: 'Purple Dream',
            price: 80,
            emoji: '💜',
            description: 'Soft purple pastel theme'
          }
        ]
      }
    },
    ownedCosmetics: {
      banners: [],
      icons: [],
      themes: []
    },
    isOwned: jest.fn(),
    purchaseItem: jest.fn(),
    getItems: jest.fn(),
    getEquippedItems: jest.fn(),
    equipItem: jest.fn()
  }

  beforeEach(() => {
    useProfile.mockReturnValue({
      profile: mockProfile,
      saveProfile: jest.fn(),
      isLoading: false
    })

    useShop.mockReturnValue({
      ...mockShopData,
      getItems: jest.fn((category, subsection) => {
        return mockShopData.shopItems[category]?.[subsection] || []
      }),
      getEquippedItems: jest.fn(() => ({
        banners: null,
        icons: null,
        themes: null
      }))
    })

    // Mock window.alert
    global.alert = jest.fn()
  })

  describe('Rendering', () => {
    test('should render shop page with correct title and points', () => {
      renderWithRouter(<Shop />)
      
      expect(screen.getByText('🛍️ Cosmetic Shop')).toBeInTheDocument()
      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('Points Available')).toBeInTheDocument()
    })

    test('should render category tabs', () => {
      renderWithRouter(<Shop />)
      
      expect(screen.getByText('🖼️ Banners')).toBeInTheDocument()
      expect(screen.getByText('🎭 Icons')).toBeInTheDocument()
      expect(screen.getByText('🎨 Themes')).toBeInTheDocument()
    })

    test('should render subsection tabs for banners', () => {
      renderWithRouter(<Shop />)
      
      expect(screen.getByText('🖼️ Static Pattern')).toBeInTheDocument()
      expect(screen.getByText('🎨 Colored')).toBeInTheDocument()
      expect(screen.getByText('✨ Animated')).toBeInTheDocument()
    })

    test('should show loading state when profile is null', () => {
      useProfile.mockReturnValue({
        profile: null,
        saveProfile: jest.fn(),
        isLoading: false
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('Loading shop...')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    test('should change category when clicking category tabs', () => {
      renderWithRouter(<Shop />)
      
      const iconsTab = screen.getByText('🎭 Icons')
      fireEvent.click(iconsTab)
      
      expect(iconsTab.closest('button')).toHaveClass('bg-white/20')
    })

    test('should change subsection when clicking subsection tabs', () => {
      renderWithRouter(<Shop />)
      
      const coloredTab = screen.getByText('🎨 Colored')
      fireEvent.click(coloredTab)
      
      expect(coloredTab.closest('button')).toHaveClass('bg-white/15')
    })
  })

  describe('Shop Items Display', () => {
    test('should display shop items in grid', () => {
      renderWithRouter(<Shop />)
      
      expect(screen.getByText('Galaxy Pattern')).toBeInTheDocument()
      expect(screen.getByText('150 pts')).toBeInTheDocument()
      expect(screen.getByText('Starry night sky pattern')).toBeInTheDocument()
    })

    test('should show banner previews', () => {
      renderWithRouter(<Shop />)
      
      const previewElement = screen.getByText('Galaxy Pattern').closest('.glass').querySelector('.bg-gradient-to-br')
      expect(previewElement).toBeInTheDocument()
    })

    test('should display items from different subsections', () => {
      // Mock getItems to return colored items
      useShop.mockReturnValue({
        ...mockShopData,
        getItems: jest.fn((category, subsection) => {
          if (category === 'banners' && subsection === 'colored') {
            return mockShopData.shopItems.banners.colored
          }
          return []
        })
      })

      renderWithRouter(<Shop />)
      
      // Click on colored subsection
      const coloredTab = screen.getByText('🎨 Colored')
      fireEvent.click(coloredTab)
      
      expect(screen.getByText('Purple Nebula')).toBeInTheDocument()
      expect(screen.getByText('80 pts')).toBeInTheDocument()
    })
  })

  describe('Purchase Flow', () => {
    test('should show purchase button for affordable items', () => {
      useShop.mockReturnValue({
        ...mockShopData,
        isOwned: jest.fn(() => false)
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('🛒 Purchase')).toBeInTheDocument()
    })

    test('should show "Not enough points" for expensive items', () => {
      useShop.mockReturnValue({
        ...mockShopData,
        isOwned: jest.fn(() => false),
        getItems: jest.fn(() => [{
          id: 'expensive_item',
          name: 'Expensive Item',
          price: 1000,
          emoji: '💎',
          description: 'Very expensive'
        }])
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('❌ Not enough points')).toBeInTheDocument()
    })

    test('should show "Owned" for purchased items', () => {
      useShop.mockReturnValue({
        ...mockShopData,
        isOwned: jest.fn(() => true)
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('✓ Owned')).toBeInTheDocument()
    })

    test('should open purchase modal when clicking purchase button', async () => {
      useShop.mockReturnValue({
        ...mockShopData,
        isOwned: jest.fn(() => false)
      })

      renderWithRouter(<Shop />)
      
      const purchaseButton = screen.getByText('🛒 Purchase')
      fireEvent.click(purchaseButton)
      
      await waitFor(() => {
        expect(screen.getByText('Galaxy Pattern')).toBeInTheDocument()
        expect(screen.getByText('150 pts')).toBeInTheDocument()
        expect(screen.getByText('🎉 Purchase!')).toBeInTheDocument()
      })
    })

    test('should show equip button for owned items', () => {
      useShop.mockReturnValue({
        ...mockShopData,
        isOwned: jest.fn(() => true),
        getEquippedItems: jest.fn(() => ({
          banners: null,
          icons: null,
          themes: null
        }))
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('🎯 Equip')).toBeInTheDocument()
    })

    test('should show "Currently equipped" for equipped items', () => {
      useShop.mockReturnValue({
        ...mockShopData,
        isOwned: jest.fn(() => true),
        getEquippedItems: jest.fn(() => ({
          banners: 'static_galaxy',
          icons: null,
          themes: null
        }))
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('Currently equipped')).toBeInTheDocument()
    })
  })

  describe('Currently Equipped Section', () => {
    test('should display currently equipped section', () => {
      renderWithRouter(<Shop />)
      
      expect(screen.getByText('Currently Equipped')).toBeInTheDocument()
    })

    test('should show equipped items', () => {
      useShop.mockReturnValue({
        ...mockShopData,
        getEquippedItems: jest.fn(() => ({
          banners: 'static_galaxy',
          icons: 'static_atom',
          themes: 'theme_purple_dream'
        }))
      })

      renderWithRouter(<Shop />)
      
      expect(screen.getByText('Banners')).toBeInTheDocument()
      expect(screen.getByText('Icons')).toBeInTheDocument()
      expect(screen.getByText('Themes')).toBeInTheDocument()
    })
  })

  describe('Tips Section', () => {
    test('should display tips section', () => {
      renderWithRouter(<Shop />)
      
      expect(screen.getByText('💡 How to earn points:')).toBeInTheDocument()
      expect(screen.getByText(/Complete tasks: \+10 points each/)).toBeInTheDocument()
      expect(screen.getByText(/Finish Pomodoro sessions: \+25 points each/)).toBeInTheDocument()
      expect(screen.getByText(/Level up: \+50 points bonus/)).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    test('should have responsive grid layout', () => {
      renderWithRouter(<Shop />)
      
      const grid = screen.getByText('Galaxy Pattern').closest('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4')
    })

    test('should have horizontal scroll for category tabs', () => {
      renderWithRouter(<Shop />)
      
      const categoryTabs = screen.getByText('🖼️ Banners').closest('.flex')
      expect(categoryTabs).toHaveClass('overflow-x-auto')
    })
  })
}) 