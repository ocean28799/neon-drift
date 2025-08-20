import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap, Crown, Award, Trophy, Target, Flame } from 'lucide-react'

interface UltraComboSystemProps {
  combo: number
  maxCombo: number
  isVisible: boolean
  onComboMilestone?: (milestone: number) => void
}

const comboTiers = [
  { threshold: 5, icon: Target, name: "NICE!", color: "from-green-400 to-emerald-500", glow: "rgba(34, 197, 94, 0.8)" },
  { threshold: 10, icon: Star, name: "GREAT!", color: "from-blue-400 to-blue-600", glow: "rgba(59, 130, 246, 0.8)" },
  { threshold: 15, icon: Zap, name: "EXCELLENT!", color: "from-purple-400 to-purple-600", glow: "rgba(147, 51, 234, 0.8)" },
  { threshold: 20, icon: Flame, name: "AMAZING!", color: "from-orange-400 to-red-500", glow: "rgba(251, 146, 60, 0.8)" },
  { threshold: 30, icon: Award, name: "INCREDIBLE!", color: "from-pink-400 to-pink-600", glow: "rgba(236, 72, 153, 0.8)" },
  { threshold: 50, icon: Trophy, name: "LEGENDARY!", color: "from-yellow-400 to-yellow-600", glow: "rgba(251, 191, 36, 0.8)" },
  { threshold: 100, icon: Crown, name: "GODLIKE!", color: "from-gradient-rainbow", glow: "rgba(255, 255, 255, 1)" }
]

export default function UltraComboSystem({ 
  combo, 
  maxCombo, 
  isVisible, 
  onComboMilestone 
}: UltraComboSystemProps) {
  const [lastMilestone, setLastMilestone] = React.useState(0)
  const [showCelebration, setShowCelebration] = React.useState(false)
  const [animationKey, setAnimationKey] = React.useState(0)

  // Find current tier
  const currentTier = React.useMemo(() => {
    return [...comboTiers].reverse().find(tier => combo >= tier.threshold) || comboTiers[0]
  }, [combo])

  // Check for milestones
  React.useEffect(() => {
    const newMilestone = comboTiers.find(tier => 
      combo >= tier.threshold && lastMilestone < tier.threshold
    )
    
    if (newMilestone) {
      setLastMilestone(newMilestone.threshold)
      setShowCelebration(true)
      setAnimationKey(prev => prev + 1)
      onComboMilestone?.(newMilestone.threshold)
      
      setTimeout(() => setShowCelebration(false), 3000)
    }
  }, [combo, lastMilestone, onComboMilestone])

  // Reset on combo break
  React.useEffect(() => {
    if (combo === 0) {
      setLastMilestone(0)
      setShowCelebration(false)
    }
  }, [combo])

  const ComboIcon = currentTier.icon
  const progressPercentage = combo > 0 ? Math.min((combo / Math.max(combo, 10)) * 100, 100) : 0

  if (!isVisible) return null

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${combo}-${animationKey}`}
          className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0, x: 100, rotateY: -90 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            rotateY: 0,
            scale: [1, 1.1, 1]
          }}
          exit={{ opacity: 0, x: 100, rotateY: 90 }}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            damping: 15,
            scale: { duration: 0.3, repeat: Infinity, repeatType: "reverse" }
          }}
        >
          <motion.div
            className={`relative bg-gradient-to-r ${currentTier.color === 'from-gradient-rainbow' 
              ? 'from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500' 
              : currentTier.color
            } rounded-3xl p-6 border-2 border-white/40 backdrop-blur-xl`}
            animate={{
              boxShadow: [
                `0 0 30px ${currentTier.glow}`,
                `0 0 60px ${currentTier.glow}`,
                `0 0 30px ${currentTier.glow}`
              ],
              rotate: currentTier.threshold >= 100 ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity },
              rotate: { duration: 1, repeat: Infinity }
            }}
          >
            <div className="flex flex-col items-center space-y-3">
              {/* Combo Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity }
                }}
              >
                <ComboIcon className="w-10 h-10 text-white drop-shadow-lg" />
              </motion.div>

              {/* Combo Number */}
              <motion.div 
                className="text-center"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.8)",
                    "0 0 20px rgba(255,255,255,1)",
                    "0 0 10px rgba(255,255,255,0.8)"
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div 
                  className="text-4xl font-bold text-white drop-shadow-lg"
                  animate={{ 
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {combo}
                </motion.div>
                <div className="text-sm font-semibold text-white/90 drop-shadow">
                  COMBO
                </div>
              </motion.div>

              {/* Tier Name */}
              <motion.div 
                className="text-xs font-bold text-white/95 tracking-wider drop-shadow"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentTier.name}
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full max-w-[80px] bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              {/* Max Combo Indicator */}
              {combo === maxCombo && maxCombo > 0 && (
                <motion.div
                  className="text-xs font-bold text-yellow-300 tracking-wider"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  PERSONAL BEST!
                </motion.div>
              )}
            </div>

            {/* Floating particles around combo */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
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
                    x: `${50 + Math.sin(i * Math.PI / 4 + Date.now() * 0.001) * 150}%`,
                    y: `${50 + Math.cos(i * Math.PI / 4 + Date.now() * 0.001) * 150}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
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
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ 
                scale: [0, 1.3, 1], 
                rotateY: [0, 360, 720, 1080]
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ 
                duration: 2.5,
                type: "spring",
                damping: 12
              }}
            >
              <motion.div
                className={`text-8xl font-bold bg-gradient-to-r ${
                  currentTier.color === 'from-gradient-rainbow' 
                    ? 'from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-pink-500' 
                    : currentTier.color
                } bg-clip-text text-transparent mb-4`}
                animate={{
                  textShadow: [
                    `0 0 30px ${currentTier.glow}`,
                    `0 0 60px ${currentTier.glow}`,
                    `0 0 30px ${currentTier.glow}`
                  ]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity
                }}
              >
                {currentTier.name}
              </motion.div>
              
              <motion.div
                className="text-3xl font-semibold text-white drop-shadow-lg mb-2"
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {combo} COMBO ACHIEVED!
              </motion.div>

              <motion.div
                className="text-lg text-gray-300"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Keep it going! 🔥
              </motion.div>
            </motion.div>

            {/* Massive celebration particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(40)].map((_, i) => (
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
                    x: `${50 + (Math.random() - 0.5) * 300}%`,
                    y: `${50 + (Math.random() - 0.5) * 300}%`,
                    scale: [0, 2, 0],
                    rotate: Math.random() * 720,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentTier.color}`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
