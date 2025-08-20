'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnswerBoxDesktopProps {
  id: string
  x: number
  y: number
  width: number
  height: number
  isCorrect: boolean
  answer: string
  lane: 'top' | 'bottom'
  color: string
}

export default function AnswerBoxDesktop({
  x,
  y,
  width,
  height,
  isCorrect,
  answer,
  lane,
  color
}: AnswerBoxDesktopProps) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <motion.div
      className={`absolute z-30 ${color} rounded-lg border-2 border-white/30 shadow-lg backdrop-blur-sm`}
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
        boxShadow: isCorrect 
          ? ['0 0 0px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.8)', '0 0 0px rgba(34, 197, 94, 0.5)']
          : ['0 0 0px rgba(239, 68, 68, 0.5)', '0 0 20px rgba(239, 68, 68, 0.8)', '0 0 0px rgba(239, 68, 68, 0.5)']
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
        boxShadow: { duration: 2, repeat: Infinity }
      }}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Lane indicator */}
      <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded text-xs font-bold ${
        lane === 'top' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
      }`}>
        {lane === 'top' ? 'TOP' : 'BOTTOM'}
      </div>
      
      {/* Answer text */}
      <div className="flex items-center justify-center h-full p-2">
        <div className="text-white text-sm font-bold text-center leading-tight">
          {answer}
        </div>
      </div>
      
      {/* Correct/Incorrect indicator (subtle) */}
      <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
        isCorrect ? 'bg-green-400' : 'bg-red-400'
      } opacity-60`} />

      {/* Enhanced Hover Preview */}
      {isHovered && (
        <>
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`px-2 py-1 rounded text-xs font-bold text-white backdrop-blur-sm ${
              isCorrect 
                ? 'bg-green-500/90 shadow-[0_0_10px_rgba(34,197,94,0.6)]' 
                : 'bg-red-500/90 shadow-[0_0_10px_rgba(239,68,68,0.6)]'
            }`}>
              {isCorrect ? '✓ CORRECT' : '✗ WRONG'}
            </div>
          </motion.div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: isCorrect 
                ? 'linear-gradient(45deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))'
                : 'linear-gradient(45deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))',
              boxShadow: isCorrect
                ? '0 0 20px rgba(34, 197, 94, 0.3)'
                : '0 0 20px rgba(239, 68, 68, 0.3)'
            }}
          />
        </>
      )}
    </motion.div>
  )
}
