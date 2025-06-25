// Mock localStorage before importing the hook
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

import { renderHook, act, waitFor } from '@testing-library/react'
import { useCourses } from '../useCourses'

describe('useCourses Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
  })

  test('should initialize with empty courses array', async () => {
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCourses())
    
    // Initially loading should be true
    expect(result.current.courses).toEqual([])
    expect(result.current.isLoading).toBe(true)
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })

  test('should load courses from localStorage on mount', async () => {
    const mockCourses = [
      { id: 1, name: 'Chemistry 101', field: 'chemistry', emoji: '🧪' },
      { id: 2, name: 'Physics 101', field: 'physics', emoji: '⚛️' }
    ]
    
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCourses))
    
    const { result } = renderHook(() => useCourses())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.courses).toEqual(mockCourses)
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('homework-hypothesis-courses')
  })

  test('should handle localStorage parsing errors', async () => {
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue('invalid json')
    
    const { result } = renderHook(() => useCourses())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.courses).toEqual([])
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-courses')
  })

  test('should add a new course', async () => {
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCourses())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    const newCourse = {
      name: 'Biology 101',
      field: 'biology',
      emoji: '🧬',
      color: '#a7f3d0'
    }
    
    act(() => {
      result.current.addCourse(newCourse)
    })
    
    expect(result.current.courses).toHaveLength(1)
    expect(result.current.courses[0]).toMatchObject({
      name: 'Biology 101',
      field: 'biology',
      emoji: '🧬',
      color: '#a7f3d0'
    })
    expect(result.current.courses[0]).toHaveProperty('id')
    expect(result.current.courses[0]).toHaveProperty('createdAt')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should delete a course', async () => {
    const mockCourses = [
      { id: 1, name: 'Chemistry 101' },
      { id: 2, name: 'Physics 101' }
    ]
    
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCourses))
    
    const { result } = renderHook(() => useCourses())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    act(() => {
      result.current.deleteCourse(1)
    })
    
    expect(result.current.courses).toHaveLength(1)
    expect(result.current.courses[0].name).toBe('Physics 101')
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should update a course', async () => {
    const mockCourses = [
      { id: 1, name: 'Chemistry 101', isFavorite: false }
    ]
    
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCourses))
    
    const { result } = renderHook(() => useCourses())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    act(() => {
      result.current.updateCourse(1, { isFavorite: true })
    })
    
    expect(result.current.courses[0].isFavorite).toBe(true)
    expect(result.current.courses[0].name).toBe('Chemistry 101') // other properties unchanged
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should handle multiple operations correctly', async () => {
    // Set up localStorage mock before rendering hook
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCourses())
    
    // Wait for useEffect to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    // Add courses
    act(() => {
      result.current.addCourse({ name: 'Course 1', field: 'physics', emoji: '⚛️' })
      result.current.addCourse({ name: 'Course 2', field: 'chemistry', emoji: '🧪' })
    })
    
    expect(result.current.courses).toHaveLength(2)
    
    // Update first course
    act(() => {
      result.current.updateCourse(result.current.courses[0].id, { isFavorite: true })
    })
    
    expect(result.current.courses[0].isFavorite).toBe(true)
    
    // Delete second course
    act(() => {
      result.current.deleteCourse(result.current.courses[1].id)
    })
    
    expect(result.current.courses).toHaveLength(1)
    expect(result.current.courses[0].isFavorite).toBe(true)
  })
}) 