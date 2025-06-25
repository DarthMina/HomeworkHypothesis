import { renderHook, act, waitFor } from '@testing-library/react'
import { useProfile } from '../useProfile'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('useProfile Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  test('should initialize with null profile and loading false', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    // Initially loading should be false since we're not using async loading
    expect(result.current.isLoading).toBe(false)
    expect(result.current.profile).toBe(null)
  })

  test('should load profile from localStorage on mount', async () => {
    const mockProfile = {
      name: 'John Doe',
      dreamJob: 'Scientist',
      favoriteSnack: 'Coffee',
      fieldOfStudy: 'Physics',
      id: 1,
      level: 2,
      xp: 150,
      points: 200
    }
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProfile))
    
    const { result } = renderHook(() => useProfile())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.profile).toEqual(mockProfile)
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('homework-hypothesis-profile')
  })

  test('should handle localStorage parsing errors', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useProfile())
    
    await waitFor(() => {
      expect(result.current.profile).toBe(null)
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-profile')
  })

  test('should save profile to localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    const newProfile = {
      name: 'Jane Smith',
      dreamJob: 'Researcher',
      favoriteSnack: 'Tea',
      fieldOfStudy: 'Chemistry'
    }
    
    await act(async () => {
      result.current.saveProfile(newProfile)
    })
    await waitFor(() => {
      expect(result.current.profile).toEqual(newProfile)
    })
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'homework-hypothesis-profile',
      JSON.stringify(newProfile)
    )
  })

  test('should delete profile from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    await act(async () => {
      result.current.deleteProfile()
    })
    await waitFor(() => {
      expect(result.current.profile).toBe(null)
    })
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-profile')
  })

  test('should handle profile updates correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    // Save initial profile
    const initialProfile = { name: 'John', xp: 100 }
    await act(async () => {
      result.current.saveProfile(initialProfile)
    })
    await waitFor(() => {
      expect(result.current.profile).toEqual(initialProfile)
    })
    
    // Update profile
    const updatedProfile = { name: 'John', xp: 200, points: 50 }
    await act(async () => {
      result.current.saveProfile(updatedProfile)
    })
    await waitFor(() => {
      expect(result.current.profile).toEqual(updatedProfile)
    })
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'homework-hypothesis-profile',
      JSON.stringify(updatedProfile)
    )
  })

  test('should handle profile deletion correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    // Save a profile first
    const profile = { name: 'John Doe', xp: 200, points: 250 }
    await act(async () => {
      result.current.saveProfile(profile)
    })
    await waitFor(() => {
      expect(result.current.profile).toEqual(profile)
    })
    
    // Then delete it
    await act(async () => {
      result.current.deleteProfile()
    })
    await waitFor(() => {
      expect(result.current.profile).toBe(null)
    })
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-profile')
  })
}) 