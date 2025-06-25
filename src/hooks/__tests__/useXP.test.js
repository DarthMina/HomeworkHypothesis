import { renderHook } from '@testing-library/react'
import { useXP } from '../useXP'

// Mock the useProfile hook
jest.mock('../useProfile', () => ({
  useProfile: jest.fn()
}))

import { useProfile } from '../useProfile'

describe('useXP Hook', () => {
  beforeEach(() => {
    useProfile.mockClear()
  })

  test('should initialize with default values when no profile', () => {
    useProfile.mockReturnValue({ profile: null })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current.xp).toBe(0)
    expect(result.current.level).toBe(1)
    expect(result.current.xpForNextLevel).toBe(100)
    expect(result.current.xpProgress).toBe(0)
  })

  test('should calculate values correctly with profile data', () => {
    const mockProfile = {
      xp: 250
    }
    useProfile.mockReturnValue({ profile: mockProfile })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current.xp).toBe(250)
    expect(result.current.level).toBe(3) // Math.floor(250 / 100) + 1
    expect(result.current.xpForNextLevel).toBe(300) // 3 * 100
    expect(result.current.xpProgress).toBe(50) // 250 % 100
  })

  test('should handle edge case: exactly enough XP for level', () => {
    const mockProfile = {
      xp: 100 // Exactly enough for level 2
    }
    useProfile.mockReturnValue({ profile: mockProfile })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current.xp).toBe(100)
    expect(result.current.level).toBe(2)
    expect(result.current.xpForNextLevel).toBe(200)
    expect(result.current.xpProgress).toBe(0)
  })

  test('should handle large XP values', () => {
    const mockProfile = {
      xp: 1000
    }
    useProfile.mockReturnValue({ profile: mockProfile })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current.xp).toBe(1000)
    expect(result.current.level).toBe(11) // Math.floor(1000 / 100) + 1
    expect(result.current.xpForNextLevel).toBe(1100)
    expect(result.current.xpProgress).toBe(0)
  })

  test('should handle zero XP', () => {
    const mockProfile = {
      xp: 0
    }
    useProfile.mockReturnValue({ profile: mockProfile })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current.xp).toBe(0)
    expect(result.current.level).toBe(1)
    expect(result.current.xpForNextLevel).toBe(100)
    expect(result.current.xpProgress).toBe(0)
  })

  test('should handle partial XP progress', () => {
    const mockProfile = {
      xp: 75
    }
    useProfile.mockReturnValue({ profile: mockProfile })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current.xp).toBe(75)
    expect(result.current.level).toBe(1)
    expect(result.current.xpForNextLevel).toBe(100)
    expect(result.current.xpProgress).toBe(75)
  })

  test('should include levelTitle in return value', () => {
    const mockProfile = {
      xp: 150
    }
    useProfile.mockReturnValue({ profile: mockProfile })
    
    const { result } = renderHook(() => useXP())
    
    expect(result.current).toHaveProperty('levelTitle')
    expect(typeof result.current.levelTitle).toBe('string')
  })
}) 