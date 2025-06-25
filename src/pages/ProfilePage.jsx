import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useXP } from '../hooks/useXP'
import { useCourses } from '../hooks/useCourses'
import { useShop } from '../hooks/useShop'
import Navigation from '../components/Navigation'
import TwinkleButton from '../components/TwinkleButton'
import XPBar from '../components/XPBar'

const ProfilePage = () => {
  const { profile, saveProfile, deleteProfile } = useProfile()
  const { xp, level, levelTitle, xpProgress } = useXP()
  const { courses } = useCourses()
  const { getOwnedItems, equipItem, getEquippedItems } = useShop()
  const [showWasteBin, setShowWasteBin] = useState(false)
  const [showCosmetics, setShowCosmetics] = useState(false)

  const completedTasks = profile?.completedTasks || []
  const achievements = profile?.achievements || []

  const getStreak = () => {
    // Simple streak calculation based on recent activity
    const recentTasks = completedTasks
      .filter(task => {
        const taskDate = new Date(task.completedAt)
        const now = new Date()
        const diffDays = Math.floor((now - taskDate) / (1000 * 60 * 60 * 24))
        return diffDays <= 7
      })
    return recentTasks.length
  }

  const getFavoriteCourse = () => {
    const favoriteCourse = courses.find(course => course.isFavorite)
    return favoriteCourse ? favoriteCourse.name : 'None set'
  }

  const clearWasteBin = () => {
    const newProfile = {
      ...profile,
      completedTasks: []
    }
    saveProfile(newProfile)
  }

  const equippedItems = getEquippedItems()

  // Don't render if profile is not loaded yet
  if (!profile) {
    return (
      <div className="min-h-screen p-4">
        <Navigation />
        <div className="max-w-6xl mx-auto mt-8">
          <div className="glass p-8 rounded-2xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <Navigation />
      
      <div className="max-w-6xl mx-auto mt-8">
        {/* Profile Header */}
        <div className="glass-strong p-8 rounded-3xl mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center md:text-left">
              <div className="text-6xl mb-4">👤</div>
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-white/70 mb-2">{profile.dreamJob}</p>
              <p className="text-white/60 text-sm">{profile.fieldOfStudy}</p>
            </div>
            
            <div className="flex-1 w-full md:w-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{level}</div>
                  <div className="text-sm text-white/70">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{profile.points || 0}</div>
                  <div className="text-sm text-white/70">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{getStreak()}</div>
                  <div className="text-sm text-white/70">Week Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{completedTasks.length}</div>
                  <div className="text-sm text-white/70">Tasks Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* XP Progress */}
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">Progress</h2>
              <div className="mb-4">
                <div className="text-lg font-semibold text-primary mb-2">{levelTitle}</div>
                <XPBar xp={xp} level={level} />
              </div>
            </div>

            {/* Stats */}
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Favorite Course:</span>
                  <span className="text-primary font-semibold">{getFavoriteCourse()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorite Snack:</span>
                  <span className="text-accent">{profile.favoriteSnack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Member Since:</span>
                  <span className="text-white/70">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total XP Earned:</span>
                  <span className="text-primary font-semibold">{xp}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              {achievements.length > 0 ? (
                <div className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-sm text-white/70">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60">
                  <div className="text-4xl mb-2">🏆</div>
                  <p>No achievements yet. Keep studying!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Cosmetics Customization */}
            <div className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">🎨 Cosmetics</h2>
                <TwinkleButton
                  onClick={() => setShowCosmetics(!showCosmetics)}
                  className="btn-secondary"
                >
                  {showCosmetics ? '📖 Hide' : '🎨 Customize'}
                </TwinkleButton>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Customize your profile with purchased cosmetics from the shop.
              </p>
              
              {showCosmetics && (
                <div className="space-y-4">
                  {/* Currently Equipped */}
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold mb-3">Currently Equipped</h3>
                    <div className="space-y-2">
                      {['banners', 'icons', 'themes'].map(category => {
                        const equippedId = equippedItems[category]
                        const ownedItems = getOwnedItems(category)
                        const equippedItem = ownedItems.find(item => item.id === equippedId)
                        
                        return (
                          <div key={category} className="flex items-center justify-between">
                            <span className="capitalize">{category}:</span>
                            <span className="text-primary">
                              {equippedItem?.name || 'Default'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Owned Items by Category */}
                  {['banners', 'icons', 'themes'].map(category => {
                    const ownedItems = getOwnedItems(category)
                    const equippedId = equippedItems[category]
                    
                    if (ownedItems.length === 0) return null
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium capitalize">{category}</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {ownedItems.map(item => (
                            <button
                              key={item.id}
                              onClick={() => equipItem(category, item.id)}
                              className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                                equippedId === item.id
                                  ? 'bg-accent/20 text-accent border border-accent/30'
                                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                              }`}
                            >
                              <div className="text-lg mb-1">{item.emoji}</div>
                              <div className="truncate">{item.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}

                  {['banners', 'icons', 'themes'].every(category => getOwnedItems(category).length === 0) && (
                    <div className="text-center text-white/60 py-8">
                      <div className="text-4xl mb-2">🛍️</div>
                      <p>No cosmetics purchased yet.</p>
                      <p className="text-sm">Visit the shop to buy some!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hazardous Waste Bin */}
            <div className="glass p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">☣️ Hazardous Waste Bin</h2>
                <TwinkleButton
                  onClick={() => setShowWasteBin(!showWasteBin)}
                  className="btn-secondary"
                >
                  {showWasteBin ? '📖 Hide' : '🗑️ View'}
                </TwinkleButton>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Completed tasks are safely stored here for future reference.
              </p>
              
              {showWasteBin && (
                <div className="space-y-4">
                  {completedTasks.length > 0 ? (
                    <>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {completedTasks.slice().reverse().map((task, index) => (
                          <div key={index} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm text-white/60">{task.course}</div>
                                <div className="text-xs text-white/50">
                                  {new Date(task.completedAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-sm text-primary">+{task.xp} XP</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <TwinkleButton
                        onClick={clearWasteBin}
                        className="btn-secondary w-full"
                      >
                        🗑️ Clear All
                      </TwinkleButton>
                    </>
                  ) : (
                    <div className="text-center text-white/60 py-8">
                      <div className="text-4xl mb-2">🧪</div>
                      <p>No completed tasks yet. Start studying!</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Account Actions */}
            <div className="glass p-6 rounded-2xl">
              <h2 className="text-xl font-semibold mb-4">Account</h2>
              <div className="space-y-3">
                <TwinkleButton
                  onClick={() => {
                    if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
                      deleteProfile()
                    }
                  }}
                  className="btn-secondary w-full"
                >
                  🗑️ Delete Profile
                </TwinkleButton>
                <div className="text-xs text-white/50 text-center">
                  This will permanently delete all your data
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage 