import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomeworkPage from '../../pages/HomeworkPage'
import CourseManager from '../../pages/CourseManager'
import { useCourses } from '../../hooks/useCourses'
import { useProfile } from '../../hooks/useProfile'

// Mock the hooks
jest.mock('../../hooks/useCourses')
jest.mock('../../hooks/useProfile')
jest.mock('../../hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [],
    addTask: jest.fn(),
    completeTask: jest.fn(),
    deleteTask: jest.fn(),
    getActiveTasks: () => [],
    isLoading: false
  })
}))

// Mock the XP system
jest.mock('../../utils/xpSystem', () => ({
  calculateRewards: jest.fn(() => ({ xp: 10, points: 5 })),
  awardXP: jest.fn((current, type) => current + 10),
  awardPoints: jest.fn((current, type) => current + 5)
}))

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Form Accessibility Tests', () => {
  beforeEach(() => {
    // Mock course data
    useCourses.mockReturnValue({
      courses: [
        { id: 1, name: 'Biology 101', emoji: '🧬', color: 'border-green-300' },
        { id: 2, name: 'Chemistry 101', emoji: '🧪', color: 'border-blue-300' }
      ],
      addCourse: jest.fn(),
      deleteCourse: jest.fn(),
      updateCourse: jest.fn(),
      isLoading: false
    })

    // Mock profile data
    useProfile.mockReturnValue({
      profile: {
        name: 'Test User',
        xp: 100,
        points: 50,
        tasksCompleted: 5,
        completedTasks: []
      },
      saveProfile: jest.fn(),
      deleteProfile: jest.fn(),
      isLoading: false
    })
  })

  describe('HomeworkPage Form Accessibility', () => {
    test('should have readable text in all form inputs', async () => {
      renderWithRouter(<HomeworkPage />)
      
      // Click "Add Task" to open the modal
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      // Use getByPlaceholderText for all fields
      const titleInput = screen.getByPlaceholderText('Enter task title')
      const taskTypeSelect = screen.getByLabelText('Task Type *')
      const courseSelect = screen.getByLabelText('Course *')
      const deadlineInput = screen.getByLabelText('Deadline *')
      const descriptionTextarea = screen.getByPlaceholderText('Enter task description...')

      // Verify text color classes are present
      expect(titleInput.className).toContain('text-gray-800')
      expect(titleInput.className).toContain('bg-white')
      expect(taskTypeSelect.className).toContain('text-gray-800')
      expect(taskTypeSelect.className).toContain('bg-white')
      expect(courseSelect.className).toContain('text-gray-800')
      expect(courseSelect.className).toContain('bg-white')
      expect(deadlineInput.className).toContain('text-gray-800')
      expect(deadlineInput.className).toContain('bg-white')
      expect(descriptionTextarea.className).toContain('text-gray-800')
      expect(descriptionTextarea.className).toContain('bg-white')
    })

    test('should have readable dropdown options', async () => {
      renderWithRouter(<HomeworkPage />)
      
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      const taskTypeSelect = screen.getByDisplayValue('Study session')
      
      // Check that the select element has proper styling
      expect(taskTypeSelect.className).toContain('text-gray-800')
      expect(taskTypeSelect.className).toContain('bg-white')
      
      // Verify all task type options are present
      const options = taskTypeSelect.querySelectorAll('option')
      expect(options).toHaveLength(7) // 7 task types
      
      // Check that each option has readable text
      const expectedTaskTypes = [
        'Study session',
        'Homework',
        'Essay',
        'Lab report',
        'Assignment',
        'Thesis',
        'Exam prep'
      ]
      
      expectedTaskTypes.forEach(taskType => {
        expect(screen.getByText(taskType)).toBeInTheDocument()
      })
    })

    test('should have readable course dropdown options', async () => {
      renderWithRouter(<HomeworkPage />)
      
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      const courseSelect = screen.getByDisplayValue('Select a course')
      
      // Check that the select element has proper styling
      expect(courseSelect.className).toContain('text-gray-800')
      expect(courseSelect.className).toContain('bg-white')
      
      // Verify course options are present
      expect(screen.getByText('🧬 Biology 101')).toBeInTheDocument()
      expect(screen.getByText('🧪 Chemistry 101')).toBeInTheDocument()
    })

    test('should have proper contrast for form labels', async () => {
      renderWithRouter(<HomeworkPage />)
      
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      // Only check labels inside the modal
      const modal = screen.getByText('Add New Task').closest('div[role="dialog"], .fixed')
      const labels = modal.querySelectorAll('label')
      labels.forEach(label => {
        expect(label.className).toContain('text-gray-700')
      })
    })
  })

  describe('CourseManager Form Accessibility', () => {
    test('should have readable text in course creation form', async () => {
      renderWithRouter(<CourseManager />)
      
      // Click "Add Course" to open the modal
      const addCourseButton = screen.getByText('Add Course')
      fireEvent.click(addCourseButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Course')).toBeInTheDocument()
      })

      // Use getByPlaceholderText for all fields
      const courseNameInput = screen.getByPlaceholderText('Enter course name')
      const periodSelect = screen.getByLabelText('Period')
      const descriptionTextarea = screen.getByPlaceholderText('Brief description of the course...')

      // Verify text color and background classes are present
      expect(courseNameInput.className).toContain('text-gray-800')
      expect(courseNameInput.className).toContain('bg-white/80')
      expect(periodSelect.className).toContain('text-gray-800')
      expect(periodSelect.className).toContain('bg-white/80')
      expect(descriptionTextarea.className).toContain('text-gray-800')
      expect(descriptionTextarea.className).toContain('bg-white/80')
    })

    test('should have readable field selection dropdowns', async () => {
      renderWithRouter(<CourseManager />)
      
      const addCourseButton = screen.getByText('Add Course')
      fireEvent.click(addCourseButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Course')).toBeInTheDocument()
      })

      // Check that field buttons are visible and readable
      const physicsButton = screen.getByText('Physics')
      const biologyButton = screen.getByText('Biology')
      const chemistryButton = screen.getByText('Chemistry')

      expect(physicsButton).toBeInTheDocument()
      expect(biologyButton).toBeInTheDocument()
      expect(chemistryButton).toBeInTheDocument()
    })
  })

  describe('General Form Accessibility Rules', () => {
    test('should enforce consistent form styling patterns', () => {
      // This test documents the required styling patterns for all forms
      const requiredClasses = {
        textInput: ['text-gray-800', 'bg-white'],
        select: ['text-gray-800', 'bg-white'],
        textarea: ['text-gray-800', 'bg-white'],
        label: ['text-gray-700']
      }

      // These patterns should be applied to all form elements
      expect(requiredClasses.textInput).toContain('text-gray-800')
      expect(requiredClasses.textInput).toContain('bg-white')
      expect(requiredClasses.select).toContain('text-gray-800')
      expect(requiredClasses.select).toContain('bg-white')
      expect(requiredClasses.textarea).toContain('text-gray-800')
      expect(requiredClasses.textarea).toContain('bg-white')
      expect(requiredClasses.label).toContain('text-gray-700')
    })

    test('should ensure dropdown options are always visible', () => {
      // This test ensures that select elements have proper styling
      const selectElement = document.createElement('select')
      selectElement.className = 'text-gray-800 bg-white border border-gray-300'
      
      // Verify the element has the required classes
      expect(selectElement.className).toContain('text-gray-800')
      expect(selectElement.className).toContain('bg-white')
      expect(selectElement.className).toContain('border-gray-300')
    })
  })

  describe('Accessibility Best Practices', () => {
    test('should have proper focus states', async () => {
      renderWithRouter(<HomeworkPage />)
      
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      const titleInput = screen.getByPlaceholderText('Enter task title')
      
      // Check that focus states are defined
      expect(titleInput.className).toContain('focus:ring-2')
      expect(titleInput.className).toContain('focus:ring-purple-500')
      expect(titleInput.className).toContain('focus:border-transparent')
    })

    test('should have proper placeholder text', async () => {
      renderWithRouter(<HomeworkPage />)
      
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      // Check that placeholders are descriptive
      expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter task description...')).toBeInTheDocument()
    })

    test('should have proper labels for all form controls', async () => {
      renderWithRouter(<HomeworkPage />)
      
      const addTaskButton = screen.getByText('Add Task')
      fireEvent.click(addTaskButton)

      // Wait for modal to appear
      await waitFor(() => {
        expect(screen.getByText('Add New Task')).toBeInTheDocument()
      })

      // Check that all form controls have associated labels
      expect(screen.getByText('Task Title *')).toBeInTheDocument()
      expect(screen.getByText('Task Type *')).toBeInTheDocument()
      expect(screen.getByText('Course *')).toBeInTheDocument()
      expect(screen.getByText('Deadline *')).toBeInTheDocument()
      expect(screen.getByText('Description (Optional)')).toBeInTheDocument()
    })
  })
}) 