import { useState, useEffect } from 'react'

export const useProfile = () => {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedProfile = localStorage.getItem('homework-hypothesis-profile')
    console.log('Loading profile from localStorage:', savedProfile)
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        console.log('Parsed profile:', parsedProfile)
        setProfile(parsedProfile)
      } catch (error) {
        console.error('Error parsing profile:', error)
        localStorage.removeItem('homework-hypothesis-profile')
      }
    }
    setIsLoading(false)
  }, [])

  const saveProfile = (newProfile) => {
    console.log('Saving profile:', newProfile)
    setProfile(newProfile)
    localStorage.setItem('homework-hypothesis-profile', JSON.stringify(newProfile))
  }

  const deleteProfile = () => {
    console.log('Deleting profile')
    setProfile(null)
    localStorage.removeItem('homework-hypothesis-profile')
  }

  return { profile, saveProfile, deleteProfile, isLoading }
} 