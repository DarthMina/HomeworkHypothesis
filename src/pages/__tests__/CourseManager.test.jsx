import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CourseManager from '../CourseManager'

// Mock the hooks
jest.mock('../../hooks/useCourses', () => ({
  useCourses: () => ({
    courses: [
      {
        id: 1,
        name: 'Chemistry 101',
        field: 'chemistry',
        emoji: '🧪',
        color: '#c1e1dc',
        period: 'Period 1',
        examTypes: ['Written exam'],
        courseTypes: ['Lecture'],
        description: 'Introduction to Chemistry',
        catalogLink: 'https://example.com/chem101'
      },
      {
        id: 2,
        name: 'Physics 101',
        field: 'physics',
        emoji: '⚛️',
        color: '#a7bed3',
        period: 'Period 2',
        examTypes: ['Oral exam'],
        courseTypes: ['Lab'],
        description: 'Introduction to Physics'
      }
    ],
    addCourse: jest.fn(),
    deleteCourse: jest.fn(),
    updateCourse: jest.fn(),
    isLoading: false
  })
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
    // Clear localStorage before each test
    localStorage.clear()
  })

  test('should render course manager page', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByTestId('course-manager-page')).toBeInTheDocument()
    expect(screen.getByText('Course Manager')).toBeInTheDocument()
    expect(screen.getByText('Manage your scientific courses')).toBeInTheDocument()
  })

  test('should render add course button', () => {
    renderWithRouter(<CourseManager />)
    
    const addButton = screen.getByText('Add Course')
    expect(addButton).toBeInTheDocument()
  })

  test('should render course cards', () => {
    renderWithRouter(<CourseManager />)
    
    const courseCards = screen.getAllByTestId('course-card')
    expect(courseCards).toHaveLength(2)
  })

  test('should render course names', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Chemistry 101')).toBeInTheDocument()
    expect(screen.getByText('Physics 101')).toBeInTheDocument()
  })

  test('should render course emojis', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('🧪')).toBeInTheDocument()
    expect(screen.getByText('⚛️')).toBeInTheDocument()
  })

  test('should render course periods', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Period 1')).toBeInTheDocument()
    expect(screen.getByText('Period 2')).toBeInTheDocument()
  })

  test('should render exam types', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Written exam')).toBeInTheDocument()
    expect(screen.getByText('Oral exam')).toBeInTheDocument()
  })

  test('should render course types', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Lecture')).toBeInTheDocument()
    expect(screen.getByText('Lab')).toBeInTheDocument()
  })

  test('should render course descriptions', () => {
    renderWithRouter(<CourseManager />)
    
    expect(screen.getByText('Introduction to Chemistry')).toBeInTheDocument()
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument()
  })

  test('should render catalog links', () => {
    renderWithRouter(<CourseManager />)
    
    const catalogLink = screen.getByText('View')
    expect(catalogLink).toBeInTheDocument()
    expect(catalogLink).toHaveAttribute('href', 'https://example.com/chem101')
  })

  test('should render delete buttons', () => {
    renderWithRouter(<CourseManager />)
    
    const deleteButtons = screen.getAllByText('Delete')
    expect(deleteButtons).toHaveLength(2)
  })

  test('should render favorite buttons', () => {
    renderWithRouter(<CourseManager />)
    
    const favoriteButtons = screen.getAllByText('☆')
    expect(favoriteButtons).toHaveLength(2)
  })

  test('should render courses grid', () => {
    renderWithRouter(<CourseManager />)
    
    const coursesGrid = screen.getByTestId('courses-grid')
    expect(coursesGrid).toBeInTheDocument()
  })

  test('should render course cards with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    const courseCards = screen.getAllByTestId('course-card')
    courseCards.forEach(card => {
      expect(card).toHaveClass('p-6', 'rounded-2xl', 'transition-all', 'duration-300', 'hover:shadow-lg')
    })
  })

  test('should render course emojis with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    // Find the emoji span specifically
    const emojiSpan = screen.getByText('⚛️')
    expect(emojiSpan).toHaveClass('text-3xl')
  })

  test('should render course names with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    const courseNames = screen.getAllByText(/Chemistry 101|Physics 101/)
    courseNames.forEach(name => {
      expect(name).toHaveClass('text-xl', 'font-bold', 'text-gray-800')
    })
  })

  test('should render field names with correct styling', () => {
    renderWithRouter(<CourseManager />)
    // Find all elements with the field name class
    const fieldNameEls = screen.getAllByText(/Chemistry|Physics/).filter(el => el.className.includes('text-sm'))
    fieldNameEls.forEach(name => {
      expect(name).toHaveClass('text-sm', 'text-gray-600')
    })
  })

  test('should render period labels with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    const periodLabels = screen.getAllByText(/Period:/)
    periodLabels.forEach(label => {
      expect(label).toHaveClass('text-gray-600')
    })
  })

  test('should render exam labels with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    const examLabels = screen.getAllByText(/Exams:/)
    examLabels.forEach(label => {
      expect(label).toHaveClass('text-gray-600')
    })
  })

  test('should render type labels with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    const typeLabels = screen.getAllByText(/Types:/)
    typeLabels.forEach(label => {
      expect(label).toHaveClass('text-gray-600')
    })
  })

  test('should render catalog labels with correct styling', () => {
    renderWithRouter(<CourseManager />)
    
    const catalogLabels = screen.getAllByText(/Catalog:/)
    catalogLabels.forEach(label => {
      expect(label).toHaveClass('text-gray-600')
    })
  })

  test('should render page with correct background', () => {
    renderWithRouter(<CourseManager />)
    
    const pageContainer = screen.getByTestId('course-manager-page')
    expect(pageContainer).toHaveClass('min-h-screen', 'bg-gradient-to-br', 'from-lavender-100', 'via-lavender-200', 'to-purple-100')
  })
}) 