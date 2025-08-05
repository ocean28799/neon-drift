import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Star, Zap, Shield, Coins, Crown, Sparkles } from 'lucide-react'

interface Reward {
  id: string
  type: 'car' | 'skin' | 'boost' | 'coins' | 'xp' | 'premium'
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  icon: React.ReactNode
  value?: number
}

interface RewardSystemProps {
  onRewardClaimed?: (reward: Reward) => void
}

export default function RewardSystem({ onRewardClaimed }: RewardSystemProps) {
  const [showReward, setShowReward] = useState(false)
  const [currentReward, setCurrentReward] = useState<Reward | null>(null)
  const [dailyProgress, setDailyProgress] = useState(0)
  const [weeklyProgress, setWeeklyProgress] = useState(0)

  const rewards: Reward[] = [
    {
      id: 'daily_coins',
      type: 'coins',
      name: '500 Coins',
      description: 'Daily login bonus',
      rarity: 'common',
      icon: <Coins className="w-6 h-6" />,
      value: 500
    },
    {
      id: 'speed_boost',
      type: 'boost',
      name: 'Speed Boost',
      description: '2x speed for next game',
      rarity: 'rare',
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: 'neon_skin',
      type: 'skin',
      name: 'Neon Glow Skin',
      description: 'Epic car customization',
      rarity: 'epic',
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'legendary_car',
      type: 'car',
      name: 'Quantum Racer',
      description: 'Legendary vehicle',
      rarity: 'legendary',
      icon: <Crown className="w-6 h-6" />
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600'
      case 'rare': return 'from-blue-500 to-cyan-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'legendary': return 'from-yellow-500 to-orange-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return '0 0 20px rgba(156, 163, 175, 0.5)'
      case 'rare': return '0 0 30px rgba(59, 130, 246, 0.7)'
      case 'epic': return '0 0 40px rgba(147, 51, 234, 0.8)'
      case 'legendary': return '0 0 50px rgba(245, 158, 11, 1)'
      default: return '0 0 20px rgba(156, 163, 175, 0.5)'
    }
  }

  const claimReward = (reward: Reward) => {
    setCurrentReward(reward)
    setShowReward(true)
    onRewardClaimed?.(reward)
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowReward(false)
      setCurrentReward(null)
    }, 3000)
  }

  // Simulate daily/weekly progress (integrate with your actual game data)
  useEffect(() => {
    const savedDailyProgress = localStorage.getItem('neonDrift_dailyProgress')
    const savedWeeklyProgress = localStorage.getItem('neonDrift_weeklyProgress')
    
    if (savedDailyProgress) setDailyProgress(parseInt(savedDailyProgress))
    if (savedWeeklyProgress) setWeeklyProgress(parseInt(savedWeeklyProgress))
  }, [])

  return (
    <>
      {/* Daily/Weekly Rewards UI */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-20 right-4 z-20"
      >
        <div className="bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-purple-400/30 min-w-[250px]">
          <div className="text-center mb-4">
            <h3 className="text-purple-400 font-bold text-lg flex items-center justify-center gap-2">
              <Gift className="w-5 h-5" />
              DAILY REWARDS
            </h3>
          </div>

          {/* Daily Progress */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Daily Quest</span>
                <span>{dailyProgress}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${Math.min(dailyProgress, 100)}%` }}
                  animate={{ width: `${Math.min(dailyProgress, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Weekly Challenge</span>
                <span>{weeklyProgress}/500</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${Math.min((weeklyProgress / 500) * 100, 100)}%` }}
                  animate={{ width: `${Math.min((weeklyProgress / 500) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Reward Claim Buttons */}
          <div className="space-y-2">
            {dailyProgress >= 100 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => claimReward(rewards[0])}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Claim Daily Reward
              </motion.button>
            )}
            
            {weeklyProgress >= 500 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => claimReward(rewards[3])}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Claim Weekly Legendary
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Reward Claim Animation */}
      <AnimatePresence>
        {showReward && currentReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-center"
              style={{
                filter: `drop-shadow(${getRarityGlow(currentReward.rarity)})`
              }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    getRarityGlow(currentReward.rarity),
                    `${getRarityGlow(currentReward.rarity)}, ${getRarityGlow(currentReward.rarity)}`,
                    getRarityGlow(currentReward.rarity)
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`bg-gradient-to-r ${getRarityColor(currentReward.rarity)} rounded-2xl p-8 mb-4`}
              >
                <div className="text-white text-6xl mb-4">
                  {currentReward.icon}
                </div>
                <div className="text-white font-bold text-2xl mb-2">
                  {currentReward.name}
                </div>
                <div className="text-white/80 text-lg">
                  {currentReward.description}
                </div>
              </motion.div>
              
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px #ffffff",
                    "0 0 40px #ffffff", 
                    "0 0 20px #ffffff"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl font-bold text-white"
              >
                REWARD CLAIMED!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
