import { useState } from 'react'
import { useTasks, useCourses, useProfile } from '../hooks'
import { calculateRewards, awardXP, awardPoints } from '../utils/xpSystem'
import Navigation from '../components/Navigation'
import TwinkleButton from '../components/TwinkleButton'
import ColorBorderCard from '../components/ColorBorderCard'
import ConfirmModal from '../components/ConfirmModal'
import TaskRewardModal from '../components/TaskRewardModal'

const taskTypes = [
  'Study session',
  'Homework', 
  'Essay',
  'Lab report',
  'Assignment',
  'Thesis',
  'Exam prep'
]

const HomeworkPage = () => {
  const { tasks, addTask, completeTask, deleteTask, getActiveTasks, isLoading } = useTasks()
  const { courses } = useCourses()
  const { profile, saveProfile } = useProfile()
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskToComplete, setTaskToComplete] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [completedTaskData, setCompletedTaskData] = useState(null)

  const activeTasks = getActiveTasks()

  const handleCompleteTask = (task) => {
    setTaskToComplete(task)
  }

  const confirmCompleteTask = () => {
    if (!taskToComplete) return

    const rewards = calculateRewards(taskToComplete.taskType)
    
    // Update profile with new XP and points
    const newProfile = {
      ...profile,
      xp: awardXP(profile?.xp || 0, taskToComplete.taskType),
      points: awardPoints(profile?.points || 0, taskToComplete.taskType),
      tasksCompleted: (profile?.tasksCompleted || 0) + 1,
      completedTasks: [
        ...(profile?.completedTasks || []),
        {
          title: taskToComplete.title,
          course: courses.find(c => c.id === taskToComplete.courseId)?.name || 'Unknown Course',
          taskType: taskToComplete.taskType,
          xp: rewards.xp,
          points: rewards.points,
          completedAt: new Date().toISOString()
        }
      ]
    }
    saveProfile(newProfile)

    // Complete the task
    completeTask(taskToComplete.id)

    // Show reward modal
    setCompletedTaskData({
      taskType: taskToComplete.taskType,
      xpGained: rewards.xp,
      pointsGained: rewards.points
    })
    setShowRewardModal(true)
    setTaskToComplete(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lavender-100 to-lavender-200">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl text-center shadow-lg">
          <div className="animate-spin w-8 h-8 border-4 border-lavender-300 border-t-lavender-600 rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-800">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-100 via-lavender-200 to-purple-100 p-4" data-testid="homework-page">
      <Navigation />
      
      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Homework & Study Tasks
            </h1>
            <p className="text-gray-700 mt-2">Complete tasks to earn XP and points!</p>
          </div>
          <TwinkleButton
            onClick={() => setShowAddTask(true)}
            className="btn-primary"
          >
            Add Task
          </TwinkleButton>
        </div>

        {showAddTask && (
          <AddTaskModal 
            onClose={() => setShowAddTask(false)} 
            onAdd={addTask}
            courses={courses}
          />
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="tasks-grid">
          {activeTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onComplete={() => handleCompleteTask(task)}
              onDelete={() => setTaskToDelete(task)}
            />
          ))}
        </div>

        {activeTasks.length === 0 && (
          <div className="bg-white/80 backdrop-blur-md p-12 rounded-2xl text-center shadow-lg">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">No active tasks</h3>
            <p className="text-gray-600 mb-6">Create your first task to start earning XP!</p>
            <TwinkleButton
              onClick={() => setShowAddTask(true)}
              className="btn-primary"
            >
              ➕ Add Your First Task
            </TwinkleButton>
          </div>
        )}

        {/* Complete Task Confirmation Modal */}
        <ConfirmModal
          isOpen={!!taskToComplete}
          onClose={() => setTaskToComplete(null)}
          onConfirm={confirmCompleteTask}
          title="Complete Task"
          message="Are you sure you're done? This decision is permanent!"
          confirmText="Yes, I am sure!"
          confirmIcon="✅"
          cancelText="Oops, no wait!"
          cancelIcon="❌"
        />

        {/* Delete Task Confirmation Modal */}
        <ConfirmModal
          isOpen={!!taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => {
            if (taskToDelete) {
              deleteTask(taskToDelete.id)
              setTaskToDelete(null)
            }
          }}
          title="Delete Task"
          message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmIcon="🗑️"
          cancelText="Cancel"
          cancelIcon="❌"
        />

        {/* Task Reward Modal */}
        <TaskRewardModal
          isOpen={showRewardModal}
          onClose={() => setShowRewardModal(false)}
          taskType={completedTaskData?.taskType}
          xpGained={completedTaskData?.xpGained}
          pointsGained={completedTaskData?.pointsGained}
        />
      </div>
    </div>
  )
}

const TaskCard = ({ task, onComplete, onDelete }) => {
  const { courses } = useCourses()
  const course = courses.find(c => c.id === task.courseId)
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = new Date(task.deadline) < new Date()

  return (
    <ColorBorderCard 
      color={course?.color || 'border-gray-300'} 
      className={`hover:scale-105 transition-transform duration-300 bg-white/80 backdrop-blur-md shadow-lg ${
        isOverdue ? 'border-red-400 bg-red-50/80' : ''
      }`}
      data-testid="task-card"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{course?.emoji || '📝'}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.taskType}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onComplete}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Finish
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        {course && (
          <div className="flex justify-between">
            <span className="text-gray-600">Course:</span>
            <span className="text-gray-800 font-medium">{course.name}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-600">Deadline:</span>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-800'}`}>
            {formatDate(task.deadline)}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
        
        {task.description && (
          <div className="mt-3 p-2 bg-gray-50 rounded text-gray-700">
            {task.description}
          </div>
        )}
      </div>
    </ColorBorderCard>
  )
}

const AddTaskModal = ({ onClose, onAdd, courses }) => {
  const [formData, setFormData] = useState({
    title: '',
    taskType: taskTypes[0],
    courseId: '',
    deadline: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.courseId || !formData.deadline) {
      alert('Please fill in all required fields')
      return
    }
    onAdd(formData)
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 bg-white"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="task-type" className="block text-sm font-medium text-gray-700 mb-2">
              Task Type *
            </label>
            <select
              id="task-type"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 bg-white"
              required
            >
              {taskTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-course" className="block text-sm font-medium text-gray-700 mb-2">
              Course *
            </label>
            <select
              id="task-course"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 bg-white"
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.emoji} {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline *
            </label>
            <input
              id="task-deadline"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 bg-white"
              required
            />
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 bg-white"
              placeholder="Enter task description..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HomeworkPage 