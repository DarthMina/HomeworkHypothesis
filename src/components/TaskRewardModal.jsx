import { useEffect, useState } from 'react'

const TaskRewardModal = ({ isOpen, onClose, taskType, xpGained, pointsGained }) => {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        setShowAnimation(false)
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4 relative overflow-hidden">
        {/* Floating symbols */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-4 left-4 text-2xl animate-bounce ${showAnimation ? 'animate-pulse' : ''}`}>
            ⚛️
          </div>
          <div className={`absolute top-8 right-6 text-xl animate-bounce delay-300 ${showAnimation ? 'animate-pulse' : ''}`}>
            ☢️
          </div>
          <div className={`absolute bottom-6 left-6 text-xl animate-bounce delay-500 ${showAnimation ? 'animate-pulse' : ''}`}>
            ⚛️
          </div>
          <div className={`absolute bottom-8 right-4 text-2xl animate-bounce delay-700 ${showAnimation ? 'animate-pulse' : ''}`}>
            ☢️
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600 mb-4">
            Your task has been moved to the hazardous waste bin!
          </p>
          
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Task Type:</span>
              <span className="font-semibold text-gray-800">{taskType}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">XP Gained:</span>
              <span className="font-bold text-green-600">+{xpGained} XP</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Points Gained:</span>
              <span className="font-bold text-blue-600">+{pointsGained} Points</span>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Keep up the great work, scientist! 🔬
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskRewardModal 