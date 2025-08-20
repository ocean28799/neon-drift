import React from 'react'
import { motion } from 'framer-motion'
import { Check, X, Sparkles, Zap } from 'lucide-react'

interface ModernAnswerBoxProps {
  answer: string
  isCorrect: boolean
  position: { x: number; y: number }
  onAnswer: (correct: boolean) => void
  isPowerUp?: boolean
  powerUpType?: 'boost' | 'shield' | 'points'
  isActive?: boolean
  difficulty?: 'easy' | 'medium' | 'hard'
}

const powerUpColors = {
  boost: 'from-yellow-400 to-orange-500',
  shield: 'from-blue-400 to-blue-600',
  points: 'from-green-400 to-emerald-500'
}

const powerUpIcons = {
  boost: Zap,
  shield: Check,
  points: Sparkles
}

const difficultyColors = {
  easy: 'from-green-400 to-emerald-500',
  medium: 'from-yellow-400 to-orange-500',
  hard: 'from-red-400 to-red-600'
}

export default function ModernAnswerBox({
  answer,
  isCorrect,
  position,
  onAnswer,
  isPowerUp = false,
  powerUpType = 'points',
  isActive = true,
  difficulty = 'easy'
}: ModernAnswerBoxProps) {
  const [isAnswered, setIsAnswered] = React.useState(false)
  const [showFeedback, setShowFeedback] = React.useState(false)
  const [showPreview, setShowPreview] = React.useState(false)

  const handleClick = () => {
    if (isAnswered || !isActive) return
    
    setIsAnswered(true)
    setShowFeedback(true)
    
    // Delay callback to show feedback animation
    setTimeout(() => {
      onAnswer(isCorrect)
    }, 500)
  }

  const handleHover = () => {
    if (!isAnswered && isActive) {
      setShowPreview(true)
      
      // Auto-hide preview after 2 seconds
      setTimeout(() => {
        setShowPreview(false)
      }, 2000)
    }
  }

  const handleHoverEnd = () => {
    setShowPreview(false)
  }

  const PowerUpIcon = isPowerUp ? powerUpIcons[powerUpType] : null
  const gradientColor = isPowerUp ? powerUpColors[powerUpType] : difficultyColors[difficulty]

  return (
    <motion.div
      className="absolute pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
      initial={{ 
        opacity: 0, 
        scale: 0.3, 
        y: 20,
        rotateX: -90
      }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        scale: isActive ? 1 : 0.8, 
        y: 0,
        rotateX: 0,
        rotateY: isPowerUp ? [0, 5, -5, 0] : 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.3, 
        y: -20,
        rotateX: 90
      }}
      transition={{ 
        duration: 0.5, 
        type: "spring", 
        damping: 15,
        rotateY: isPowerUp ? { duration: 2, repeat: Infinity } : undefined
      }}
      whileHover={{ 
        scale: isActive ? 1.05 : 0.8, 
        y: isActive ? -5 : 0,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: isActive ? 0.95 : 0.8 }}
      onHoverStart={handleHover}
      onHoverEnd={handleHoverEnd}
    >
      <motion.button
        onClick={handleClick}
        disabled={isAnswered || !isActive}
        className={`
          relative min-w-[120px] px-6 py-4 rounded-2xl font-bold text-white
          border-2 backdrop-blur-xl transition-all duration-300
          ${isAnswered 
            ? isCorrect 
              ? 'bg-green-500/20 border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)]' 
              : 'bg-red-500/20 border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.6)]'
            : isPowerUp
              ? `bg-gradient-to-r ${gradientColor} border-white/50 shadow-[0_0_20px_rgba(255,255,255,0.4)]`
              : `bg-black/70 border-white/30 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]`
          }
          ${!isActive ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
        animate={isPowerUp ? {
          boxShadow: [
            "0 0 20px rgba(255,255,255,0.4)",
            "0 0 40px rgba(255,255,255,0.8)",
            "0 0 20px rgba(255,255,255,0.4)"
          ]
        } : {}}
        transition={isPowerUp ? { duration: 1.5, repeat: Infinity } : {}}
      >
        <div className="flex items-center gap-2 justify-center">
          {isPowerUp && PowerUpIcon && (
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <PowerUpIcon className="w-5 h-5" />
            </motion.div>
          )}
          
          <motion.span
            className="text-lg"
            animate={isAnswered ? { 
              scale: [1, 1.1, 1],
              color: isCorrect ? "#22c55e" : "#ef4444"
            } : {}}
            transition={{ duration: 0.3 }}
          >
            {answer}
          </motion.span>
          
          {isAnswered && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {isCorrect ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <X className="w-6 h-6 text-red-400" />
              )}
            </motion.div>
          )}
        </div>

        {/* Power-up particles */}
        {isPowerUp && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: "50%", 
                  y: "50%",
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: `${50 + Math.sin(i * Math.PI / 2) * 100}%`,
                  y: `${50 + Math.cos(i * Math.PI / 2) * 100}%`,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Difficulty indicator */}
        {!isPowerUp && (
          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r ${gradientColor}`} />
        )}

        {/* Enhanced Preview Effect */}
        {showPreview && !isAnswered && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Preview glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: isCorrect
                  ? [
                      "0 0 0px rgba(34, 197, 94, 0.4)",
                      "0 0 30px rgba(34, 197, 94, 0.8)",
                      "0 0 0px rgba(34, 197, 94, 0.4)"
                    ]
                  : [
                      "0 0 0px rgba(239, 68, 68, 0.4)",
                      "0 0 30px rgba(239, 68, 68, 0.8)",
                      "0 0 0px rgba(239, 68, 68, 0.4)"
                    ]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Confidence indicator */}
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`px-3 py-2 rounded-lg font-bold text-sm text-white backdrop-blur-sm ${
                isCorrect 
                  ? 'bg-green-500/90 shadow-[0_0_20px_rgba(34,197,94,0.6)]' 
                  : 'bg-red-500/90 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
              }`}>
                <div className="flex items-center gap-2">
                  <span>{isCorrect ? '✓' : '✗'}</span>
                  <span>{isCorrect ? 'GOOD CHOICE!' : 'THINK AGAIN!'}</span>
                </div>
                <div className="text-xs opacity-80 mt-1">
                  {isCorrect ? 'This will boost your streak!' : 'This will break your streak!'}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.button>

      {/* Feedback animation */}
      {showFeedback && (
        <motion.div
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`
            px-4 py-2 rounded-full font-bold text-sm
            ${isCorrect 
              ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.6)]' 
              : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]'
            }
          `}>
            {isCorrect ? (isPowerUp ? 'POWER-UP!' : 'CORRECT!') : 'WRONG!'}
          </div>
        </motion.div>
      )}

      {/* Success particles */}
      {showFeedback && isCorrect && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{
                x: "50%",
                y: "50%",
                scale: 0,
                opacity: 0
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 200}%`,
                y: `${50 + (Math.random() - 0.5) * 200}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
