'use client'

import { useState, useEffect } from 'react'
import NeonDriftGame from './NeonDriftGame'
import NeonDriftGameDesktop from './NeonDriftGameDesktop'

interface Car {
  id: string
  name: string
  color: string
  gradient: string
  speed: number
  handling: number
  shield: number
  unlocked: boolean
  price?: number
}

interface NeonDriftGameWrapperProps {
  onGameEnd: (score: number) => void
  onPause: () => void
  onLanguageLearning?: () => void
  onSpeedChange?: (speed: number) => void
  onRoundComplete?: (roundId: string) => void
  selectedCar: Car
  selectedChapter: string
  selectedRound?: string
}

export default function NeonDriftGameWrapper(props: NeonDriftGameWrapperProps) {
  const [isDesktop, setIsDesktop] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDeviceType = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      // Consider it desktop if:
      // 1. Not a mobile user agent AND
      // 2. Screen width >= 1024px AND  
      // 3. Either no touch support OR aspect ratio is landscape (width > height)
      const isDesktopDevice = !isMobile && 
                              screenWidth >= 1024 && 
                              (!isTouch || screenWidth > screenHeight)
      
      console.log('Device detection:', {
        userAgent: userAgent.substring(0, 50),
        isMobile,
        isTouch,
        screenWidth,
        screenHeight,
        aspectRatio: screenWidth / screenHeight,
        isDesktopDevice
      })
      
      setIsDesktop(isDesktopDevice)
      setIsLoading(false)
    }

    // Check on mount
    checkDeviceType()
    
    // Check on resize
    window.addEventListener('resize', checkDeviceType)
    window.addEventListener('orientationchange', () => {
      // Delay to allow orientation change to complete
      setTimeout(checkDeviceType, 500)
    })

    return () => {
      window.removeEventListener('resize', checkDeviceType)
      window.removeEventListener('orientationchange', checkDeviceType)
    }
  }, [])

  // Show loading while detecting device type
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-cyan-400 text-2xl font-bold mb-4">Neon Drift</div>
          <div className="text-white">Detecting device type...</div>
          <div className="mt-4">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show desktop version for desktop devices
  if (isDesktop) {
    return <NeonDriftGameDesktop {...props} />
  }

  // Show mobile version for mobile devices
  return <NeonDriftGame {...props} />
}
