'use client'

import { motion } from 'framer-motion'
import { Calendar, Target, Trophy, Clock, Star, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Challenge {
  id: string
  title: string
  description: string
  target: number
  progress: number
  reward: string
  icon: React.ReactNode
  completed: boolean
}

interface DailyChallengesProps {
  score: number
  coins: number
  onClose: () => void
}

export default function DailyChallenges({ score, coins, onClose }: DailyChallengesProps) {
  const [challenges, setChallenges] = useState<Challenge[]>([])

  useEffect(() => {
    // Generate daily challenges based on current date
    const today = new Date().toDateString()
    const savedChallenges = localStorage.getItem(`neonDrift_challenges_${today}`)
    
    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges))
    } else {
      // Generate new daily challenges
      const newChallenges: Challenge[] = [
        {
          id: 'score_1000',
          title: 'Score Master',
          description: 'Reach 1,000 points in a single game',
          target: 1000,
          progress: Math.min(score, 1000),
          reward: '🎨 Neon Theme',
          icon: <Target className="w-5 h-5" />,
          completed: score >= 1000
        },
        {
          id: 'coins_50',
          title: 'Coin Collector',
          description: 'Collect 50 coins in one session',
          target: 50,
          progress: Math.min(coins, 50),
          reward: '⚡ Speed Boost',
          icon: <Star className="w-5 h-5" />,
          completed: coins >= 50
        },
        {
          id: 'survival_60',
          title: 'Survivor',
          description: 'Survive for 60 seconds',
          target: 60,
          progress: Math.min(Math.floor(score / 60), 60), // Assuming 60 points = 1 second
          reward: '🛡️ Extra Shield',
          icon: <Clock className="w-5 h-5" />,
          completed: score >= 3600 // 60 seconds worth of points
        },
        {
          id: 'perfect_run',
          title: 'Perfect Navigation',
          description: 'Score 500 points without taking damage',
          target: 500,
          progress: Math.min(score, 500), // Simplified for demo
          reward: '🌟 Golden Trail',
          icon: <Zap className="w-5 h-5" />,
          completed: score >= 500
        }
      ]
      
      setChallenges(newChallenges)
      localStorage.setItem(`neonDrift_challenges_${today}`, JSON.stringify(newChallenges))
    }
  }, [score, coins])

  const completedCount = challenges.filter(c => c.completed).length
  const timeUntilReset = new Date()
  timeUntilReset.setHours(24, 0, 0, 0)
  const hoursLeft = Math.floor((timeUntilReset.getTime() - Date.now()) / (1000 * 60 * 60))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full mx-4 border border-cyan-400/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-cyan-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DAILY CHALLENGES
            </h2>
          </div>
          
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-green-400">
              <span className="font-bold">{completedCount}</span> / {challenges.length} Completed
            </div>
            <div className="text-orange-400">
              <span className="font-bold">{hoursLeft}h</span> until reset
            </div>
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              className={`glass-dark rounded-xl p-4 ${
                challenge.completed 
                  ? 'border border-green-400/50 bg-green-400/10' 
                  : 'border border-gray-600/50'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  challenge.completed 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {challenge.completed ? (
                    <Trophy className="w-5 h-5" />
                  ) : (
                    challenge.icon
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-bold text-lg ${
                      challenge.completed ? 'text-green-400' : 'text-cyan-400'
                    }`}>
                      {challenge.title}
                    </h3>
                    {challenge.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400 text-xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">
                    {challenge.description}
                  </p>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{challenge.progress}</span>
                      <span>{challenge.target}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          challenge.completed 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${Math.min((challenge.progress / challenge.target) * 100, 100)}%` 
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  
                  <div className={`text-sm font-bold ${
                    challenge.completed ? 'text-green-300' : 'text-yellow-400'
                  }`}>
                    Reward: {challenge.reward}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Continue Playing
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
