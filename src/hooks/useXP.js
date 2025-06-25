import { useProfile } from './useProfile'
import { levelTitles } from '../data/levelTitles'

export const useXP = () => {
  const { profile } = useProfile()
  
  const xp = profile?.xp || 0
  const level = Math.floor(xp / 100) + 1
  const levelTitle = levelTitles[Math.floor((level - 1) / 5) * 5] || levelTitles[0]
  
  const xpForNextLevel = level * 100
  const xpProgress = xp % 100
  
  return {
    xp,
    level,
    levelTitle,
    xpForNextLevel,
    xpProgress
  }
} 