import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Star, Sparkles, Crown, Award } from 'lucide-react'

interface ModernStreakCounterProps {
  streak: number
  isVisible: boolean
  onStreakMilestone?: (milestone: number) => void
}

const streakMilestones = [5, 10, 15, 20, 25, 30, 50, 100]

export default function ModernStreakCounter({ 
  streak, 
  isVisible, 
  onStreakMilestone 
}: ModernStreakCounterProps) {
  const [lastMilestone, setLastMilestone] = React.useState(0)
  const [showCelebration, setShowCelebration] = React.useState(false)

  // Check for milestones
  React.useEffect(() => {
    const currentMilestone = streakMilestones.find(m => 
      streak >= m && lastMilestone < m
    )
    
    if (currentMilestone) {
      setLastMilestone(currentMilestone)
      setShowCelebration(true)
      onStreakMilestone?.(currentMilestone)
      
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [streak, lastMilestone, onStreakMilestone])

  const getStreakIcon = () => {
    if (streak >= 100) return Crown
    if (streak >= 50) return Award
    if (streak >= 25) return Sparkles
    if (streak >= 10) return Star
    if (streak >= 5) return Zap
    return Flame
  }

  const getStreakColor = () => {
    if (streak >= 100) return 'from-yellow-400 to-yellow-600'
    if (streak >= 50) return 'from-purple-400 to-purple-600'
    if (streak >= 25) return 'from-pink-400 to-pink-600'
    if (streak >= 10) return 'from-blue-400 to-blue-600'
    if (streak >= 5) return 'from-green-400 to-green-600'
    return 'from-orange-400 to-red-500'
  }

  const getStreakGlow = () => {
    if (streak >= 100) return 'rgba(251, 191, 36, 0.8)'
    if (streak >= 50) return 'rgba(147, 51, 234, 0.8)'
    if (streak >= 25) return 'rgba(244, 114, 182, 0.8)'
    if (streak >= 10) return 'rgba(59, 130, 246, 0.8)'
    if (streak >= 5) return 'rgba(34, 197, 94, 0.8)'
    return 'rgba(239, 68, 68, 0.8)'
  }

  const StreakIcon = getStreakIcon()

  if (!isVisible || streak === 0) return null

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={streak}
          className="fixed top-16 right-4 transform z-50 pointer-events-none
                     lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 lg:right-auto lg:top-auto"
          initial={{ opacity: 0, y: -30, scale: 0.5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotateY: [0, 360]
          }}
          exit={{ opacity: 0, y: -30, scale: 0.5 }}
          transition={{ 
            duration: 0.8, 
            type: "spring", 
            damping: 15,
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        >
          <motion.div
            className={`bg-gradient-to-r ${getStreakColor()} rounded-xl p-2 lg:p-4 border-2 border-white/30 backdrop-blur-xl`}
            animate={{
              boxShadow: [
                `0 0 20px ${getStreakGlow()}`,
                `0 0 40px ${getStreakGlow()}`,
                `0 0 20px ${getStreakGlow()}`
              ],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="flex items-center gap-2 lg:gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <StreakIcon className="w-5 h-5 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
              </motion.div>
              
              <div className="text-center">
                <motion.div 
                  className="text-xl lg:text-3xl font-bold text-white drop-shadow-lg"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    textShadow: [
                      "0 0 10px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,1)",
                      "0 0 10px rgba(255,255,255,0.8)"
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {streak}
                </motion.div>
                <div className="text-xs lg:text-sm font-semibold text-white/90 drop-shadow">
                  STREAK
                </div>
              </div>
              
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Flame className="w-5 h-5 lg:w-8 lg:h-8 text-white drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                initial={{ 
                  x: Math.random() * 100, 
                  y: Math.random() * 100,
                  opacity: 0 
                }}
                animate={{
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Milestone Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-60 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0, rotateY: 0 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                rotateY: [0, 360, 720]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                duration: 2,
                type: "spring",
                damping: 15
              }}
            >
              <motion.div
                className="text-8xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  textShadow: [
                    "0 0 30px rgba(251, 191, 36, 0.8)",
                    "0 0 60px rgba(251, 191, 36, 1)",
                    "0 0 30px rgba(251, 191, 36, 0.8)"
                  ]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                🎉 {lastMilestone} STREAK! 🎉
              </motion.div>
              
              <motion.div
                className="text-2xl font-semibold text-white drop-shadow-lg"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                INCREDIBLE PERFORMANCE!
              </motion.div>
            </motion.div>

            {/* Celebration particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                    rotate: 0
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    rotate: 360,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getStreakColor()}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
