// Mock localStorage before importing the hook
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

import { renderHook, act, waitFor } from '@testing-library/react'
import { useProfile } from '../useProfile'

describe('useProfile Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  test('should initialize with null profile and loading true', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    // Initially loading should be true
    expect(result.current.isLoading).toBe(true)
    expect(result.current.profile).toBe(null)
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  test('should load profile from localStorage on mount', async () => {
    const mockProfile = {
      id: 1,
      name: 'John Doe',
      dreamJob: 'Scientist',
      favoriteSnack: 'Coffee',
      fieldOfStudy: 'Physics',
      xp: 150,
      level: 2,
      points: 200
    }
    
    // Set up localStorage mock before rendering hook
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
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue('invalid json')
    
    const { result } = renderHook(() => useProfile())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.profile).toBe(null)
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-profile')
  })

  test('should save profile to localStorage', async () => {
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    const newProfile = {
      name: 'Jane Smith',
      dreamJob: 'Researcher',
      favoriteSnack: 'Tea',
      fieldOfStudy: 'Chemistry'
    }
    
    act(() => {
      result.current.saveProfile(newProfile)
    })
    
    expect(result.current.profile).toEqual(newProfile)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'homework-hypothesis-profile',
      JSON.stringify(newProfile)
    )
  })

  test('should delete profile from localStorage', async () => {
    const mockProfile = { name: 'John Doe' }
    
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProfile))
    
    const { result } = renderHook(() => useProfile())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    act(() => {
      result.current.deleteProfile()
    })
    
    expect(result.current.profile).toBe(null)
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-profile')
  })

  test('should handle profile updates correctly', async () => {
    const mockProfile = {
      name: 'John Doe',
      xp: 100,
      points: 150
    }
    
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockProfile))
    
    const { result } = renderHook(() => useProfile())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    // Update profile
    const updatedProfile = {
      ...mockProfile,
      xp: 200,
      points: 250
    }
    
    act(() => {
      result.current.saveProfile(updatedProfile)
    })
    
    expect(result.current.profile).toEqual(updatedProfile)
    expect(result.current.profile.xp).toBe(200)
    expect(result.current.profile.points).toBe(250)
  })

  test('should maintain profile state across multiple operations', async () => {
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useProfile())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    // Create profile
    const profile1 = { name: 'John', xp: 100 }
    act(() => {
      result.current.saveProfile(profile1)
    })
    
    expect(result.current.profile).toEqual(profile1)
    
    // Update profile
    const profile2 = { name: 'John', xp: 200, points: 50 }
    act(() => {
      result.current.saveProfile(profile2)
    })
    
    expect(result.current.profile).toEqual(profile2)
    
    // Delete profile
    act(() => {
      result.current.deleteProfile()
    })
    
    expect(result.current.profile).toBe(null)
  })
}) 