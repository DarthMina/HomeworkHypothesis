import { useState, useEffect } from 'react'

export const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedTasks = localStorage.getItem('homework-hypothesis-tasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (error) {
        console.error('Error parsing tasks:', error)
        localStorage.removeItem('homework-hypothesis-tasks')
      }
    }
    setIsLoading(false)
  }, [])

  const saveTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('homework-hypothesis-tasks', JSON.stringify(newTasks))
  }

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completed: false,
      completedAt: null
    }
    const updatedTasks = [...tasks, newTask]
    saveTasks(updatedTasks)
  }

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    saveTasks(updatedTasks)
  }

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: true, completedAt: new Date().toISOString() }
        : task
    )
    saveTasks(updatedTasks)
  }

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    )
    saveTasks(updatedTasks)
  }

  const getActiveTasks = () => tasks.filter(task => !task.completed)
  const getCompletedTasks = () => tasks.filter(task => task.completed)

  return { 
    tasks, 
    addTask, 
    deleteTask, 
    completeTask, 
    updateTask,
    getActiveTasks,
    getCompletedTasks,
    isLoading 
  }
} 