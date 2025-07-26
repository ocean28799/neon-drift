'use client'

import { motion } from 'framer-motion'

interface MonsterObstacleProps {
  variant?: string
  x: number
  y: number
  width: number
  height: number
}

export default function MonsterObstacle({ variant, x, y, width, height }: MonsterObstacleProps) {
  const getMonsterDesign = () => {
    switch (variant) {
      case 'spike':
        return (
          <motion.div
            className="relative w-full h-full bg-gradient-to-b from-red-500 to-red-800 rounded-lg"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [-2, 2, -2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Monster body */}
            <div className="absolute inset-0 rounded-lg border-2 border-red-400">
              {/* Eyes */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <motion.div
                  className="w-1 h-1 bg-yellow-400 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="w-1 h-1 bg-yellow-400 rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
                />
              </div>
              
              {/* Mouth/Spikes */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-px">
                  <div className="w-px h-2 bg-white" />
                  <div className="w-px h-1 bg-white" />
                  <div className="w-px h-2 bg-white" />
                  <div className="w-px h-1 bg-white" />
                  <div className="w-px h-2 bg-white" />
                </div>
              </div>
              
              {/* Spiky edges */}
              <div className="absolute -top-1 left-0 right-0 flex justify-center space-x-1">
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-red-600" />
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-red-600" />
                <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-red-600" />
              </div>
            </div>
          </motion.div>
        )
        
      case 'block':
      default:
        return (
          <motion.div
            className="relative w-full h-full bg-gradient-to-b from-purple-600 to-purple-900 rounded-lg"
            animate={{
              scale: [1, 1.03, 1],
              boxShadow: [
                '0 0 10px rgba(147, 51, 234, 0.5)',
                '0 0 20px rgba(147, 51, 234, 0.8)',
                '0 0 10px rgba(147, 51, 234, 0.5)'
              ]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Monster body */}
            <div className="absolute inset-0 rounded-lg border-2 border-purple-400">
              {/* Eyes */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <motion.div
                  className="w-1 h-1 bg-green-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1] 
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <motion.div
                  className="w-1 h-1 bg-green-400 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1] 
                  }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                />
              </div>
              
              {/* Tentacles/Arms */}
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2">
                <motion.div
                  className="w-2 h-1 bg-purple-500 rounded-full"
                  animate={{ 
                    x: [-2, 2, -2],
                    rotate: [-10, 10, -10] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2">
                <motion.div
                  className="w-2 h-1 bg-purple-500 rounded-full"
                  animate={{ 
                    x: [2, -2, 2],
                    rotate: [10, -10, 10] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              {/* Mouth */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                <motion.div
                  className="w-3 h-1 bg-black rounded-full"
                  animate={{ 
                    scaleY: [1, 1.5, 1],
                    scaleX: [1, 0.8, 1] 
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              
              {/* Glowing core */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  className="w-2 h-2 bg-purple-300 rounded-full opacity-70"
                  animate={{ 
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.5, 1, 0.5] 
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )
    }
  }

  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    >
      {getMonsterDesign()}
    </div>
  )
}
