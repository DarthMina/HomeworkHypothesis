import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import Navigation from '../components/Navigation'
import TwinkleButton from '../components/TwinkleButton'

const Shop = () => {
  const { profile, saveProfile } = useProfile()
  const [selectedCategory, setSelectedCategory] = useState('icons')

  const categories = [
    { id: 'icons', name: 'Icons', emoji: '🎨' },
    { id: 'banners', name: 'Banners', emoji: '🖼️' },
    { id: 'themes', name: 'Themes', emoji: '🎨' }
  ]

  const shopItems = {
    icons: [
      { id: 'atom', name: 'Atom Icon', price: 150, emoji: '⚛️', description: 'Classic atom symbol' },
      { id: 'dna', name: 'DNA Helix', price: 200, emoji: '🧬', description: 'Double helix structure' },
      { id: 'microscope', name: 'Microscope', price: 180, emoji: '🔬', description: 'Scientific observation' },
      { id: 'flask', name: 'Flask', price: 120, emoji: '🧪', description: 'Chemistry experiments' },
      { id: 'rocket', name: 'Rocket', price: 250, emoji: '🚀', description: 'Space exploration' },
      { id: 'brain', name: 'Brain', price: 220, emoji: '🧠', description: 'Neuroscience focus' }
    ],
    banners: [
      { id: 'galaxy', name: 'Galaxy', price: 300, emoji: '🌌', description: 'Starry night sky' },
      { id: 'laboratory', name: 'Laboratory', price: 250, emoji: '🔬', description: 'Science lab background' },
      { id: 'molecules', name: 'Molecules', price: 280, emoji: '⚗️', description: 'Molecular structure' },
      { id: 'quantum', name: 'Quantum', price: 350, emoji: '⚛️', description: 'Quantum physics theme' },
      { id: 'chemistry', name: 'Chemistry', price: 200, emoji: '🧪', description: 'Chemical reactions' }
    ],
    themes: [
      { id: 'neon', name: 'Neon Glow', price: 500, emoji: '✨', description: 'Bright neon colors' },
      { id: 'pastel', name: 'Pastel Dreams', price: 500, emoji: '🌸', description: 'Soft pastel palette' },
      { id: 'dark', name: 'Dark Matter', price: 500, emoji: '🌑', description: 'Deep space theme' },
      { id: 'aurora', name: 'Aurora', price: 500, emoji: '🌌', description: 'Northern lights effect' }
    ]
  }

  const purchaseItem = (item) => {
    if (profile.points >= item.price) {
      const newProfile = {
        ...profile,
        points: profile.points - item.price,
        cosmetics: {
          ...profile.cosmetics,
          [selectedCategory]: item.id
        }
      }
      saveProfile(newProfile)
    }
  }

  const isOwned = (itemId) => {
    return profile.cosmetics?.[selectedCategory] === itemId
  }

  const canAfford = (price) => {
    return profile.points >= price
  }

  return (
    <div className="min-h-screen p-4">
      <Navigation />
      
      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🛍️ Cosmetic Shop
          </h1>
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{profile?.points || 0}</div>
            <div className="text-sm text-white/70">Points Available</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopItems[selectedCategory].map(item => (
            <div key={item.id} className="glass p-6 rounded-2xl">
              <div className="text-center mb-4">
                <div className="text-6xl mb-2">{item.emoji}</div>
                <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                <p className="text-white/70 text-sm mb-3">{item.description}</p>
                <div className="text-2xl font-bold text-accent mb-4">{item.price} pts</div>
              </div>
              
              {isOwned(item.id) ? (
                <div className="text-center">
                  <div className="text-primary font-semibold">✓ Owned</div>
                  <div className="text-sm text-white/60">Currently equipped</div>
                </div>
              ) : (
                <TwinkleButton
                  onClick={() => purchaseItem(item)}
                  disabled={!canAfford(item.price)}
                  className={`w-full ${
                    canAfford(item.price) 
                      ? 'btn-primary' 
                      : 'bg-white/10 text-white/50 cursor-not-allowed'
                  }`}
                >
                  {canAfford(item.price) ? '🛒 Purchase' : '❌ Not enough points'}
                </TwinkleButton>
              )}
            </div>
          ))}
        </div>

        {/* Current Equipment */}
        <div className="glass p-6 rounded-2xl mt-8">
          <h2 className="text-2xl font-bold mb-4">Currently Equipped</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => {
              const currentItem = shopItems[category.id].find(
                item => item.id === profile.cosmetics?.[category.id]
              )
              return (
                <div key={category.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl">
                    {currentItem?.emoji || '❓'}
                  </div>
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-white/70">
                      {currentItem?.name || 'Default'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="glass p-6 rounded-2xl mt-8">
          <h3 className="text-lg font-semibold mb-2">💡 How to earn points:</h3>
          <ul className="space-y-1 text-white/70">
            <li>• Complete tasks: +10 points each</li>
            <li>• Finish Pomodoro sessions: +25 points each</li>
            <li>• Level up: +50 points bonus</li>
            <li>• Full moon bonus: Double points!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Shop 