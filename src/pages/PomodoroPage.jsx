import { useState, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import Navigation from '../components/Navigation'
import TwinkleButton from '../components/TwinkleButton'

const PomodoroPage = () => {
  const { profile, saveProfile } = useProfile()
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [settings, setSettings] = useState({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4
  })
  const [sessionCount, setSessionCount] = useState(0)

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    if (!isBreak) {
      // Work session completed
      const newSessionCount = sessionCount + 1
      setSessionCount(newSessionCount)
      
      // Award XP and points
      const newProfile = {
        ...profile,
        xp: (profile.xp || 0) + 50,
        points: (profile.points || 0) + 25
      }
      saveProfile(newProfile)
      
      // Start break
      const breakDuration = newSessionCount % settings.sessionsUntilLongBreak === 0 
        ? settings.longBreakTime * 60 
        : settings.breakTime * 60
      setTimeLeft(breakDuration)
      setIsBreak(true)
    } else {
      // Break completed, start work session
      setTimeLeft(settings.workTime * 60)
      setIsBreak(false)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(settings.workTime * 60)
    setIsBreak(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen p-4">
      <Navigation />
      
      <div className="max-w-4xl mx-auto mt-8">
        <div className="glass-strong p-8 rounded-3xl text-center">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {isBreak ? '🧪 Break Time!' : '⚗️ Study Session'}
          </h1>
          
          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-8xl font-mono font-bold text-white mb-4">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xl text-white/70">
              Session {sessionCount + 1}
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center space-x-4 mb-8">
            {!isRunning ? (
              <TwinkleButton onClick={startTimer} className="btn-primary">
                ▶️ Start
              </TwinkleButton>
            ) : (
              <TwinkleButton onClick={pauseTimer} className="btn-secondary">
                ⏸️ Pause
              </TwinkleButton>
            )}
            <TwinkleButton onClick={resetTimer} className="btn-secondary">
              🔄 Reset
            </TwinkleButton>
          </div>
          
          {/* Progress Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass p-4 rounded-xl">
              <div className="text-2xl font-bold text-primary">{sessionCount}</div>
              <div className="text-sm text-white/70">Sessions Completed</div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="text-2xl font-bold text-accent">{Math.floor((profile?.xp || 0) / 50)}</div>
              <div className="text-sm text-white/70">Total Study Sessions</div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="text-2xl font-bold text-white">{Math.floor((profile?.points || 0) / 25)}</div>
              <div className="text-sm text-white/70">Points Earned</div>
            </div>
          </div>
        </div>
        
        {/* Settings */}
        <div className="glass p-6 rounded-2xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Timer Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Work Time (minutes)</label>
              <input
                type="number"
                value={settings.workTime}
                onChange={(e) => setSettings(prev => ({ ...prev, workTime: parseInt(e.target.value) || 25 }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Break Time (minutes)</label>
              <input
                type="number"
                value={settings.breakTime}
                onChange={(e) => setSettings(prev => ({ ...prev, breakTime: parseInt(e.target.value) || 5 }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
                min="1"
                max="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Long Break Time (minutes)</label>
              <input
                type="number"
                value={settings.longBreakTime}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreakTime: parseInt(e.target.value) || 15 }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
                min="5"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sessions until Long Break</label>
              <input
                type="number"
                value={settings.sessionsUntilLongBreak}
                onChange={(e) => setSettings(prev => ({ ...prev, sessionsUntilLongBreak: parseInt(e.target.value) || 4 }))}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
                min="2"
                max="10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PomodoroPage 