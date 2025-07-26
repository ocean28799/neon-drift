'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap, Shield, Minimize2, ArrowUp } from 'lucide-react'

interface UpgradeNotificationProps {
  show: boolean
  level: number
  upgrades: {
    speed: number
    handling: number
    size: number
    wings: boolean
    boost: boolean
    shield: boolean
  }
}

export default function UpgradeNotification({ show, level, upgrades }: UpgradeNotificationProps) {
  const getUpgradeMessage = () => {
    switch(level) {
      case 2: return "Speed Boost!"
      case 3: return "Wings + Handling!"
      case 4: return "Compact Size!"
      case 5: return "Boost Engine!"
      case 6: return "Shield Generator!"
      case 7: return "Maximum Speed!"
      case 8: return "Ultra Compact!"
      case 9: return "Enhanced Handling!"
      case 10: return "GOD MODE!"
      default: return "Car Upgraded!"
    }
  }

  const getUpgradeIcon = () => {
    switch(level) {
      case 2: case 5: case 7: return <Zap className="w-6 h-6 text-yellow-400" />
      case 3: case 9: return <ArrowUp className="w-6 h-6 text-blue-400" />
      case 4: case 8: return <Minimize2 className="w-6 h-6 text-green-400" />
      case 6: return <Shield className="w-6 h-6 text-blue-400" />
      case 10: return <Star className="w-6 h-6 text-purple-400" />
      default: return <Star className="w-6 h-6 text-yellow-400" />
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-gradient-to-br from-yellow-400/90 to-orange-500/90 backdrop-blur-lg rounded-2xl p-6 border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/50">
            <div className="text-center">
              <motion.div
                className="flex justify-center mb-3"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {getUpgradeIcon()}
              </motion.div>
              
              <div className="text-white text-xl font-bold mb-2">
                LEVEL {level}!
              </div>
              
              <div className="text-yellow-100 text-sm font-semibold mb-3">
                {getUpgradeMessage()}
              </div>
              
              <div className="flex justify-center gap-2 text-xs">
                {upgrades.speed > 1 && (
                  <div className="bg-blue-500/30 px-2 py-1 rounded text-blue-200">
                    Speed {upgrades.speed.toFixed(1)}x
                  </div>
                )}
                {upgrades.handling > 1 && (
                  <div className="bg-green-500/30 px-2 py-1 rounded text-green-200">
                    Handling {upgrades.handling.toFixed(1)}x
                  </div>
                )}
                {upgrades.size < 1 && (
                  <div className="bg-purple-500/30 px-2 py-1 rounded text-purple-200">
                    Size {upgrades.size.toFixed(1)}x
                  </div>
                )}
                {upgrades.wings && (
                  <div className="bg-cyan-500/30 px-2 py-1 rounded text-cyan-200">
                    Wings
                  </div>
                )}
                {upgrades.boost && (
                  <div className="bg-orange-500/30 px-2 py-1 rounded text-orange-200">
                    Boost
                  </div>
                )}
                {upgrades.shield && (
                  <div className="bg-blue-500/30 px-2 py-1 rounded text-blue-200">
                    Shield
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
