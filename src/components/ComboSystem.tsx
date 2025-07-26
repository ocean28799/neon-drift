'use client'

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface ComboSystemProps {
  combo: number
  multiplier: number
  onComboBreak: () => void
}

export default function ComboSystem({ combo, multiplier }: ComboSystemProps) {
  if (combo < 2) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="absolute top-1/4 right-8 z-30"
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 glass-dark border-2 border-orange-400"
        style={{
          boxShadow: '0 0 30px rgba(251, 146, 60, 0.8), 0 0 60px rgba(251, 146, 60, 0.4)'
        }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-6 h-6 text-orange-300" />
            <span className="text-orange-300 font-bold text-lg">COMBO</span>
            <Flame className="w-6 h-6 text-orange-300" />
          </div>
          
          <motion.div
            key={combo}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-white mb-1"
          >
            {combo}
          </motion.div>
          
          <div className="text-yellow-300 font-bold text-sm">
            {multiplier.toFixed(1)}x MULTIPLIER
          </div>
          
          {/* Combo level indicators */}
          <div className="flex justify-center gap-1 mt-2">
            {[...Array(Math.min(5, Math.floor(combo / 5)))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-2 h-2 bg-yellow-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Floating combo text */}
      {combo % 5 === 0 && combo > 0 && (
        <motion.div
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -50, opacity: 0, scale: 1.5 }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-xl pointer-events-none"
        >
          COMBO BOOST!
        </motion.div>
      )}
    </motion.div>
  )
}
