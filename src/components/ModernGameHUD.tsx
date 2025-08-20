import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Gauge, Heart, Star, Shield, Zap, Crown } from 'lucide-react'

interface ModernGameHUDProps {
  score: number
  speed: number
  shieldTime: number
  boostTime: number
  health: number
  carLevel: number
  questionsAnswered?: number
  roundComplete?: boolean
  onPause: () => void
}

export default function ModernGameHUD({ 
  score, 
  speed, 
  shieldTime, 
  boostTime, 
  health, 
  carLevel, 
  questionsAnswered = 0,
  roundComplete = false,
  onPause 
}: ModernGameHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Mobile-first Top Left - Score & Progress */}
      <motion.div 
        className="absolute top-2 left-2 sm:top-4 sm:left-4 pointer-events-auto"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-cyan-400/30 min-w-[150px] sm:min-w-[200px]">
          <div className="space-y-2 sm:space-y-3">
            {/* Score with animated counter - Mobile optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-6 h-6 sm:w-10 sm:h-10 flex items-center justify-center">
                <Trophy className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <motion.div 
                  className="text-lg sm:text-2xl font-bold text-cyan-400"
                  key={score}
                  initial={{ scale: 1.2, color: '#ffffff' }}
                  animate={{ scale: 1, color: '#22d3ee' }}
                  transition={{ duration: 0.3 }}
                >
                  {score.toLocaleString()}
                </motion.div>
                <div className="text-xs text-gray-400">SCORE</div>
              </div>
            </div>
            
            {/* Speed indicator with dynamic color - Mobile optimized */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center ${
                speed > 6 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                speed > 3 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-green-500 to-emerald-500'
              }`}>
                <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <div className={`text-sm sm:text-lg font-bold ${
                  speed > 6 ? 'text-red-400' :
                  speed > 3 ? 'text-yellow-400' :
                  'text-green-400'
                }`}>
                  {speed.toFixed(1)}x
                </div>
                <div className="text-xs text-gray-400">SPEED</div>
              </div>
            </div>
            
            {/* Round Progress - Mobile friendly */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Questions</span>
                <span className="text-xs text-green-400">{questionsAnswered}/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(questionsAnswered / 10) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile-first Top Right - Health & Car Level */}
      <motion.div 
        className="absolute top-2 right-2 sm:top-4 sm:right-4 pointer-events-auto"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-4 border border-purple-400/30">
          <div className="space-y-2 sm:space-y-3">
            {/* Health Hearts - Mobile optimized */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Heart 
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                        i < health 
                          ? 'text-red-400 fill-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]' 
                          : 'text-gray-600'
                      }`} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Car Level with crown for high levels - Mobile optimized */}
            <div className="flex items-center gap-1 sm:gap-2">
              {carLevel >= 8 ? (
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              ) : (
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              )}
              <div>
                <div className={`text-sm sm:text-lg font-bold ${
                  carLevel >= 8 ? 'text-yellow-400' : 'text-purple-400'
                }`}>
                  LV.{carLevel}
                </div>
                <div className="text-xs text-gray-400">CAR</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile-first Center Top - Power-ups */}
      {(shieldTime > 0 || boostTime > 0) && (
        <motion.div 
          className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none sm:top-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="flex gap-2 sm:gap-4">
            {shieldTime > 0 && (
              <motion.div
                className="bg-blue-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-400/50"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 15px rgba(59, 130, 246, 0.5)',
                    '0 0 25px rgba(59, 130, 246, 0.8)',
                    '0 0 15px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="flex items-center gap-1 sm:gap-2 text-blue-300">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="font-bold text-xs sm:text-sm">
                    {Math.ceil(shieldTime / 1000)}s
                  </div>
                </div>
              </motion.div>
            )}
            
            {boostTime > 0 && (
              <motion.div
                className="bg-yellow-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-yellow-400/50"
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 15px rgba(251, 191, 36, 0.5)',
                    '0 0 25px rgba(251, 191, 36, 0.8)',
                    '0 0 15px rgba(251, 191, 36, 0.5)'
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="flex items-center gap-1 sm:gap-2 text-yellow-300">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="font-bold text-xs sm:text-sm">
                    {Math.ceil(boostTime / 1000)}s
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile-first Pause Button */}
      <motion.button
        onClick={onPause}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 mt-16 sm:mt-20 z-30 pointer-events-auto"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, rotate: -90 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-black/80 backdrop-blur-xl rounded-full p-2 sm:p-3 border border-white/20 hover:border-cyan-400/50 transition-all duration-300">
          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current rounded-sm relative">
            <div className="absolute left-0.5 sm:left-1 top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 w-0.5 sm:w-1 bg-current rounded-sm" />
            <div className="absolute right-0.5 sm:right-1 top-0.5 sm:top-1 bottom-0.5 sm:bottom-1 w-0.5 sm:w-1 bg-current rounded-sm" />
          </div>
        </div>
      </motion.button>

      {/* Mobile-responsive Speed Indicator Bars - Hidden on small screens */}
      <motion.div 
        className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 pointer-events-none hidden sm:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="flex flex-col gap-1">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1 h-3 sm:h-4 rounded-full transition-all duration-300 ${
                i < Math.floor(speed) 
                  ? speed > 6 ? 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]' : 
                    speed > 3 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 
                    'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                  : 'bg-gray-600'
              }`}
              animate={{
                scale: i < Math.floor(speed) ? [1, 1.2, 1] : 1,
                opacity: i < Math.floor(speed) ? [0.8, 1, 0.8] : 0.3
              }}
              transition={{
                duration: 0.5,
                repeat: i < Math.floor(speed) ? Infinity : 0,
                delay: i * 0.05
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Mobile-first Round Complete Celebration */}
      {roundComplete && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <motion.div
            className="text-center"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="text-3xl sm:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2"
              animate={{
                textShadow: [
                  "0 0 20px #10b981",
                  "0 0 40px #10b981",
                  "0 0 20px #10b981"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🎉 HOÀN THÀNH!
            </motion.div>
            <div className="text-gray-300 text-sm sm:text-lg">Returning to rounds...</div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
