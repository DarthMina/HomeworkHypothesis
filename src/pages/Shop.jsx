import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useShop } from '../hooks/useShop'
import Navigation from '../components/Navigation'
import TwinkleButton from '../components/TwinkleButton'
import PurchaseModal from '../components/PurchaseModal'

const Shop = () => {
  const { profile, saveProfile } = useProfile()
  const { 
    shopItems, 
    isOwned, 
    purchaseItem, 
    getItems, 
    getEquippedItems,
    equipItem 
  } = useShop()
  
  const [selectedCategory, setSelectedCategory] = useState('banners')
  const [selectedSubsection, setSelectedSubsection] = useState('static')
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, item: null })

  const categories = [
    { id: 'banners', name: 'Banners', emoji: '🖼️' },
    { id: 'icons', name: 'Icons', emoji: '🎭' },
    { id: 'themes', name: 'Themes', emoji: '🎨' }
  ]

  const subsections = {
    banners: [
      { id: 'static', name: 'Static Pattern', emoji: '🖼️' },
      { id: 'colored', name: 'Colored', emoji: '🎨' },
      { id: 'animated', name: 'Animated', emoji: '✨' }
    ],
    icons: [
      { id: 'static', name: 'Static', emoji: '🎭' },
      { id: 'animated', name: 'Animated', emoji: '✨' }
    ],
    themes: [
      { id: 'colored', name: 'Colored', emoji: '🎨' },
      { id: 'thematic', name: 'Thematic Dynamic', emoji: '🌟' }
    ]
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
    setSelectedSubsection(subsections[categoryId][0].id)
  }

  const handlePurchase = (item) => {
    setPurchaseModal({ isOpen: true, item })
  }

  const confirmPurchase = () => {
    const { item } = purchaseModal
    const currentPoints = profile?.points || 0
    const success = purchaseItem(selectedCategory, selectedSubsection, item, currentPoints)
    
    if (success) {
      // Deduct points from profile
      const newProfile = {
        ...profile,
        points: currentPoints - item.price
      }
      saveProfile(newProfile)
      
      // Show success message
      alert(`🎉 Successfully purchased ${item.name}!`)
    }
    
    setPurchaseModal({ isOpen: false, item: null })
  }

  const cancelPurchase = () => {
    setPurchaseModal({ isOpen: false, item: null })
  }

  const canAfford = (price) => {
    return (profile?.points || 0) >= price
  }

  const currentItems = getItems(selectedCategory, selectedSubsection)
  const equippedItems = getEquippedItems()

  // Don't render if profile is not loaded yet
  if (!profile) {
    return (
      <div className="min-h-screen p-4">
        <Navigation />
        <div className="max-w-7xl mx-auto mt-8">
          <div className="glass p-8 rounded-2xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-lg">Loading shop...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <Navigation />
      
      <div className="max-w-7xl mx-auto mt-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🛍️ Cosmetic Shop
          </h1>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent">{profile.points || 0}</div>
            <div className="text-sm text-white/70">Points Available</div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Subsection Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {subsections[selectedCategory].map(subsection => (
            <button
              key={subsection.id}
              onClick={() => setSelectedSubsection(subsection.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                selectedSubsection === subsection.id
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{subsection.emoji}</span>
              {subsection.name}
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {currentItems.map(item => {
            const owned = isOwned(selectedCategory, item.id)
            const equipped = equippedItems[selectedCategory] === item.id
            
            return (
              <div key={item.id} className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300">
                {/* Preview */}
                {selectedCategory === 'banners' && item.preview && (
                  <div className={`w-full h-24 rounded-lg mb-4 ${item.preview}`}></div>
                )}
                
                {/* Icon/Emoji */}
                <div className="text-center mb-4">
                  <div className={`text-6xl mb-2 ${item.animation || ''}`}>{item.emoji}</div>
                  <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                  <p className="text-white/70 text-sm mb-3">{item.description}</p>
                  <div className="text-2xl font-bold text-accent mb-4">{item.price} pts</div>
                </div>
                
                {/* Status and Actions */}
                {owned ? (
                  <div className="text-center space-y-2">
                    <div className="text-primary font-semibold">✓ Owned</div>
                    {equipped ? (
                      <div className="text-sm text-accent">Currently equipped</div>
                    ) : (
                      <TwinkleButton
                        onClick={() => equipItem(selectedCategory, item.id)}
                        className="btn-secondary w-full"
                      >
                        🎯 Equip
                      </TwinkleButton>
                    )}
                  </div>
                ) : (
                  <TwinkleButton
                    onClick={() => handlePurchase(item)}
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
            )
          })}
        </div>

        {/* Currently Equipped Section */}
        <div className="glass p-6 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-4">Currently Equipped</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(category => {
              const equippedId = equippedItems[category.id]
              let equippedItem = null
              
              // Find the equipped item
              if (equippedId) {
                Object.keys(shopItems[category.id] || {}).forEach(subsection => {
                  const item = shopItems[category.id][subsection].find(item => item.id === equippedId)
                  if (item) {
                    equippedItem = { ...item, subsection }
                  }
                })
              }
              
              return (
                <div key={category.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className={`text-2xl ${equippedItem?.animation || ''}`}>
                    {equippedItem?.emoji || '❓'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-white/70">
                      {equippedItem?.name || 'Default'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips Section */}
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-2">💡 How to earn points:</h3>
          <ul className="space-y-1 text-white/70">
            <li>• Complete tasks: +10 points each</li>
            <li>• Finish Pomodoro sessions: +25 points each</li>
            <li>• Level up: +50 points bonus</li>
            <li>• Full moon bonus: Double points!</li>
          </ul>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={purchaseModal.isOpen}
        onClose={cancelPurchase}
        onConfirm={confirmPurchase}
        item={purchaseModal.item}
        currentPoints={profile.points || 0}
      />
    </div>
  )
}

export default Shop 