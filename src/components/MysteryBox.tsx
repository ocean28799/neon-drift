import React from 'react'
import { motion } from 'framer-motion'
import { Gift, Star, Diamond, Zap } from 'lucide-react'

interface MysteryBoxProps {
  x: number
  y: number
  size?: 'small' | 'medium' | 'large'
  type?: 'common' | 'rare' | 'epic' | 'legendary'
  onCollect?: () => void
}

const boxTypes = {
  common: {
    color: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    icon: Gift,
    glow: 'shadow-gray-400/50'
  },
  rare: {
    color: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    icon: Star,
    glow: 'shadow-blue-400/50'
  },
  epic: {
    color: 'from-purple-400 to-purple-600',
    borderColor: 'border-purple-400',
    icon: Diamond,
    glow: 'shadow-purple-400/50'
  },
  legendary: {
    color: 'from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-400',
    icon: Zap,
    glow: 'shadow-yellow-400/50'
  }
}

const sizes = {
  small: 'w-6 h-6 md:w-8 md:h-8',
  medium: 'w-8 h-8 md:w-12 md:h-12',
  large: 'w-10 h-10 md:w-16 md:h-16'
}

export default function MysteryBox({ 
  x, 
  y, 
  size = 'medium', 
  type = 'common',
  onCollect 
}: MysteryBoxProps) {
  const boxConfig = boxTypes[type]
  const sizeClass = sizes[size]
  const IconComponent = boxConfig.icon

  return (
    <motion.div
      className={`absolute ${sizeClass} pointer-events-none`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: 40
      }}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: 1, 
        rotate: [0, 10, -10, 0],
        y: [0, -2, 0]
      }}
      transition={{ 
        scale: { duration: 0.3 },
        rotate: { duration: 2, repeat: Infinity },
        y: { duration: 1.5, repeat: Infinity }
      }}
      onClick={onCollect}
    >
      {/* Main box container */}
      <motion.div
        className={`w-full h-full bg-gradient-to-br ${boxConfig.color} ${boxConfig.borderColor} border-2 rounded-lg relative overflow-hidden`}
        animate={{
          boxShadow: [
            `0 0 10px ${boxConfig.glow}`,
            `0 0 20px ${boxConfig.glow}`,
            `0 0 10px ${boxConfig.glow}`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-1 bg-white/20 rounded-sm" />
        
        {/* Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IconComponent className="w-1/2 h-1/2 text-white drop-shadow-md" />
        </div>
        
        {/* Sparkle effects for rare+ boxes */}
        {type !== 'common' && (
          <>
            <motion.div
              className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
            />
            <motion.div
              className="absolute top-1/2 right-1 w-0.5 h-0.5 bg-white rounded-full"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
          </>
        )}
        
        {/* Question mark for mystery effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white font-bold text-xs opacity-60">?</div>
        </div>
      </motion.div>
      
      {/* Floating particles for legendary boxes */}
      {type === 'legendary' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 2) * 40}%`
              }}
              animate={{
                y: [-10, 10],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
