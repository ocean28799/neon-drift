'use client'

import { motion } from 'framer-motion'

interface ParticleSystemProps {
  particles: Array<{ id: string; x: number; y: number; type?: string }>
}

export default function ParticleSystem({ particles }: ParticleSystemProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.type === 'explosion' 
              ? 'bg-gradient-to-r from-red-400 to-orange-500'
              : particle.type === 'coin'
              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
              : 'bg-gradient-to-r from-cyan-400 to-blue-500'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: '8px',
            height: '8px',
          }}
          initial={{ 
            opacity: 1, 
            scale: 0.5,
            x: 0,
            y: 0
          }}
          animate={{ 
            opacity: 0, 
            scale: 1.5,
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  )
}
