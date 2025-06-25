import { useState, useEffect } from 'react'
import shopItemsData from '../data/shopItems.json'

export const useShop = () => {
  const [shopItems, setShopItems] = useState(shopItemsData)
  const [ownedCosmetics, setOwnedCosmetics] = useState({
    banners: [],
    icons: [],
    themes: []
  })

  // Load owned cosmetics from localStorage
  useEffect(() => {
    const savedOwned = localStorage.getItem('homework-hypothesis-owned-cosmetics')
    if (savedOwned) {
      try {
        const parsed = JSON.parse(savedOwned)
        setOwnedCosmetics(parsed)
      } catch (error) {
        console.error('Error parsing owned cosmetics:', error)
        localStorage.removeItem('homework-hypothesis-owned-cosmetics')
      }
    }
  }, [])

  // Save owned cosmetics to localStorage
  const saveOwnedCosmetics = (newOwned) => {
    setOwnedCosmetics(newOwned)
    localStorage.setItem('homework-hypothesis-owned-cosmetics', JSON.stringify(newOwned))
  }

  // Check if an item is owned
  const isOwned = (category, itemId) => {
    return ownedCosmetics[category]?.includes(itemId) || false
  }

  // Purchase an item
  const purchaseItem = (category, subsection, item, currentPoints) => {
    if (currentPoints >= item.price && !isOwned(category, item.id)) {
      const newOwned = {
        ...ownedCosmetics,
        [category]: [...(ownedCosmetics[category] || []), item.id]
      }
      saveOwnedCosmetics(newOwned)
      return true // Purchase successful
    }
    return false // Purchase failed
  }

  // Get all items for a category and subsection
  const getItems = (category, subsection) => {
    return shopItems[category]?.[subsection] || []
  }

  // Get all owned items for a category
  const getOwnedItems = (category) => {
    const ownedIds = ownedCosmetics[category] || []
    const allItems = []
    
    // Get items from all subsections
    Object.keys(shopItems[category] || {}).forEach(subsection => {
      shopItems[category][subsection].forEach(item => {
        if (ownedIds.includes(item.id)) {
          allItems.push({ ...item, subsection })
        }
      })
    })
    
    return allItems
  }

  // Get currently equipped items
  const getEquippedItems = () => {
    const equipped = localStorage.getItem('homework-hypothesis-equipped-cosmetics')
    if (equipped) {
      try {
        return JSON.parse(equipped)
      } catch (error) {
        console.error('Error parsing equipped cosmetics:', error)
        localStorage.removeItem('homework-hypothesis-equipped-cosmetics')
      }
    }
    return {
      banners: null,
      icons: null,
      themes: null
    }
  }

  // Equip an item
  const equipItem = (category, itemId) => {
    const equipped = getEquippedItems()
    const newEquipped = {
      ...equipped,
      [category]: itemId
    }
    localStorage.setItem('homework-hypothesis-equipped-cosmetics', JSON.stringify(newEquipped))
  }

  // Get equipped item details
  const getEquippedItem = (category) => {
    const equipped = getEquippedItems()
    const equippedId = equipped[category]
    
    if (!equippedId) return null
    
    // Search through all subsections to find the item
    for (const subsection of Object.keys(shopItems[category] || {})) {
      const item = shopItems[category][subsection].find(item => item.id === equippedId)
      if (item) {
        return { ...item, subsection }
      }
    }
    
    return null
  }

  return {
    shopItems,
    ownedCosmetics,
    isOwned,
    purchaseItem,
    getItems,
    getOwnedItems,
    getEquippedItems,
    equipItem,
    getEquippedItem
  }
} 