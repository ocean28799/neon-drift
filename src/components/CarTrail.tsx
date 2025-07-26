'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TrailEffect {
  id: string
  x: number
  y: number
  timestamp: number
}

interface CarTrailProps {
  playerX: number
  playerY: number
  boost: boolean
}

export default function CarTrail({ playerX, playerY, boost }: CarTrailProps) {
  const [trail, setTrail] = useState<TrailEffect[]>([])

  useEffect(() => {
    const addTrailPoint = () => {
      const newPoint: TrailEffect = {
        id: Math.random().toString(36).substr(2, 9),
        x: playerX + 3, // Center of car
        y: playerY + 8, // Behind the car
        timestamp: Date.now()
      }

      setTrail(prev => [
        ...prev.filter(point => Date.now() - point.timestamp < 500),
        newPoint
      ])
    }

    const interval = setInterval(addTrailPoint, boost ? 16 : 32)
    return () => clearInterval(interval)
  }, [playerX, playerY, boost])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {trail.map((point) => {
        const age = Date.now() - point.timestamp
        const opacity = Math.max(0, 1 - age / 500)
        const scale = Math.max(0.2, 1 - age / 500)
        
        return (
          <motion.div
            key={point.id}
            className={`absolute rounded-full ${
              boost 
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500'
            }`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: boost ? '6px' : '4px',
              height: boost ? '12px' : '8px',
              opacity,
              transform: `scale(${scale})`,
              boxShadow: boost 
                ? '0 0 10px rgba(251, 191, 36, 0.8)'
                : '0 0 8px rgba(6, 182, 212, 0.6)'
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )
      })}
    </div>
  )
}
