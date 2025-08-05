'use client'

import { motion } from 'framer-motion'

interface LoadingAnimationProps {
  countdown: number
}

export default function LoadingAnimation({ countdown }: LoadingAnimationProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: 0
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Animated car */}
        <motion.div
          className="mb-8"
          animate={{
            y: [0, -20, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="relative w-32 h-64 mx-auto"
            animate={{
              rotateY: [0, 360]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* 3D Car Body */}
            <div className="relative w-full h-full">
              {/* Main body */}
              <motion.div
                className="absolute inset-x-4 top-16 bottom-8 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-xl shadow-2xl"
                animate={{
                  boxShadow: [
                    '0 0 20px #06b6d4, 0 0 40px #06b6d4',
                    '0 0 40px #06b6d4, 0 0 60px #06b6d4',
                    '0 0 20px #06b6d4, 0 0 40px #06b6d4'
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                {/* Front windshield */}
                <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg opacity-80" />
                
                {/* Side windows */}
                <div className="absolute top-12 left-1 w-2 h-12 bg-gradient-to-b from-blue-200 to-blue-400 rounded opacity-60" />
                <div className="absolute top-12 right-1 w-2 h-12 bg-gradient-to-b from-blue-200 to-blue-400 rounded opacity-60" />
                
                {/* Headlights */}
                <motion.div
                  className="absolute bottom-2 left-1 w-2 h-2 bg-white rounded-full"
                  animate={{
                    opacity: [1, 0.3, 1]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity
                  }}
                />
                <motion.div
                  className="absolute bottom-2 right-1 w-2 h-2 bg-white rounded-full"
                  animate={{
                    opacity: [1, 0.3, 1]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: 0.4
                  }}
                />
                
                {/* Racing stripes */}
                <div className="absolute inset-x-0 top-1/2 h-1 bg-white opacity-40 rounded" />
              </motion.div>
              
              {/* Wheels */}
              <motion.div
                className="absolute bottom-4 left-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-1 bg-gray-700 rounded-full" />
              </motion.div>
              <motion.div
                className="absolute bottom-4 right-2 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-600"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-1 bg-gray-700 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(6, 182, 212, 0.2)"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: countdown === 0 ? 1 : (3 - countdown) / 3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Countdown number */}
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300,
              damping: 20 
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {countdown === 0 ? 'GO!' : countdown}
            </span>
          </motion.div>
        </div>

        {/* Loading text */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
          className="text-cyan-300 text-xl font-semibold"
        >
          {countdown === 0 ? 'Starting Race...' : 'Get Ready...'}
        </motion.div>

        {/* Speed lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, 400],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
