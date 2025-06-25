import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'
import AtomIcon from '../components/AtomIcon'
import TwinkleButton from '../components/TwinkleButton'

const SplashScreen = () => {
  const navigate = useNavigate()
  const { saveProfile, profile } = useProfile()
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleContinue = () => {
    // This will be handled by the App component routing
    navigate('/dashboard')
  }

  const handleCreateProfile = () => {
    setShowCreateForm(true)
  }

  if (showCreateForm) {
    return <ProfileCreationForm onComplete={(newProfile) => {
      console.log('Profile creation completed, saving profile...')
      saveProfile(newProfile)
      console.log('Profile saved, navigating to dashboard...')
      navigate('/dashboard')
    }} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="twinkle-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="glass-strong p-12 rounded-3xl text-center max-w-md w-full animate-float">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          The Homework Hypothesis
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg text-white/80 mb-8">
          Where science meets productivity
        </p>

        {/* Animated Atom Icon */}
        <div className="mb-8 flex justify-center">
          <AtomIcon />
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <TwinkleButton
            onClick={handleCreateProfile}
            className="btn-primary w-full"
          >
            🧪 Create Profile
          </TwinkleButton>
          
          <TwinkleButton
            onClick={handleContinue}
            className="btn-secondary w-full"
          >
            ⚗️ Continue
          </TwinkleButton>
        </div>

        {/* Science quote */}
        <p className="text-sm text-white/60 mt-8 italic">
          "The important thing is not to stop questioning." - Einstein
        </p>
      </div>
    </div>
  )
}

const ProfileCreationForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    dreamJob: '',
    favoriteSnack: '',
    fieldOfStudy: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    const newProfile = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      xp: 0,
      level: 1,
      points: 100,
      courses: [],
      completedTasks: [],
      achievements: [],
      cosmetics: {
        banner: 'default',
        icon: 'default',
        theme: 'default'
      }
    }
    console.log('Created new profile:', newProfile)
    onComplete(newProfile)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-strong p-8 rounded-3xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Create Your Profile
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Dream Job</label>
            <input
              type="text"
              name="dreamJob"
              value={formData.dreamJob}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="e.g., Quantum Physicist"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Favorite Snack</label>
            <input
              type="text"
              name="favoriteSnack"
              value={formData.favoriteSnack}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="e.g., Coffee & Cookies"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Field of Study</label>
            <input
              type="text"
              name="fieldOfStudy"
              value={formData.fieldOfStudy}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:border-primary"
              placeholder="e.g., Computer Science"
            />
          </div>
          
          <TwinkleButton
            type="submit"
            className="btn-primary w-full mt-6"
          >
            🚀 Start Your Journey
          </TwinkleButton>
        </form>
      </div>
    </div>
  )
}

export default SplashScreen 