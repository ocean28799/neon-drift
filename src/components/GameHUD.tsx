'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Trophy, Gauge, Heart } from 'lucide-react'

interface GameHUDProps {
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

export default function GameHUD({ 
  score, 
  speed, 
  shieldTime, 
  boostTime, 
  health, 
  carLevel, 
  questionsAnswered = 0,
  roundComplete = false,
  onPause 
}: GameHUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Left panel - Score and stats */}
        <motion.div 
          className="glass-dark rounded-xl p-4 pointer-events-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {score.toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">SCORE</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-lg font-bold text-purple-400">
                  {speed.toFixed(1)}x
                </div>
                <div className="text-xs text-gray-400">SPEED</div>
              </div>
            </div>
            
            {/* Round Progress */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">
                  {questionsAnswered}/10
                </div>
                <div className="text-xs text-gray-400">QUESTIONS</div>
              </div>
            </div>
            
            {/* Round Progress Bar */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">Round Progress</span>
                <span className="text-xs text-green-400">{Math.round((questionsAnswered / 10) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(questionsAnswered / 10) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
            
            {/* Round Complete Indicator */}
            {roundComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30"
              >
                <div className="text-green-400 font-bold text-sm">🎉 ROUND COMPLETE!</div>
                <div className="text-xs text-gray-300">Returning to rounds...</div>
              </motion.div>
            )}
            
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-400" />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <Heart 
                    key={i}
                    className={`w-4 h-4 ${i < health ? 'text-red-400 fill-red-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
            
            {/* Car Level */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-sm flex items-center justify-center">
                <span className="text-black text-xs font-bold">L</span>
              </div>
              <span className="text-yellow-400 font-bold">Level {carLevel}</span>
            </div>
          </div>
        </motion.div>

        {/* Right panel - Pause button */}
        <motion.button
          onClick={onPause}
          className="glass-dark rounded-xl p-4 text-white hover:bg-white/20 transition-colors pointer-events-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-6 h-6 border-2 border-current rounded-sm relative">
            <div className="absolute left-1 top-1 bottom-1 w-1 bg-current rounded-sm" />
            <div className="absolute right-1 top-1 bottom-1 w-1 bg-current rounded-sm" />
          </div>
        </motion.button>
      </div>

      {/* Power-up indicators */}
      {(shieldTime > 0 || boostTime > 0) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-4">
            {shieldTime > 0 && (
              <motion.div
                className="glass-dark rounded-xl p-3 flex items-center gap-2"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 30px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Shield className="w-5 h-5 text-blue-400" />
                <div className="text-blue-400 font-bold">
                  {Math.ceil(shieldTime / 1000)}s
                </div>
              </motion.div>
            )}
            
            {boostTime > 0 && (
              <motion.div
                className="glass-dark rounded-xl p-3 flex items-center gap-2"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(251, 191, 36, 0.5)',
                    '0 0 30px rgba(251, 191, 36, 0.8)',
                    '0 0 20px rgba(251, 191, 36, 0.5)'
                  ]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Zap className="w-5 h-5 text-yellow-400" />
                <div className="text-yellow-400 font-bold">
                  {Math.ceil(boostTime / 1000)}s
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Speed indicator bars */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="flex flex-col gap-1">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-1 h-4 rounded-full ${
                i < Math.floor(speed) 
                  ? speed > 6 ? 'bg-red-400' : speed > 3 ? 'bg-yellow-400' : 'bg-cyan-400'
                  : 'bg-gray-600'
              }`}
              animate={{
                opacity: i < Math.floor(speed) ? [0.6, 1, 0.6] : 0.3,
              }}
              transition={{
                duration: 0.5,
                repeat: i < Math.floor(speed) ? Infinity : 0,
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-400 opacity-50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-cyan-400 opacity-50" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-cyan-400 opacity-50" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-400 opacity-50" />
    </div>
  )
}
