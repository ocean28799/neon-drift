'use client'

import { motion } from 'framer-motion'
import { Play, Trophy, Zap, Award, Car, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { soundEngine } from '@/utils/soundEngine'
import AchievementSystem from './AchievementSystem'
import Car3D from './Car3D'

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
  onSelectCar: () => void
  onSelectChapter: () => void
  highScore: number
  selectedCar: Car
}

export default function GameMenu({ 
  onSelectCar, 
  onSelectChapter,
  highScore, 
  selectedCar
}: GameMenuProps) {
  const [showAchievements, setShowAchievements] = useState(false)

  return (
    <div className="min-h-screen py-8 px-4 relative overflow-y-auto">
      <div className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto">
        {/* Modern floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
              animate={{
                x: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
                  Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)
                ],
                y: [
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080), 
                  Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
                ],
                opacity: [0.2, 0.8, 0.2]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
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
          {/* Modern Game Title */}
          <motion.div
            animate={{ 
              textShadow: [
                '0 0 30px #06b6d4, 0 0 60px #8b5cf6',
                '0 0 60px #06b6d4, 0 0 90px #8b5cf6',
                '0 0 30px #06b6d4, 0 0 60px #8b5cf6'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 tracking-wider">
              NEON
            </h1>
            <h1 className="text-7xl md:text-8xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
              DRIFT
            </h1>
            {/* Futuristic underline */}
            <motion.div
              className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-pink-400 mx-auto mt-4 rounded-full"
              animate={{
                scaleX: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </motion.div>

          {/* Futuristic subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <p className="text-lg text-cyan-300 mb-2 flex items-center justify-center gap-2 font-medium">
              <Zap className="w-5 h-5" />
              FUTURISTIC RACING EXPERIENCE
            </p>
            <p className="text-sm text-purple-300 font-light tracking-wide">
              Navigate the neon highways of 2025
            </p>
          </motion.div>

          {/* High Score */}
          {highScore > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 mb-8 inline-flex items-center gap-3 border border-cyan-500/20"
            >
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-lg">
                Best: {highScore.toLocaleString()}
              </span>
            </motion.div>
          )}

          {/* Selected Car Display with 3D Model */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 mb-8"
          >
            <div className="text-center">
              <div className="text-cyan-400 text-sm font-semibold mb-4 tracking-wider">
                SELECTED VEHICLE
              </div>
              <div className="flex justify-center mb-4">
                <Car3D car={selectedCar} size="medium" animated={true} />
              </div>
              <div className="text-white font-bold text-xl mb-2">{selectedCar.name}</div>
              <div className="flex justify-center gap-4 text-xs">
                <div className="text-center">
                  <div className="text-cyan-400 font-semibold">SPEED</div>
                  <div className="text-white">{selectedCar.speed}</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">HANDLING</div>
                  <div className="text-white">{selectedCar.handling}</div>
                </div>
                <div className="text-center">
                  <div className="text-pink-400 font-semibold">SHIELD</div>
                  <div className="text-white">{selectedCar.shield}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Menu Buttons */}
          <div className="space-y-4">
            {/* Start Button */}
            <motion.button
              onClick={onSelectChapter}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/30 block w-full overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="relative flex items-center justify-center gap-3 font-black tracking-wide">
                <Play className="w-6 h-6" fill="currentColor" />
                START MISSION
              </span>
            </motion.button>

            {/* Car Selection Button */}
            <motion.button
              onClick={onSelectCar}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2 w-full font-black tracking-wide"
            >
              <Car className="w-5 h-5" />
              VEHICLE SELECTION
            </motion.button>

            {/* Achievements Button */}
            <motion.button
              onClick={() => setShowAchievements(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2 w-full font-black tracking-wide"
            >
              <Award className="w-5 h-5" />
              ACHIEVEMENTS
            </motion.button>
          </div>

          {/* Language Learning Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-cyan-500/20 mt-8"
          >
            <div className="text-center">
              <div className="text-cyan-400 text-sm font-semibold mb-1">🇻🇳 VIETNAMESE → ENGLISH</div>
              <div className="text-white text-xs">Learn English vocabulary while racing</div>
            </div>
          </motion.div>

          {/* Music Volume Control */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-6 bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-cyan-500/20"
          >
            <div className="flex items-center gap-3 justify-center">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-semibold tracking-wide">AUDIO</span>
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
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-8 text-gray-400 text-sm space-y-2"
          >
            <p>🎮 Use ARROW KEYS or WASD to navigate</p>
            <p>📱 Mobile: TAP left/right screen sides</p>
            <p>🚀 Dodge obstacles, collect power-ups</p>
            <p>⚡ Press ESC to pause game</p>
          </motion.div>
        </motion.div>

        {/* Achievement System Modal */}
        {showAchievements && (
          <AchievementSystem 
            score={highScore} 
            onClose={() => setShowAchievements(false)} 
          />
        )}
      </div>
    </div>
  )
}
