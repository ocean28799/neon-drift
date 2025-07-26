'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Star, Coins } from 'lucide-react'

interface PreviewItem {
  id: string
  type: 'obstacle' | 'powerup' | 'coin' | 'question'
  variant?: string
  lane: number // 0, 1, or 2 for left, center, right
  questionData?: {
    question: string
    correctAnswer: string
    wrongAnswer: string
    correctSide: 'left' | 'right'
  }
}

interface ItemPreviewProps {
  upcomingItems: PreviewItem[]
}

export default function ItemPreview({ upcomingItems }: ItemPreviewProps) {
  // Show next 6 items
  const previewItems = upcomingItems.slice(0, 6)

  const getItemIcon = (item: PreviewItem) => {
    if (item.type === 'obstacle') {
      return (
        <div className={`w-6 h-4 rounded relative ${
          item.variant === 'spike' 
            ? 'bg-gradient-to-b from-red-500 to-red-700' 
            : 'bg-gradient-to-b from-purple-600 to-purple-900'
        }`}>
          {/* Monster eyes */}
          <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
            <div className={`w-0.5 h-0.5 rounded-full ${
              item.variant === 'spike' ? 'bg-yellow-400' : 'bg-green-400'
            }`} />
            <div className={`w-0.5 h-0.5 rounded-full ${
              item.variant === 'spike' ? 'bg-yellow-400' : 'bg-green-400'
            }`} />
          </div>
          {/* Monster mouth */}
          <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
            <div className="w-2 h-0.5 bg-black rounded-full" />
          </div>
        </div>
      )
    } else if (item.type === 'coin') {
      return <Coins className="w-5 h-5 text-yellow-400" />
    } else if (item.type === 'powerup') {
      if (item.variant === 'shield') return <Shield className="w-5 h-5 text-blue-400" />
      if (item.variant === 'boost') return <Zap className="w-5 h-5 text-yellow-400" />
      return <Star className="w-5 h-5 text-purple-400" />
    } else if (item.type === 'question') {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">?</span>
        </div>
      )
    }
    return null
  }

  const getLanePosition = (lane: number) => {
    switch (lane) {
      case 0: return 'left-1/5'  // Closer to left edge
      case 1: return 'left-1/2'  // Center
      case 2: return 'left-4/5'  // Closer to right edge
      default: return 'left-1/2'
    }
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
      <motion.div 
        className="bg-black/40 backdrop-blur-lg rounded-lg p-3 border border-cyan-500/30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-cyan-400 text-xs font-semibold mb-2 text-center">
          INCOMING ITEMS
        </div>
        
        {/* Preview grid */}
        <div className="flex space-x-1">
          {previewItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
            >
              {/* Distance indicator */}
              <div className="text-gray-400 text-xs text-center mb-1">
                {index * 2 + 2}s
              </div>
              
              {/* Lane preview */}
              <div className="relative w-12 h-16 bg-gray-800/50 rounded border border-gray-600/50">
                {/* Lane dividers */}
                <div className="absolute left-1/3 top-0 w-px h-full bg-cyan-400/30" />
                <div className="absolute left-2/3 top-0 w-px h-full bg-cyan-400/30" />
                
                {/* Item position */}
                <div 
                  className={`absolute ${getLanePosition(item.lane)} top-1/2 transform -translate-x-1/2 -translate-y-1/2`}
                >
                  <motion.div
                    animate={{ 
                      rotate: item.type === 'coin' || item.type === 'powerup' ? [0, 360] : 0,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                  >
                    {getItemIcon(item)}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center space-x-3 mt-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded" />
            <span className="text-gray-400">Obstacle</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coins className="w-3 h-3 text-yellow-400" />
            <span className="text-gray-400">Coin</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-blue-400" />
            <span className="text-gray-400">Power</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
