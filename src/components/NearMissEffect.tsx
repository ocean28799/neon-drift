'use client'

import { motion } from 'framer-motion'

interface NearMissEffectProps {
  triggers: Array<{ id: string; x: number; y: number }>
}

export default function NearMissEffect({ triggers }: NearMissEffectProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {triggers.map(trigger => (
        <motion.div
          key={trigger.id}
          className="absolute"
          style={{
            left: `${trigger.x}%`,
            top: `${trigger.y}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Near miss text */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: -30 }}
            transition={{ duration: 0.8 }}
            className="text-yellow-400 font-bold text-xl"
            style={{
              textShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
              filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.6))'
            }}
          >
            NEAR MISS!
          </motion.div>
          
          {/* Expanding ring effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="w-8 h-8 border-2 border-yellow-400 rounded-full" />
          </motion.div>
          
          {/* Speed lines */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={{ 
                duration: 0.4, 
                ease: "easeOut",
                delay: i * 0.05 
              }}
            >
              <div className="w-12 h-0.5 bg-yellow-400" />
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}
