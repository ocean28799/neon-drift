'use client'

import { motion } from 'framer-motion'

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

interface Car3DProps {
  car: Car
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

export default function Car3D({ car, size = 'medium', animated = true }: Car3DProps) {
  const sizeClasses = {
    small: { container: 'w-12 h-20' },
    medium: { container: 'w-20 h-32' },
    large: { container: 'w-32 h-48' }
  }
  
  const { container } = sizeClasses[size]
  
  const carColors = {
    cyan: {
      primary: 'from-cyan-400 to-cyan-600',
      secondary: 'from-cyan-300 to-cyan-500',
      accent: '#06b6d4',
      glow: '0 0 20px #06b6d4'
    },
    purple: {
      primary: 'from-purple-400 to-purple-600',
      secondary: 'from-purple-300 to-purple-500',
      accent: '#8b5cf6',
      glow: '0 0 20px #8b5cf6'
    },
    yellow: {
      primary: 'from-yellow-400 to-orange-500',
      secondary: 'from-yellow-300 to-orange-400',
      accent: '#f59e0b',
      glow: '0 0 20px #f59e0b'
    },
    blue: {
      primary: 'from-blue-400 to-blue-600',
      secondary: 'from-blue-300 to-blue-500',
      accent: '#3b82f6',
      glow: '0 0 20px #3b82f6'
    },
    red: {
      primary: 'from-red-500 to-red-700',
      secondary: 'from-red-400 to-red-600',
      accent: '#ef4444',
      glow: '0 0 20px #ef4444'
    },
    black: {
      primary: 'from-gray-700 to-black',
      secondary: 'from-gray-600 to-gray-800',
      accent: '#374151',
      glow: '0 0 20px #374151'
    },
    rainbow: {
      primary: 'from-pink-500 via-purple-500 via-blue-500 via-cyan-500 to-emerald-500',
      secondary: 'from-pink-400 via-purple-400 via-blue-400 via-cyan-400 to-emerald-400',
      accent: '#8b5cf6',
      glow: '0 0 30px #8b5cf6, 0 0 60px #06b6d4, 0 0 90px #ec4899'
    }
  }
  
  const colorScheme = carColors[car.color as keyof typeof carColors] || carColors.cyan

  return (
    <motion.div
      className={`relative ${container} mx-auto`}
      style={{ perspective: '1000px' }}
      animate={animated ? {
        rotateY: [0, 5, -5, 0],
        y: [0, -2, 0]
      } : {}}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Car container with 3D transform */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={animated ? {
          rotateX: [0, 2, 0]
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Main car body */}
        <motion.div
          className={`absolute inset-x-2 top-4 bottom-2 bg-gradient-to-b ${colorScheme.primary} rounded-xl shadow-2xl`}
          style={{
            boxShadow: colorScheme.glow,
            transform: 'translateZ(10px)'
          }}
          animate={animated ? {
            boxShadow: [
              colorScheme.glow,
              `${colorScheme.glow}, 0 0 40px ${colorScheme.accent}`,
              colorScheme.glow
            ]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          {/* Front section */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-6 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-lg opacity-80">
            {/* Windshield */}
            <div className="absolute inset-1 bg-gradient-to-b from-blue-100 to-blue-300 rounded-t-md opacity-70" />
          </div>
          
          {/* Side windows */}
          <div className="absolute top-8 left-1 w-1 h-8 bg-gradient-to-b from-blue-100 to-blue-300 rounded opacity-60" />
          <div className="absolute top-8 right-1 w-1 h-8 bg-gradient-to-b from-blue-100 to-blue-300 rounded opacity-60" />
          
          {/* Racing stripes */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white opacity-50 rounded" />
          <div className="absolute inset-x-1 top-1/2 mt-2 h-0.5 bg-white opacity-30 rounded" />
          
          {/* Side mirrors */}
          <div className="absolute top-6 -left-0.5 w-1 h-1 bg-gray-400 rounded-full" />
          <div className="absolute top-6 -right-0.5 w-1 h-1 bg-gray-400 rounded-full" />
          
          {/* Door lines */}
          <div className="absolute top-10 left-1 right-1 h-px bg-black opacity-20" />
        </motion.div>
        
        {/* Front bumper */}
        <div 
          className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r ${colorScheme.secondary} rounded-full`}
          style={{ transform: 'translateZ(15px)' }}
        >
          {/* Headlights */}
          <motion.div
            className="absolute top-0.5 left-1 w-1 h-1 bg-white rounded-full"
            animate={animated ? {
              opacity: [1, 0.3, 1]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          />
          <motion.div
            className="absolute top-0.5 right-1 w-1 h-1 bg-white rounded-full"
            animate={animated ? {
              opacity: [1, 0.3, 1]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.3
            }}
          />
          
          {/* License plate */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-white rounded-full opacity-80" />
        </div>
        
        {/* Wheels */}
        <motion.div
          className="absolute bottom-3 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600"
          style={{ transform: 'translateZ(5px)' }}
          animate={animated ? {
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full" />
          <div className="absolute inset-1 bg-gray-800 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-gray-500 rounded-full" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-3 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600"
          style={{ transform: 'translateZ(5px)' }}
          animate={animated ? {
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full" />
          <div className="absolute inset-1 bg-gray-800 rounded-full" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-0.5 bg-gray-500 rounded-full" />
        </motion.div>
        
        {/* Rear wheels */}
        <motion.div
          className="absolute top-6 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600"
          style={{ transform: 'translateZ(5px)' }}
          animate={animated ? {
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full" />
          <div className="absolute inset-1 bg-gray-800 rounded-full" />
        </motion.div>
        
        <motion.div
          className="absolute top-6 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600"
          style={{ transform: 'translateZ(5px)' }}
          animate={animated ? {
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="absolute inset-0.5 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full" />
          <div className="absolute inset-1 bg-gray-800 rounded-full" />
        </motion.div>
        
        {/* Spoiler */}
        <div 
          className={`absolute top-2 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r ${colorScheme.secondary} rounded-full`}
          style={{ transform: 'translateZ(20px)' }}
        />
        
        {/* Exhaust pipes */}
        <div className="absolute bottom-0 left-2 w-0.5 h-1 bg-gray-600 rounded-full" />
        <div className="absolute bottom-0 right-2 w-0.5 h-1 bg-gray-600 rounded-full" />
      </motion.div>
      
      {/* Ground reflection */}
      <motion.div
        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r ${colorScheme.primary} opacity-20 blur-sm rounded-full`}
        animate={animated ? {
          scaleX: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      />
    </motion.div>
  )
}
