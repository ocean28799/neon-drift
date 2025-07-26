'use client'

import { motion } from 'framer-motion'
import { Flame, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

interface StreakCounterProps {
  visible: boolean
}

export default function StreakCounter({ visible }: StreakCounterProps) {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Load streak data
    const savedStreak = localStorage.getItem('neonDrift_streak')
    const savedLastPlay = localStorage.getItem('neonDrift_lastPlay')
    const today = new Date().toDateString()

    if (savedLastPlay) {
      const lastPlay = new Date(savedLastPlay)
      const todayDate = new Date(today)
      const diffTime = todayDate.getTime() - lastPlay.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        // Consecutive day - increment streak
        const newStreak = parseInt(savedStreak || '0') + 1
        setStreak(newStreak)
        localStorage.setItem('neonDrift_streak', newStreak.toString())
      } else if (diffDays === 0) {
        // Same day - keep current streak
        setStreak(parseInt(savedStreak || '0'))
      } else {
        // Missed days - reset streak
        setStreak(1)
        localStorage.setItem('neonDrift_streak', '1')
      }
    } else {
      // First time playing
      setStreak(1)
      localStorage.setItem('neonDrift_streak', '1')
    }

    // Update last play date
    localStorage.setItem('neonDrift_lastPlay', today)
  }, [])

  if (!visible || streak <= 1) return null

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      className="absolute top-32 left-4 z-20"
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-lg rounded-xl p-4 border border-orange-400/50"
        style={{
          boxShadow: '0 0 20px rgba(251, 146, 60, 0.4)'
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Flame className="w-6 h-6 text-orange-300" />
          </motion.div>
          
          <div>
            <div className="text-orange-300 text-sm font-semibold">
              DAILY STREAK
            </div>
            <div className="text-white font-bold text-lg">
              {streak} {streak === 1 ? 'Day' : 'Days'}
            </div>
          </div>
        </div>
        
        {/* Streak bonus indicator */}
        {streak >= 7 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-2 text-yellow-300 text-xs font-bold flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            WEEKLY BONUS ACTIVE!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
