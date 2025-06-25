import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CourseManager from '../CourseManager'

// Mock the hooks
const mockUseCourses = jest.fn()

jest.mock('../../hooks/useCourses', () => ({
  useCourses: () => mockUseCourses()
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('CourseManager Page', () => {
  beforeEach(() => {
    mockUseCourses.mockClear()
  })

  test('should render course manager with title', () => {
    mockUseCourses.mockReturnValue({
      courses: [],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Course Manager')).toBeInTheDocument()
    expect(screen.getByText('Manage your scientific courses')).toBeInTheDocument()
  })

  test('should render course cards', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false,
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        {
          id: 2,
          name: 'Chemistry Lab',
          field: 'chemistry',
          emoji: '🧪',
          color: '#fca5a5',
          isFavorite: true,
          createdAt: '2024-01-02T00:00:00.000Z'
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Physics 101')).toBeInTheDocument()
    expect(screen.getByText('Chemistry Lab')).toBeInTheDocument()
    expect(screen.getByText('⚛️')).toBeInTheDocument()
    expect(screen.getByText('🧪')).toBeInTheDocument()
  })

  test('should show favorite star for favorite courses', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        },
        {
          id: 2,
          name: 'Chemistry Lab',
          field: 'chemistry',
          emoji: '🧪',
          color: '#fca5a5',
          isFavorite: true
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const favoriteStars = screen.getAllByText('⭐')
    expect(favoriteStars).toHaveLength(1) // Only Chemistry Lab is favorite
  })

  test('should render add course button', () => {
    mockUseCourses.mockReturnValue({
      courses: [],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const addButton = screen.getByText('Add Course')
    expect(addButton).toBeInTheDocument()
    expect(addButton).toHaveClass('btn-primary')
  })

  test('should show empty state when no courses', () => {
    mockUseCourses.mockReturnValue({
      courses: [],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('No courses yet')).toBeInTheDocument()
    expect(screen.getByText('Create your first course to get started!')).toBeInTheDocument()
  })

  test('should render course cards with correct styling', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const courseCards = screen.getAllByTestId('course-card')
    courseCards.forEach(card => {
      expect(card).toHaveClass('glass', 'p-6', 'rounded-2xl')
    })
  })

  test('should render course emojis with correct styling', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    // Find the emoji span specifically
    const emojiSpan = screen.getByText('⚛️')
    expect(emojiSpan).toHaveClass('text-3xl', 'mb-3')
  })

  test('should render course names with correct styling', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const courseName = screen.getByText('Physics 101')
    expect(courseName).toHaveClass('text-xl', 'font-bold', 'text-gray-800')
  })

  test('should render field names with correct styling', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const fieldName = screen.getByText('Physics')
    expect(fieldName).toHaveClass('text-sm', 'text-gray-600', 'mb-2')
  })

  test('should render action buttons', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(1)
    
    deleteButtons.forEach(button => {
      expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600')
    })
  })

  test('should render favorite toggle buttons', () => {
    mockUseCourses.mockReturnValue({
      courses: [
        {
          id: 1,
          name: 'Physics 101',
          field: 'physics',
          emoji: '⚛️',
          color: '#93c5fd',
          isFavorite: false
        }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const favoriteButtons = screen.getAllByRole('button').filter(button => 
      button.textContent === '⭐' || button.textContent === '☆'
    )
    expect(favoriteButtons).toHaveLength(1)
  })

  test('should have responsive grid layout', () => {
    mockUseCourses.mockReturnValue({
      courses: [],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const gridContainer = screen.getByTestId('courses-grid')
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')
  })

  test('should render page with correct background', () => {
    mockUseCourses.mockReturnValue({
      courses: [],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })
    
    renderWithRouter(<CourseManager />)
    
    const pageContainer = screen.getByTestId('course-manager-page')
    expect(pageContainer).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-blue-50', 'to-purple-50')
  })
}) 