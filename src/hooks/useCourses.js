import { useState, useEffect } from 'react'

export const useCourses = () => {
  const [courses, setCourses] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedCourses = localStorage.getItem('homework-hypothesis-courses')
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses))
      } catch (error) {
        console.error('Error parsing courses:', error)
        localStorage.removeItem('homework-hypothesis-courses')
      }
    }
    setIsLoading(false)
  }, [])

  const saveCourses = (newCourses) => {
    setCourses(newCourses)
    localStorage.setItem('homework-hypothesis-courses', JSON.stringify(newCourses))
  }

  const addCourse = (course) => {
    const newCourse = {
      ...course,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    const updatedCourses = [...courses, newCourse]
    saveCourses(updatedCourses)
  }

  const deleteCourse = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId)
    saveCourses(updatedCourses)
  }

  const updateCourse = (courseId, updates) => {
    const updatedCourses = courses.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    )
    saveCourses(updatedCourses)
  }

  return { 
    courses, 
    addCourse, 
    deleteCourse, 
    updateCourse, 
    isLoading 
  }
} 