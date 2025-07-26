'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Zap, Shield, Target } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  unlocked: boolean
  progress?: number
  maxProgress?: number
}

interface AchievementSystemProps {
  score: number
  onClose: () => void
}

export default function AchievementSystem({ score, onClose }: AchievementSystemProps) {
  const achievements: Achievement[] = [
    {
      id: 'first_score',
      title: 'First Flight',
      description: 'Score your first 100 points',
      icon: <Star className="w-6 h-6" />,
      unlocked: score >= 100,
      progress: Math.min(score, 100),
      maxProgress: 100
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      description: 'Reach maximum speed',
      icon: <Zap className="w-6 h-6" />,
      unlocked: score >= 500,
      progress: Math.min(score, 500),
      maxProgress: 500
    },
    {
      id: 'survivor',
      title: 'Survivor',
      description: 'Score 1,000 points',
      icon: <Shield className="w-6 h-6" />,
      unlocked: score >= 1000,
      progress: Math.min(score, 1000),
      maxProgress: 1000
    },
    {
      id: 'high_scorer',
      title: 'High Scorer',
      description: 'Reach 5,000 points',
      icon: <Target className="w-6 h-6" />,
      unlocked: score >= 5000,
      progress: Math.min(score, 5000),
      maxProgress: 5000
    },
    {
      id: 'neon_master',
      title: 'Neon Master',
      description: 'Score 10,000 points',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: score >= 10000,
      progress: Math.min(score, 10000),
      maxProgress: 10000
    }
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length

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
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ACHIEVEMENTS
          </h2>
          <p className="text-gray-300">
            {unlockedCount} of {achievements.length} unlocked
          </p>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className={`glass-dark rounded-xl p-4 flex items-center gap-4 ${
                achievement.unlocked ? 'border border-cyan-400/50' : 'opacity-60'
              }`}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`p-3 rounded-full ${
                achievement.unlocked 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {achievement.icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${
                  achievement.unlocked ? 'text-cyan-400' : 'text-gray-400'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {achievement.description}
                </p>
                
                {achievement.maxProgress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{achievement.progress?.toLocaleString()}</span>
                      <span>{achievement.maxProgress.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%` 
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="text-cyan-400"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
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
