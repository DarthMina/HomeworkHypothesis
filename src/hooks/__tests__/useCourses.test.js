import { renderHook, act, waitFor } from '@testing-library/react'
import { useCourses } from '../useCourses'

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

describe('useCourses Hook', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  test('should initialize with empty courses array', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCourses())
    
    // Initially loading should be false since we're not using async loading
    expect(result.current.courses).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  test('should load courses from localStorage on mount', async () => {
    const mockCourses = [
      {
        id: 1,
        name: 'Chemistry 101',
        field: 'chemistry',
        emoji: '🧪'
      },
      {
        id: 2,
        name: 'Physics 101',
        field: 'physics',
        emoji: '⚛️'
      }
    ]
    
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
    localStorageMock.getItem.mockReturnValue('invalid-json')
    
    const { result } = renderHook(() => useCourses())
    
    await waitFor(() => {
      expect(result.current.courses).toEqual([])
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('homework-hypothesis-courses')
  })

  test('should add a new course', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCourses())
    
    const newCourse = {
      name: 'Biology 101',
      field: 'biology',
      emoji: '🧬'
    }
    
    await act(async () => {
      result.current.addCourse(newCourse)
    })
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(1)
      expect(result.current.courses[0]).toMatchObject(newCourse)
      expect(result.current.courses[0]).toHaveProperty('id')
      expect(result.current.courses[0]).toHaveProperty('createdAt')
    })
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should delete a course', async () => {
    const mockCourses = [
      {
        id: 1,
        name: 'Chemistry 101',
        field: 'chemistry',
        emoji: '🧪'
      },
      {
        id: 2,
        name: 'Physics 101',
        field: 'physics',
        emoji: '⚛️'
      }
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCourses))
    
    const { result } = renderHook(() => useCourses())
    
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(2)
    })
    await act(async () => {
      result.current.deleteCourse(1) // Delete Chemistry 101
    })
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(1)
      expect(result.current.courses[0].name).toBe('Physics 101')
    })
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should update a course', async () => {
    const mockCourses = [
      {
        id: 1,
        name: 'Chemistry 101',
        field: 'chemistry',
        emoji: '🧪',
        isFavorite: false
      }
    ]
    
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCourses))
    
    const { result } = renderHook(() => useCourses())
    
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(1)
    })
    await act(async () => {
      result.current.updateCourse(1, { isFavorite: true })
    })
    await waitFor(() => {
      expect(result.current.courses[0].isFavorite).toBe(true)
      expect(result.current.courses[0].name).toBe('Chemistry 101') // other properties unchanged
    })
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  test('should handle multiple operations correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useCourses())
    
    // Add first course
    const course1 = { name: 'Chemistry 101', field: 'chemistry', emoji: '🧪' }
    await act(async () => {
      result.current.addCourse(course1)
    })
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(1)
    })
    // Add second course
    const course2 = { name: 'Physics 101', field: 'physics', emoji: '⚛️' }
    await act(async () => {
      result.current.addCourse(course2)
    })
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(2)
    })
    // Update first course
    await act(async () => {
      result.current.updateCourse(result.current.courses[0].id, { isFavorite: true })
    })
    await waitFor(() => {
      expect(result.current.courses[0].isFavorite).toBe(true)
      expect(result.current.courses[1].isFavorite).toBeUndefined()
    })
    // Delete second course
    await act(async () => {
      result.current.deleteCourse(result.current.courses[1].id)
    })
    await waitFor(() => {
      expect(result.current.courses).toHaveLength(1)
      expect(result.current.courses[0].name).toBe('Chemistry 101')
    })
  })
}) 