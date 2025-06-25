import { useProfile } from '../hooks/useProfile'
import { useXP } from '../hooks/useXP'
import { Link } from 'react-router-dom'
import TwinkleButton from '../components/TwinkleButton'
import XPBar from '../components/XPBar'
import Navigation from '../components/Navigation'

const Dashboard = () => {
  const { profile } = useProfile()
  const { xp, level, levelTitle } = useXP()

  return (
    <div className="min-h-screen p-4">
      <Navigation />
      
      <div className="max-w-6xl mx-auto mt-8">
        {/* Welcome Section */}
        <div className="glass-strong p-6 rounded-2xl mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.name}! 🧪
          </h1>
          <p className="text-white/80">
            Ready to make some scientific discoveries today?
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-primary mb-2">{level}</div>
            <div className="text-sm text-white/70">{levelTitle}</div>
          </div>
          
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-accent mb-2">{profile?.points || 0}</div>
            <div className="text-sm text-white/70">Points</div>
          </div>
          
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-white mb-2">{profile?.courses?.length || 0}</div>
            <div className="text-sm text-white/70">Courses</div>
          </div>
          
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-2xl font-bold text-white mb-2">{profile?.completedTasks?.length || 0}</div>
            <div className="text-sm text-white/70">Tasks Completed</div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="glass p-6 rounded-2xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Progress to Next Level</h2>
          <XPBar xp={xp} level={level} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/pomodoro">
            <div className="glass p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-lg font-semibold mb-2">Pomodoro Timer</h3>
              <p className="text-white/70 text-sm">Start a focused study session</p>
            </div>
          </Link>
          
          <Link to="/courses">
            <div className="glass p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">Course Manager</h3>
              <p className="text-white/70 text-sm">Manage your courses and tasks</p>
            </div>
          </Link>
          
          <Link to="/shop">
            <div className="glass p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-lg font-semibold mb-2">Cosmetic Shop</h3>
              <p className="text-white/70 text-sm">Spend your points on cosmetics</p>
            </div>
          </Link>
          
          <Link to="/profile">
            <div className="glass p-6 rounded-xl hover:bg-white/20 transition-all duration-300 cursor-pointer group">
              <div className="text-4xl mb-4">👤</div>
              <h3 className="text-lg font-semibold mb-2">Profile</h3>
              <p className="text-white/70 text-sm">View your achievements and stats</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        {profile?.completedTasks?.length > 0 && (
          <div className="glass p-6 rounded-2xl mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {profile.completedTasks.slice(-3).reverse().map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-white/60">{task.course}</div>
                  </div>
                  <div className="text-sm text-primary">+{task.xp} XP</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 