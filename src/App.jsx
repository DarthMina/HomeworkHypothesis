import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SplashScreen from './pages/SplashScreen'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import PomodoroPage from './pages/PomodoroPage'
import CourseManager from './pages/CourseManager'
import Shop from './pages/Shop'
import { useProfile } from './hooks/useProfile'

function App() {
  const { profile, isLoading } = useProfile()

  console.log('App render - profile:', profile, 'isLoading:', isLoading)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-strong p-8 rounded-2xl text-center">
          <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading your scientific journey...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={profile ? <Navigate to="/dashboard" /> : <SplashScreen />} 
          />
          <Route 
            path="/dashboard" 
            element={profile ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/profile" 
            element={profile ? <ProfilePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/pomodoro" 
            element={profile ? <PomodoroPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/courses" 
            element={profile ? <CourseManager /> : <Navigate to="/" />} 
          />
          <Route 
            path="/shop" 
            element={profile ? <Shop /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App 