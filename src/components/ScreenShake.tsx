'use client'

import { useEffect, useState } from 'react'

interface ScreenShakeProps {
  intensity: number
  duration: number
  trigger: number // Change this value to trigger shake
  children: React.ReactNode
}

export default function ScreenShake({ intensity, duration, trigger, children }: ScreenShakeProps) {
  const [shakeStyle, setShakeStyle] = useState({})

  useEffect(() => {
    if (trigger > 0) {
      const shake = () => {
        const x = (Math.random() - 0.5) * intensity
        const y = (Math.random() - 0.5) * intensity
        
        setShakeStyle({
          transform: `translate(${x}px, ${y}px)`,
          transition: 'transform 0.05s ease-out'
        })
      }

      const shakeInterval = setInterval(shake, 50)
      
      const shakeTimeout = setTimeout(() => {
        clearInterval(shakeInterval)
        setShakeStyle({
          transform: 'translate(0px, 0px)',
          transition: 'transform 0.2s ease-out'
        })
      }, duration)

      return () => {
        clearInterval(shakeInterval)
        clearTimeout(shakeTimeout)
      }
    }
  }, [trigger, intensity, duration])

  return (
    <div style={shakeStyle} className="w-full h-full">
      {children}
    </div>
  )
}
