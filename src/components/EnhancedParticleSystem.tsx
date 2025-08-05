import React from 'react'
import { motion } from 'framer-motion'

interface EnhancedParticleSystemProps {
  particles: Array<{
    id: string
    x: number
    y: number
    type?: 'success' | 'error' | 'boost' | 'combo' | 'level-up' | 'coin'
    color?: string
  }>
}

export default function EnhancedParticleSystem({ particles }: EnhancedParticleSystemProps) {
  const getParticleConfig = (type?: string) => {
    switch (type) {
      case 'success':
        return {
          colors: ['#10b981', '#34d399', '#6ee7b7', '#ffffff'],
          size: [2, 4, 6],
          duration: 1.5,
          spread: 30
        }
      case 'error':
        return {
          colors: ['#ef4444', '#f87171', '#fca5a5', '#ffffff'],
          size: [2, 3, 4],
          duration: 1.0,
          spread: 20
        }
      case 'boost':
        return {
          colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
          size: [3, 5, 7],
          duration: 2.0,
          spread: 40
        }
      case 'combo':
        return {
          colors: ['#f59e0b', '#fbbf24', '#fde047', '#ffffff'],
          size: [4, 6, 8],
          duration: 2.5,
          spread: 50
        }
      case 'level-up':
        return {
          colors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ffffff'],
          size: [5, 8, 12],
          duration: 3.0,
          spread: 60
        }
      case 'coin':
        return {
          colors: ['#eab308', '#facc15', '#fef08a', '#ffffff'],
          size: [2, 3, 4],
          duration: 1.2,
          spread: 25
        }
      default:
        return {
          colors: ['#06b6d4', '#67e8f9', '#a5f3fc', '#ffffff'],
          size: [2, 4, 6],
          duration: 1.5,
          spread: 30
        }
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {particles.map((particle) => {
        const config = getParticleConfig(particle.type)
        
        return (
          <div key={particle.id}>
            {/* Multiple particle burst for each point */}
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2
              const distance = Math.random() * config.spread
              const offsetX = Math.cos(angle) * distance
              const offsetY = Math.sin(angle) * distance
              const color = config.colors[Math.floor(Math.random() * config.colors.length)]
              const size = config.size[Math.floor(Math.random() * config.size.length)]
              
              return (
                <motion.div
                  key={`${particle.id}-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    boxShadow: `0 0 ${size * 2}px ${color}`,
                  }}
                  initial={{
                    scale: 0,
                    opacity: 1,
                    x: 0,
                    y: 0
                  }}
                  animate={{
                    scale: [0, 1, 0.5, 0],
                    opacity: [1, 1, 0.5, 0],
                    x: offsetX,
                    y: offsetY - 20,
                  }}
                  transition={{
                    duration: config.duration,
                    ease: "easeOut",
                    delay: Math.random() * 0.3
                  }}
                />
              )
            })}
            
            {/* Central star burst */}
            <motion.div
              className="absolute"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: '20px',
                height: '20px',
                marginLeft: '-10px',
                marginTop: '-10px'
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.5, 0],
                rotate: [0, 360],
                opacity: [1, 1, 0]
              }}
              transition={{
                duration: config.duration * 0.7,
                ease: "easeOut"
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"
                  fill={config.colors[0]}
                  stroke={config.colors[3]}
                  strokeWidth="1"
                  style={{
                    filter: `drop-shadow(0 0 6px ${config.colors[0]})`
                  }}
                />
              </svg>
            </motion.div>
            
            {/* Ring expansion effect */}
            <motion.div
              className="absolute border-2 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                borderColor: config.colors[1],
                transformOrigin: 'center'
              }}
              initial={{
                width: '0px',
                height: '0px',
                marginLeft: '0px',
                marginTop: '0px',
                opacity: 1
              }}
              animate={{
                width: `${config.spread * 2}px`,
                height: `${config.spread * 2}px`,
                marginLeft: `-${config.spread}px`,
                marginTop: `-${config.spread}px`,
                opacity: 0
              }}
              transition={{
                duration: config.duration * 0.8,
                ease: "easeOut"
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
