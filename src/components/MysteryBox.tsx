'use client'

import { motion } from 'framer-motion'
import { Gift, Star, Zap } from 'lucide-react'

interface MysteryBoxProps {
  x: number
  y: number
  width: number
  height: number
  isCorrect: boolean
  answer: string
  lane: 'left' | 'right'
}

export default function MysteryBox({ 
  x, 
  y, 
  width, 
  height, 
  isCorrect, 
  answer, 
  lane 
}: MysteryBoxProps) {
  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        y: [0, -5, 0],
      }}
      transition={{
        scale: { duration: 0.3, ease: "backOut" },
        opacity: { duration: 0.3 },
        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* Outer glow effect */}
      <div 
        className={`absolute inset-0 rounded-xl blur-sm ${
          isCorrect 
            ? 'bg-gradient-to-b from-emerald-400 to-green-500' 
            : 'bg-gradient-to-b from-purple-400 to-indigo-500'
        }`}
        style={{ transform: 'scale(1.1)' }}
      />
      
      {/* Main mystery box */}
      <motion.div
        className={`relative rounded-xl border-2 backdrop-blur-sm ${
          isCorrect 
            ? 'bg-gradient-to-b from-emerald-500/95 to-green-600/95 border-emerald-300/80 shadow-2xl shadow-emerald-500/60' 
            : 'bg-gradient-to-b from-purple-500/95 to-indigo-600/95 border-purple-300/80 shadow-2xl shadow-purple-500/60'
        } h-full`}
        animate={{
          boxShadow: isCorrect 
            ? ['0 0 30px #10b981', '0 0 50px #10b981', '0 0 30px #10b981']
            : ['0 0 30px #8b5cf6', '0 0 50px #8b5cf6', '0 0 30px #8b5cf6']
        }}
        transition={{
          boxShadow: { duration: 1.5, repeat: Infinity }
        }}
      >
        <div className="flex flex-col items-center justify-center h-full p-2">
          {/* Icon section */}
          <motion.div 
            className="flex items-center gap-1 mb-2"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Gift className="w-6 h-6 text-white drop-shadow-lg" />
            {isCorrect ? (
              <Star className="w-4 h-4 text-yellow-300 drop-shadow-lg" />
            ) : (
              <Zap className="w-4 h-4 text-orange-300 drop-shadow-lg" />
            )}
          </motion.div>
          
          {/* Answer text */}
          <div className={`text-white text-sm font-bold text-center leading-tight drop-shadow-lg ${
            answer.length > 8 ? 'text-xs' : 'text-sm'
          }`}>
            {answer}
          </div>
        </div>
        
        {/* Sparkle effects */}
        {isCorrect && (
          <>
            <motion.div
              className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.div
              className="absolute top-1/2 left-1 w-1 h-1 bg-yellow-300 rounded-full"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
