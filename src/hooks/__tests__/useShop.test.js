import { renderHook, act } from '@testing-library/react'
import { useShop } from '../useShop'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

describe('useShop', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  describe('Initialization', () => {
    test('should initialize with empty owned cosmetics when no localStorage data', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useShop())
      
      expect(result.current.ownedCosmetics).toEqual({
        banners: [],
        icons: [],
        themes: []
      })
    })

    test('should load owned cosmetics from localStorage', () => {
      const mockOwned = {
        banners: ['static_galaxy'],
        icons: ['static_atom'],
        themes: ['theme_purple_dream']
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOwned))
      
      const { result } = renderHook(() => useShop())
      
      expect(result.current.ownedCosmetics).toEqual(mockOwned)
    })

    test('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid-json')
      
      const { result } = renderHook(() => useShop())
      
      expect(result.current.ownedCosmetics).toEqual({
        banners: [],
        icons: [],
        themes: []
      })
    })
  })

  describe('Purchase System', () => {
    test('should successfully purchase an item', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useShop())
      
      const item = {
        id: 'static_galaxy',
        name: 'Galaxy Pattern',
        price: 150,
        emoji: '🌌'
      }
      
      act(() => {
        const success = result.current.purchaseItem('banners', 'static', item, 200)
        expect(success).toBe(true)
      })
      
      expect(result.current.ownedCosmetics.banners).toContain('static_galaxy')
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'homework-hypothesis-owned-cosmetics',
        JSON.stringify({
          banners: ['static_galaxy'],
          icons: [],
          themes: []
        })
      )
    })

    test('should not purchase if insufficient points', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useShop())
      
      const item = {
        id: 'static_galaxy',
        name: 'Galaxy Pattern',
        price: 150,
        emoji: '🌌'
      }
      
      act(() => {
        const success = result.current.purchaseItem('banners', 'static', item, 100)
        expect(success).toBe(false)
      })
      
      expect(result.current.ownedCosmetics.banners).not.toContain('static_galaxy')
    })

    test('should not purchase if already owned', () => {
      const mockOwned = {
        banners: ['static_galaxy'],
        icons: [],
        themes: []
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOwned))
      
      const { result } = renderHook(() => useShop())
      
      const item = {
        id: 'static_galaxy',
        name: 'Galaxy Pattern',
        price: 150,
        emoji: '🌌'
      }
      
      act(() => {
        const success = result.current.purchaseItem('banners', 'static', item, 200)
        expect(success).toBe(false)
      })
      
      expect(result.current.ownedCosmetics.banners).toEqual(['static_galaxy'])
    })
  })

  describe('Ownership Checking', () => {
    test('should correctly identify owned items', () => {
      const mockOwned = {
        banners: ['static_galaxy', 'colored_purple'],
        icons: ['static_atom'],
        themes: ['theme_purple_dream']
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOwned))
      
      const { result } = renderHook(() => useShop())
      
      expect(result.current.isOwned('banners', 'static_galaxy')).toBe(true)
      expect(result.current.isOwned('banners', 'colored_purple')).toBe(true)
      expect(result.current.isOwned('icons', 'static_atom')).toBe(true)
      expect(result.current.isOwned('themes', 'theme_purple_dream')).toBe(true)
      expect(result.current.isOwned('banners', 'animated_aurora')).toBe(false)
    })
  })

  describe('Item Retrieval', () => {
    test('should get items for category and subsection', () => {
      const { result } = renderHook(() => useShop())
      
      const staticBanners = result.current.getItems('banners', 'static')
      expect(staticBanners).toHaveLength(3)
      expect(staticBanners[0].id).toBe('static_galaxy')
      
      const staticIcons = result.current.getItems('icons', 'static')
      expect(staticIcons).toHaveLength(8)
      expect(staticIcons[0].id).toBe('static_atom')
    })

    test('should get owned items for category', () => {
      const mockOwned = {
        banners: ['static_galaxy', 'colored_purple'],
        icons: ['static_atom'],
        themes: ['theme_purple_dream']
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOwned))
      
      const { result } = renderHook(() => useShop())
      
      const ownedBanners = result.current.getOwnedItems('banners')
      expect(ownedBanners).toHaveLength(2)
      expect(ownedBanners.map(item => item.id)).toContain('static_galaxy')
      expect(ownedBanners.map(item => item.id)).toContain('colored_purple')
    })
  })

  describe('Equipment System', () => {
    test('should get default equipped items when none set', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useShop())
      
      const equipped = result.current.getEquippedItems()
      expect(equipped).toEqual({
        banners: null,
        icons: null,
        themes: null
      })
    })

    test('should get equipped items from localStorage', () => {
      const mockEquipped = {
        banners: 'static_galaxy',
        icons: 'static_atom',
        themes: 'theme_purple_dream'
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEquipped))
      
      const { result } = renderHook(() => useShop())
      
      const equipped = result.current.getEquippedItems()
      expect(equipped).toEqual(mockEquipped)
    })

    test('should equip an item', () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const { result } = renderHook(() => useShop())
      
      act(() => {
        result.current.equipItem('banners', 'static_galaxy')
      })
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'homework-hypothesis-equipped-cosmetics',
        JSON.stringify({
          banners: 'static_galaxy',
          icons: null,
          themes: null
        })
      )
    })

    test('should get equipped item details', () => {
      const mockEquipped = {
        banners: 'static_galaxy',
        icons: null,
        themes: null
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEquipped))
      
      const { result } = renderHook(() => useShop())
      
      const equippedItem = result.current.getEquippedItem('banners')
      expect(equippedItem).toBeDefined()
      expect(equippedItem.id).toBe('static_galaxy')
      expect(equippedItem.name).toBe('Galaxy Pattern')
      expect(equippedItem.subsection).toBe('static')
    })

    test('should return null for non-equipped category', () => {
      const mockEquipped = {
        banners: 'static_galaxy',
        icons: null,
        themes: null
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockEquipped))
      
      const { result } = renderHook(() => useShop())
      
      const equippedItem = result.current.getEquippedItem('icons')
      expect(equippedItem).toBeNull()
    })
  })

  describe('Shop Data Structure', () => {
    test('should have correct shop items structure', () => {
      const { result } = renderHook(() => useShop())
      
      expect(result.current.shopItems).toHaveProperty('banners')
      expect(result.current.shopItems).toHaveProperty('icons')
      expect(result.current.shopItems).toHaveProperty('themes')
      
      expect(result.current.shopItems.banners).toHaveProperty('static')
      expect(result.current.shopItems.banners).toHaveProperty('colored')
      expect(result.current.shopItems.banners).toHaveProperty('animated')
      
      expect(result.current.shopItems.icons).toHaveProperty('static')
      expect(result.current.shopItems.icons).toHaveProperty('animated')
      
      expect(result.current.shopItems.themes).toHaveProperty('colored')
      expect(result.current.shopItems.themes).toHaveProperty('thematic')
    })

    test('should have items with correct properties', () => {
      const { result } = renderHook(() => useShop())
      
      const firstBanner = result.current.shopItems.banners.static[0]
      expect(firstBanner).toHaveProperty('id')
      expect(firstBanner).toHaveProperty('name')
      expect(firstBanner).toHaveProperty('price')
      expect(firstBanner).toHaveProperty('emoji')
      expect(firstBanner).toHaveProperty('description')
    })
  })
}) 