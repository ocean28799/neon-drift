'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface AnswerBoxProps {
  id: string
  x: number
  y: number
  width: number
  height: number
  isCorrect: boolean
  answer: string
  lane: 'left' | 'right'
  color: string
}

export default function AnswerBox({
  x,
  y,
  width,
  height,
  isCorrect,
  answer
}: AnswerBoxProps) {
  const [isHovered, setIsHovered] = useState(false)
  // Determine background color based on correctness
  const getBackgroundColor = () => {
    if (isCorrect) {
      return {
        primary: 'from-green-500 via-green-600 to-green-700',
        secondary: 'from-green-400 to-green-500',
        border: 'border-green-300/50',
        shadow: 'shadow-green-500/40',
        accent: 'bg-green-300',
        glow: '#22c55e'
      }
    } else {
      return {
        primary: 'from-red-500 via-red-600 to-red-700',
        secondary: 'from-red-400 to-red-500',
        border: 'border-red-300/50',
        shadow: 'shadow-red-500/40',
        accent: 'bg-red-300',
        glow: '#ef4444'
      }
    }
  }

  const colors = getBackgroundColor()

  return (
    <motion.div
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, rotate: -5, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 5, opacity: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.6 
      }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Outer glow effect */}
      <div 
        className="absolute inset-0 rounded-2xl blur-lg opacity-60"
        style={{
          background: `linear-gradient(135deg, ${colors.glow}40, ${colors.glow}20)`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)'
        }}
      />

      {/* Main container with modern glass morphism */}
      <div 
        className={`relative w-full h-full bg-gradient-to-br ${colors.primary} rounded-2xl border ${colors.border} ${colors.shadow} backdrop-blur-xl overflow-hidden`}
        style={{
          background: `linear-gradient(135deg, ${colors.glow}dd, ${colors.glow}aa)`,
          boxShadow: `
            0 8px 32px ${colors.glow}40,
            0 2px 8px ${colors.glow}30,
            inset 0 1px 0 rgba(255,255,255,0.3),
            inset 0 -1px 0 rgba(0,0,0,0.2)
          `
        }}
      >
        {/* Top glass reflection */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
          }}
        />
        
        {/* Side highlights */}
        <div className="absolute top-2 left-2 w-1 h-1/3 bg-white/30 rounded-full" />
        <div className="absolute top-2 right-2 w-1 h-1/3 bg-white/30 rounded-full" />
        
        {/* Modern geometric accents */}
        <div className="absolute top-3 left-3">
          <div className="w-2 h-2 bg-white/40 rounded-full" />
        </div>
        <div className="absolute top-3 right-3">
          <div className="w-1.5 h-1.5 bg-white/30 rotate-45" />
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="w-1.5 h-1.5 bg-white/20 rounded-sm" />
        </div>
        
        {/* Content area with better typography */}
        <div className="absolute inset-0 flex items-center justify-center p-3">
          <div className="text-center">
            <div 
              className="text-white font-bold text-base leading-tight drop-shadow-2xl"
              style={{
                textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 16px rgba(0,0,0,0.4)',
                fontSize: 'clamp(0.75rem, 2vw, 1rem)'
              }}
            >
              {answer}
            </div>
          </div>
        </div>

        {/* Hover Preview Effect */}
        {isHovered && (
          <motion.div
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm ${
              isCorrect 
                ? 'bg-green-500/90 shadow-[0_0_15px_rgba(34,197,94,0.6)]' 
                : 'bg-red-500/90 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
            }`}>
              {isCorrect ? '✓ CORRECT CHOICE' : '✗ INCORRECT CHOICE'}
            </div>
          </motion.div>
        )}

        {/* Enhanced Hover Particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-1 h-1 rounded-full ${
                  isCorrect ? 'bg-green-300' : 'bg-red-300'
                }`}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
        
        {/* Correct answer special effects */}
        {isCorrect && (
          <>
            {/* Success pulse animation */}
            <motion.div 
              className="absolute inset-0 bg-green-300/30 rounded-2xl"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Success badge */}
            <div className="absolute -top-2 -right-2">
              <motion.div
                className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              >
                <span className="text-white text-xs font-bold">✓</span>
              </motion.div>
            </div>
            
            {/* Floating sparkles */}
            <motion.div
              className="absolute -top-1 left-1/4 w-2 h-2 bg-yellow-300 rounded-full"
              animate={{ 
                y: [-2, -6, -2],
                opacity: [0.8, 1, 0.8],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute -top-1 right-1/4 w-1.5 h-1.5 bg-cyan-300 rounded-full"
              animate={{ 
                y: [-1, -4, -1],
                opacity: [0.6, 1, 0.6],
                scale: [0.6, 1, 0.6]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity,
                delay: 1
              }}
            />
          </>
        )}

        {/* Wrong answer effects */}
        {!isCorrect && (
          <>
            {/* Error indicator */}
            <div className="absolute -top-2 -right-2">
              <motion.div
                className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              >
                <span className="text-white text-xs font-bold">✗</span>
              </motion.div>
            </div>
          </>
        )}
        
        {/* Bottom gradient accent */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-3 rounded-b-2xl opacity-50"
          style={{
            background: `linear-gradient(to top, ${colors.glow}60, transparent)`
          }}
        />
      </div>
      
      {/* Floating animation */}
      <motion.div
        className="absolute inset-0"
        animate={{ 
          y: [0, -3, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Interactive hover effect */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-2xl opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  )
}
