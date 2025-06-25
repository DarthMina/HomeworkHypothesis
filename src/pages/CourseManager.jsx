import { useState } from 'react'
import { useCourses } from '../hooks/useCourses'
import { courseTypes, pastelColors, fieldData } from '../data/fieldData'
import Navigation from '../components/Navigation'
import TwinkleButton from '../components/TwinkleButton'
import ColorBorderCard from '../components/ColorBorderCard'
import MultiSelectCheckbox from '../components/MultiSelectCheckbox'
import ConfirmModal from '../components/ConfirmModal'

const CourseManager = () => {
  const { courses, addCourse, deleteCourse, isLoading } = useCourses()
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-100 to-lavender-200">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center shadow-lg">
          <div className="animate-spin w-8 h-8 border-4 border-lavender-300 border-t-lavender-600 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-800">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-100 via-lavender-200 to-purple-100 p-4" data-testid="course-manager-page">
      <Navigation />
      
      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Course Manager
            </h1>
            <p className="text-gray-700 mt-2">Manage your scientific courses</p>
          </div>
          <TwinkleButton
            onClick={() => setShowAddCourse(true)}
            className="btn-primary"
          >
            Add Course
          </TwinkleButton>
        </div>

        {showAddCourse && (
          <AddCourseModal onClose={() => setShowAddCourse(false)} onAdd={addCourse} />
        )}

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="courses-grid">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onDelete={() => setCourseToDelete(course)}
            />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="bg-white/80 backdrop-blur-md p-12 rounded-2xl text-center shadow-lg">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">No courses yet</h3>
            <p className="text-gray-600 mb-6">Create your first course to get started!</p>
            <TwinkleButton
              onClick={() => setShowAddCourse(true)}
              className="btn-primary"
            >
              ➕ Add Your First Course
            </TwinkleButton>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={!!courseToDelete}
          onClose={() => setCourseToDelete(null)}
          onConfirm={() => {
            if (courseToDelete) {
              deleteCourse(courseToDelete.id)
              setCourseToDelete(null)
            }
          }}
          title="Delete Course"
          message={`Are you sure you want to delete "${courseToDelete?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmIcon="🗑️"
          cancelText="Cancel"
          cancelIcon="❌"
        />
      </div>
    </div>
  )
}

const CourseCard = ({ course, onDelete }) => {
  const { updateCourse } = useCourses()
  
  const toggleFavorite = () => {
    updateCourse(course.id, { isFavorite: !course.isFavorite })
  }

  return (
    <ColorBorderCard color={course.color} className="hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md shadow-lg" data-testid="course-card">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{course.emoji}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{fieldData[course.field]?.name}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleFavorite}
            className={`text-2xl transition-all duration-200 ${
              course.isFavorite ? 'text-yellow-500 scale-110' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            {course.isFavorite ? '⭐' : '☆'}
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        {course.period && (
          <div className="flex justify-between">
            <span className="text-gray-600">Period:</span>
            <span className="text-gray-800 font-medium">{course.period}</span>
          </div>
        )}
        
        {course.examTypes && course.examTypes.length > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Exams:</span>
            <span className="text-gray-800 font-medium">{course.examTypes.join(', ')}</span>
          </div>
        )}
        
        {course.courseTypes && course.courseTypes.length > 0 && (
          <div>
            <span className="text-gray-600">Types: </span>
            <span className="text-gray-800 font-medium">{course.courseTypes.join(', ')}</span>
          </div>
        )}
        
        {course.catalogLink && (
          <div className="flex justify-between">
            <span className="text-gray-600">Catalog:</span>
            <a 
              href={course.catalogLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View
            </a>
          </div>
        )}
        
        {course.description && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-gray-700">
            {course.description}
          </div>
        )}
      </div>
    </ColorBorderCard>
  )
}

const AddCourseModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    field: '',
    emoji: '',
    color: pastelColors[0],
    period: '',
    examTypes: [],
    description: '',
    courseTypes: [],
    catalogLink: ''
  })

  const [newExamType, setNewExamType] = useState('')
  const [selectedField, setSelectedField] = useState(null)
  const [showEmojis, setShowEmojis] = useState(false)

  const periods = [
    'Period 1',
    'Period 2', 
    'Period 3',
    'Period 4',
    'Semester 1',
    'Semester 2',
    'Whole Year'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.field || !formData.emoji) {
      alert('Please fill in all required fields')
      return
    }
    onAdd(formData)
    onClose()
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleFieldClick = (fieldKey, field) => {
    setSelectedField(fieldKey)
    setShowEmojis(true)
    setFormData(prev => ({
      ...prev,
      field: fieldKey,
      emoji: field.emojis[0] // Set first emoji as default
    }))
  }

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      emoji: emoji
    }))
    setShowEmojis(false)
  }

  const addExamType = () => {
    if (newExamType.trim()) {
      setFormData(prev => ({
        ...prev,
        examTypes: [...prev.examTypes, newExamType.trim()]
      }))
      setNewExamType('')
    }
  }

  const removeExamType = (index) => {
    setFormData(prev => ({
      ...prev,
      examTypes: prev.examTypes.filter((_, i) => i !== index)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addExamType()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Add New Course
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div>
            <label htmlFor="course-name" className="block text-sm font-medium mb-2 text-gray-700">Course Name *</label>
            <input
              id="course-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800"
              placeholder="Enter course name"
            />
          </div>

          {/* Field Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Field of Study *</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(fieldData).map(([key, field]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleFieldClick(key, field)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedField === key 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-300 hover:border-purple-300 bg-white/80'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{field.emojis[0]}</span>
                    <span className="text-sm font-medium text-gray-800">{field.name}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Emoji Selection */}
            {showEmojis && selectedField && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Choose an emoji for {fieldData[selectedField]?.name}:</span>
                  <button
                    type="button"
                    onClick={() => setShowEmojis(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {fieldData[selectedField]?.emojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleEmojiSelect(emoji)}
                      className={`p-3 rounded-lg text-2xl transition-all duration-200 hover:scale-110 ${
                        formData.emoji === emoji
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {formData.field && formData.emoji && (
              <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm text-purple-700">
                  Selected: {fieldData[formData.field]?.name} {formData.emoji}
                </span>
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Course Color</label>
            <div className="flex space-x-2">
              {pastelColors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    formData.color === color ? 'border-purple-500 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Period */}
          <div>
            <label htmlFor="course-period" className="block text-sm font-medium mb-2 text-gray-700">Period</label>
            <select
              id="course-period"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800"
            >
              <option value="">Select a period</option>
              {periods.map(period => (
                <option key={period} value={period} className="bg-white text-gray-800">{period}</option>
              ))}
            </select>
          </div>

          {/* Exam Types */}
          <div>
            <label htmlFor="exam-type-input" className="block text-sm font-medium mb-2 text-gray-700">Exam Types</label>
            <div className="flex space-x-2">
              <input
                id="exam-type-input"
                type="text"
                value={newExamType}
                onChange={(e) => setNewExamType(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Written exam"
                className="flex-1 px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800"
              />
              <button
                type="button"
                onClick={addExamType}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
              >
                ➕
              </button>
            </div>
            {formData.examTypes.length > 0 && (
              <div className="mt-2 space-y-1">
                {formData.examTypes.map((examType, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                    <span className="text-sm text-gray-800">{examType}</span>
                    <button
                      type="button"
                      onClick={() => removeExamType(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Course Catalog Link */}
          <div>
            <label htmlFor="course-catalog-link" className="block text-sm font-medium mb-2 text-gray-700">Course Catalog Link (Optional)</label>
            <input
              id="course-catalog-link"
              type="url"
              name="catalogLink"
              value={formData.catalogLink}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800"
              placeholder="https://your-institution.edu/course-catalog/..."
            />
          </div>

          {/* Course Types */}
          <MultiSelectCheckbox
            options={courseTypes}
            selectedValues={formData.courseTypes}
            onChange={(courseTypes) => setFormData(prev => ({ ...prev, courseTypes }))}
            label="Course Types"
          />

          {/* Description */}
          <div>
            <label htmlFor="course-description" className="block text-sm font-medium mb-2 text-gray-700">Description (Optional)</label>
            <textarea
              id="course-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-white/80 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 resize-none text-gray-800"
              placeholder="Brief description of the course..."
            />
          </div>
          
          <div className="flex space-x-4 pt-4">
            <TwinkleButton
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </TwinkleButton>
            <TwinkleButton
              type="submit"
              className="btn-primary flex-1"
            >
              ➕ Add Course
            </TwinkleButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CourseManager 