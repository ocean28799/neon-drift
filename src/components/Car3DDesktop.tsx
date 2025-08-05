import React from 'react'
import { motion } from 'framer-motion'

interface Car3DDesktopProps {
  carColor: string
  carGradient: string
  carLevel: number
  boost: boolean
  shield: boolean
  size: number
  isPremium?: boolean
}

export default function Car3DDesktop({ 
  carColor, 
  carGradient, 
  carLevel, 
  boost, 
  shield, 
  size,
  isPremium = false 
}: Car3DDesktopProps) {
  const getCarBrightness = () => {
    if (carLevel >= 8) return `brightness(${1.2 + (carLevel - 8) * 0.1}) contrast(${1.1 + (carLevel - 8) * 0.05})`
    return 'none'
  }

  const getCarGlow = () => {
    if (carLevel >= 8) {
      return [
        `0 0 ${20 + carLevel * 2}px rgba(255, 255, 255, 0.${Math.min(8, carLevel - 6)})`,
        `0 0 ${30 + carLevel * 3}px rgba(255, 255, 255, 0.${Math.min(8, carLevel - 6)})`,
        `0 0 ${20 + carLevel * 2}px rgba(255, 255, 255, 0.${Math.min(8, carLevel - 6)})`
      ]
    }
    return undefined
  }

  return (
    <motion.div
      className="relative w-full h-full"
      style={{
        transform: `${carLevel > 4 ? 'scale(1.1)' : 'scale(1)'} scale(${size})`,
        filter: getCarBrightness()
      }}
      animate={{
        x: boost ? [0, 3, 0] : 0,
        boxShadow: getCarGlow()
      }}
      transition={{
        duration: boost ? 0.3 : 1,
        repeat: Infinity,
        boxShadow: { duration: 2, repeat: Infinity }
      }}
    >
      {/* Car Body - Horizontal orientation */}
      <div className="relative w-full h-full">
        
        {/* Main Car Body */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r ${carGradient} rounded-lg ${
            shield ? 'shadow-blue-500/75' : `shadow-${carColor}-500/50`
          } shadow-2xl ${
            carLevel >= 6 ? 'border-2 border-white/60' : 
            carLevel >= 4 ? 'border-2 border-cyan-400/60' : 
            carLevel >= 2 ? 'border-2 border-yellow-400/60' : 'border border-gray-400/30'
          } transition-all duration-700`}
          style={{
            clipPath: 'polygon(0% 20%, 15% 0%, 85% 0%, 100% 20%, 100% 80%, 85% 100%, 15% 100%, 0% 80%)',
            filter: isPremium ? 'hue-rotate(0deg) saturate(1.5)' : 'none'
          }}
        >
          {/* Premium Rainbow Effect */}
          {isPremium && (
            <div 
              className="absolute inset-0 opacity-40 rounded-lg"
              style={{
                background: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #8000ff, #ff0080)',
                backgroundSize: '200% 100%',
                clipPath: 'polygon(0% 20%, 15% 0%, 85% 0%, 100% 20%, 100% 80%, 85% 100%, 15% 100%, 0% 80%)',
                animation: 'rainbow-shift 3s linear infinite'
              }}
            />
          )}
          
          {/* Car Hood Detail */}
          <div 
            className="absolute bg-black/20 rounded-sm"
            style={{
              left: '75%',
              top: '25%',
              width: '20%',
              height: '50%',
              clipPath: 'polygon(0% 0%, 80% 10%, 80% 90%, 0% 100%)'
            }}
          />
          
          {/* Windshield */}
          <div 
            className="absolute bg-gradient-to-r from-blue-300/60 to-blue-400/80 rounded-sm"
            style={{
              left: '60%',
              top: '15%',
              width: '15%',
              height: '70%',
              clipPath: 'polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%)'
            }}
          />
          
          {/* Side Windows */}
          <div 
            className="absolute bg-blue-300/50 rounded-sm"
            style={{
              left: '45%',
              top: '20%',
              width: '15%',
              height: '25%'
            }}
          />
          <div 
            className="absolute bg-blue-300/50 rounded-sm"
            style={{
              left: '45%',
              top: '55%',
              width: '15%',
              height: '25%'
            }}
          />
          
          {/* Headlights */}
          <div 
            className="absolute bg-yellow-200 rounded-full shadow-lg"
            style={{
              left: '90%',
              top: '25%',
              width: '8%',
              height: '15%',
              boxShadow: carLevel >= 6 ? '0 0 10px rgba(255, 255, 0, 0.8)' : '0 0 5px rgba(255, 255, 255, 0.5)'
            }}
          />
          <div 
            className="absolute bg-yellow-200 rounded-full shadow-lg"
            style={{
              left: '90%',
              top: '60%',
              width: '8%',
              height: '15%',
              boxShadow: carLevel >= 6 ? '0 0 10px rgba(255, 255, 0, 0.8)' : '0 0 5px rgba(255, 255, 255, 0.5)'
            }}
          />
          
          {/* Taillights */}
          <div 
            className="absolute bg-red-500 rounded-full"
            style={{
              left: '2%',
              top: '30%',
              width: '6%',
              height: '12%'
            }}
          />
          <div 
            className="absolute bg-red-500 rounded-full"
            style={{
              left: '2%',
              top: '58%',
              width: '6%',
              height: '12%'
            }}
          />
          
          {/* Car Details/Vents */}
          <div 
            className="absolute bg-black/30"
            style={{
              left: '25%',
              top: '10%',
              width: '20%',
              height: '5%'
            }}
          />
          <div 
            className="absolute bg-black/30"
            style={{
              left: '25%',
              top: '85%',
              width: '20%',
              height: '5%'
            }}
          />
          
          {/* Racing Stripes (for higher levels) */}
          {carLevel >= 3 && (
            <>
              <div 
                className="absolute bg-white/40"
                style={{
                  left: '20%',
                  top: '35%',
                  width: '60%',
                  height: '8%'
                }}
              />
              <div 
                className="absolute bg-white/40"
                style={{
                  left: '20%',
                  top: '57%',
                  width: '60%',
                  height: '8%'
                }}
              />
            </>
          )}
          
          {/* Spoiler (for level 5+) */}
          {carLevel >= 5 && (
            <div 
              className="absolute bg-black border border-gray-400"
              style={{
                left: '8%',
                top: '20%',
                width: '8%',
                height: '60%',
                clipPath: 'polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%)'
              }}
            />
          )}
          
          {/* Exhaust pipes */}
          <div 
            className="absolute bg-gray-600 rounded-full border border-gray-400"
            style={{
              left: '0%',
              top: '35%',
              width: '4%',
              height: '8%'
            }}
          />
          <div 
            className="absolute bg-gray-600 rounded-full border border-gray-400"
            style={{
              left: '0%',
              top: '57%',
              width: '4%',
              height: '8%'
            }}
          />
          
          {/* Boost Effect */}
          {boost && (
            <>
              <motion.div
                className="absolute bg-blue-400 rounded-full opacity-70"
                style={{
                  left: '-8%',
                  top: '35%',
                  width: '12%',
                  height: '8%'
                }}
                animate={{
                  scaleX: [1, 1.5, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity
                }}
              />
              <motion.div
                className="absolute bg-blue-400 rounded-full opacity-70"
                style={{
                  left: '-8%',
                  top: '57%',
                  width: '12%',
                  height: '8%'
                }}
                animate={{
                  scaleX: [1, 1.5, 1],
                  opacity: [0.7, 0.3, 0.7]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  delay: 0.1
                }}
              />
            </>
          )}
        </div>
        
        {/* Wheels */}
        <motion.div 
          className="absolute bg-gray-800 rounded-full border-4 border-gray-600"
          style={{
            left: '75%',
            top: '5%',
            width: '15%',
            height: '25%'
          }}
          animate={{ rotate: boost ? 720 : 360 }}
          transition={{ duration: boost ? 0.5 : 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 bg-gray-600 rounded-full">
            <div className="absolute inset-1 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bg-gray-800 rounded-full border-4 border-gray-600"
          style={{
            left: '75%',
            top: '70%',
            width: '15%',
            height: '25%'
          }}
          animate={{ rotate: boost ? 720 : 360 }}
          transition={{ duration: boost ? 0.5 : 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 bg-gray-600 rounded-full">
            <div className="absolute inset-1 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bg-gray-800 rounded-full border-4 border-gray-600"
          style={{
            left: '15%',
            top: '5%',
            width: '15%',
            height: '25%'
          }}
          animate={{ rotate: boost ? 720 : 360 }}
          transition={{ duration: boost ? 0.5 : 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 bg-gray-600 rounded-full">
            <div className="absolute inset-1 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bg-gray-800 rounded-full border-4 border-gray-600"
          style={{
            left: '15%',
            top: '70%',
            width: '15%',
            height: '25%'
          }}
          animate={{ rotate: boost ? 720 : 360 }}
          transition={{ duration: boost ? 0.5 : 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-2 bg-gray-600 rounded-full">
            <div className="absolute inset-1 bg-gray-700 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </div>
          </div>
        </motion.div>
        
        {/* Shield Effect */}
        {shield && (
          <motion.div
            className="absolute inset-0 border-4 border-blue-400 rounded-lg"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
            style={{
              clipPath: 'polygon(0% 20%, 15% 0%, 85% 0%, 100% 20%, 100% 80%, 85% 100%, 15% 100%, 0% 80%)'
            }}
          />
        )}
      </div>
      
      <style jsx>{`
        @keyframes rainbow-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </motion.div>
  )
}
