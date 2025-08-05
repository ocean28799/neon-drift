import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Zap, Target, Coins, Clock, Award } from 'lucide-react'

interface ProgressionSystemProps {
  level: number
  xp: number
  xpToNext: number
  coins: number
  onLevelUp?: () => void
}

export default function ProgressionSystem({ 
  level, 
  xp, 
  xpToNext, 
  coins, 
  onLevelUp 
}: ProgressionSystemProps) {
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [previousLevel, setPreviousLevel] = useState(level)

  // Detect level up
  useEffect(() => {
    if (level > previousLevel) {
      setShowLevelUp(true)
      onLevelUp?.()
      setTimeout(() => setShowLevelUp(false), 3000)
    }
    setPreviousLevel(level)
  }, [level, previousLevel, onLevelUp])

  const xpPercentage = (xp / xpToNext) * 100

  return (
    <>
      {/* Main Progression HUD */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-cyan-400/30 min-w-[200px]">
          {/* Level & Coins */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-lg">LV.{level}</div>
                <div className="text-xs text-gray-400">PILOT RANK</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-bold">{coins.toLocaleString()}</span>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{xp.toLocaleString()} XP</span>
              <span>{xpToNext.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                style={{ width: `${xpPercentage}%` }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <div className="text-center text-xs text-cyan-400">
              {Math.round(xpPercentage)}% to next level
            </div>
          </div>
          
          {/* Next Reward Preview */}
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="text-xs text-gray-400 mb-1">NEXT UNLOCK:</div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400 text-xs">New Car Skin</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-center"
            >
              <motion.div
                animate={{
                  textShadow: [
                    "0 0 20px #06b6d4",
                    "0 0 40px #06b6d4", 
                    "0 0 20px #06b6d4"
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4"
              >
                LEVEL UP!
              </motion.div>
              <div className="text-3xl text-white font-bold">LEVEL {level}</div>
              <div className="text-cyan-400 text-lg mt-2">New abilities unlocked!</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
