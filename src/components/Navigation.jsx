import { Link, useLocation } from 'react-router-dom'
import { useProfile } from '../hooks/useProfile'

const Navigation = () => {
  const location = useLocation()
  const { profile } = useProfile()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/pomodoro', label: 'Timer', icon: '⏰' },
    { path: '/courses', label: 'Courses', icon: '📚' },
    { path: '/shop', label: 'Shop', icon: '🛍️' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <nav className="glass-strong rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🧪 The Homework Hypothesis
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-white/70">
            <span className="text-primary font-semibold">{profile?.points || 0}</span> pts
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden mt-4">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="text-center">
                <div className="text-lg">{item.icon}</div>
                <div className="text-xs">{item.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation 