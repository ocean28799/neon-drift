'use client'

import { motion } from 'framer-motion'
import { Play, Trophy, Zap, Award, Calendar, Car, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { soundEngine } from '@/utils/soundEngine'
import AchievementSystem from './AchievementSystem'
import DailyChallenges from './DailyChallenges'

interface Car {
  id: string
  name: string
  color: string
  gradient: string
  speed: number
  handling: number
  shield: number
  unlocked: boolean
  price?: number
}

interface GameMenuProps {
  onStartGame: () => void
  onSelectCar: () => void
  onSelectChapter: () => void
  highScore: number
  selectedCar: Car
}

export default function GameMenu({ 
  onStartGame, 
  onSelectCar, 
  onSelectChapter,
  highScore, 
  selectedCar
}: GameMenuProps) {
  const [showAchievements, setShowAchievements] = useState(false)
  const [showChallenges, setShowChallenges] = useState(false)

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-60"
              animate={{
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Game Title */}
        <motion.div
          animate={{ 
            textShadow: [
              '0 0 20px #06b6d4',
              '0 0 40px #06b6d4',
              '0 0 20px #06b6d4'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8"
        >
          <h1 className="text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            NEON
          </h1>
          <h1 className="text-8xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            DRIFT
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl text-cyan-300 mb-8 flex items-center justify-center gap-2"
        >
          <Zap className="w-6 h-6" />
          Navigate the neon highways of 2025
          <Zap className="w-6 h-6" />
        </motion.p>

        {/* High Score */}
        {highScore > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-black/30 backdrop-blur-lg rounded-xl p-4 mb-8 inline-flex items-center gap-2"
          >
            <Trophy className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-bold">
              Best: {highScore.toLocaleString()}
            </span>
          </motion.div>
        )}

        {/* Menu Buttons */}
        <div className="space-y-4">
          {/* Selected Car Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-cyan-500/30 mb-6"
          >
            <div className="text-center">
              <div className="text-cyan-400 text-sm font-semibold mb-2">SELECTED VEHICLE</div>
              <div className="flex justify-center mb-3">
                <motion.div
                  className={`w-12 h-20 bg-gradient-to-b ${selectedCar.gradient} rounded-lg shadow-lg relative`}
                  animate={{
                    boxShadow: [
                      `0 0 10px ${selectedCar.color === 'cyan' ? '#06b6d4' : selectedCar.color === 'purple' ? '#8b5cf6' : selectedCar.color === 'yellow' ? '#f59e0b' : selectedCar.color === 'blue' ? '#3b82f6' : selectedCar.color === 'red' ? '#ef4444' : '#374151'}`,
                      `0 0 20px ${selectedCar.color === 'cyan' ? '#06b6d4' : selectedCar.color === 'purple' ? '#8b5cf6' : selectedCar.color === 'yellow' ? '#f59e0b' : selectedCar.color === 'blue' ? '#3b82f6' : selectedCar.color === 'red' ? '#ef4444' : '#374151'}`,
                      `0 0 10px ${selectedCar.color === 'cyan' ? '#06b6d4' : selectedCar.color === 'purple' ? '#8b5cf6' : selectedCar.color === 'yellow' ? '#f59e0b' : selectedCar.color === 'blue' ? '#3b82f6' : selectedCar.color === 'red' ? '#ef4444' : '#374151'}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Car details */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white rounded-full opacity-80" />
                  <div className="absolute bottom-1 left-1 w-1 h-1 bg-red-400 rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-red-400 rounded-full" />
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-px h-full bg-white/20 rounded" />
                  </div>
                </motion.div>
              </div>
              <div className="text-white font-bold text-lg">{selectedCar.name}</div>
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.button
            onClick={onSelectChapter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 block w-full"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="relative flex items-center justify-center gap-3">
              <Play className="w-6 h-6" fill="currentColor" />
              CHOOSE CHAPTER
            </span>
          </motion.button>

          {/* Car Selection Button */}
          <motion.button
            onClick={onSelectCar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 w-full"
          >
            <Car className="w-5 h-5" />
            SELECT CAR
          </motion.button>

          {/* Language Learning Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-cyan-500/30"
          >
            <div className="text-center">
              <div className="text-cyan-400 text-sm font-semibold">🇻🇳 VIETNAMESE → ENGLISH</div>
              <div className="text-white text-xs mt-1">Learn English vocabulary while playing</div>
            </div>
          </motion.div>

          {/* Achievements Button */}
          <motion.button
            onClick={() => setShowAchievements(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 w-full"
          >
            <Award className="w-5 h-5" />
            ACHIEVEMENTS
          </motion.button>

          {/* Daily Challenges Button */}
          <motion.button
            onClick={() => setShowChallenges(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 w-full"
          >
            <Calendar className="w-5 h-5" />
            DAILY CHALLENGES
          </motion.button>

          {/* Test Language Learning Button - For Development */}
          <motion.button
            onClick={() => {
              // Temporarily trigger language learning for testing
              const windowWithTest = window as Window & { testLanguageLearning?: () => void }
              if (typeof window !== 'undefined' && windowWithTest.testLanguageLearning) {
                windowWithTest.testLanguageLearning()
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2 w-full text-sm"
          >
            🎓 TEST LEARNING
          </motion.button>
        </div>

        {/* Music Volume Control */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 bg-black/30 backdrop-blur-lg rounded-lg p-4 border border-cyan-500/30"
        >
          <div className="flex items-center gap-3 justify-center">
            <Volume2 className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-semibold">MUSIC</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="30"
              className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              onChange={(e) => {
                const volume = parseInt(e.target.value) / 100
                soundEngine.setMusicVolume(volume)
              }}
            />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 text-gray-300 text-sm space-y-2"
        >
          <p>🎮 Use ARROW KEYS or WASD to steer</p>
          <p>� On mobile: TAP left/right sides of screen</p>
          <p>�🚀 Avoid obstacles and collect power-ups</p>
          <p>⚡ Press ESC to pause</p>
        </motion.div>
      </motion.div>

      {/* Achievement System Modal */}
      {showAchievements && (
        <AchievementSystem 
          score={highScore} 
          onClose={() => setShowAchievements(false)} 
        />
      )}

      {/* Daily Challenges Modal */}
      {showChallenges && (
        <DailyChallenges 
          score={highScore}
          coins={Math.floor(highScore / 10)} // Estimate coins from score
          onClose={() => setShowChallenges(false)} 
        />
      )}
      </div>
    </div>
  )
}
