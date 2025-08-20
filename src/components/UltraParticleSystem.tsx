import React from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  type: 'spark' | 'star' | 'circle' | 'trail' | 'explosion'
}

interface UltraParticleSystemProps {
  isActive: boolean
  intensity?: number
  type?: 'speed' | 'boost' | 'correct' | 'wrong' | 'powerup' | 'levelup' | 'ambient'
  position?: { x: number; y: number }
  direction?: 'up' | 'down' | 'left' | 'right' | 'explosion' | 'ambient'
  color?: string
}

const effectConfigs = {
  speed: {
    particleCount: 15,
    colors: ['#00f5ff', '#0080ff', '#4169e1'],
    types: ['trail', 'spark'] as const,
    life: 1000,
    speed: 3
  },
  boost: {
    particleCount: 25,
    colors: ['#ffd700', '#ffb347', '#ff6347'],
    types: ['star', 'spark'] as const,
    life: 1500,
    speed: 4
  },
  correct: {
    particleCount: 20,
    colors: ['#00ff00', '#32cd32', '#90ee90'],
    types: ['star', 'circle'] as const,
    life: 2000,
    speed: 2
  },
  wrong: {
    particleCount: 15,
    colors: ['#ff0000', '#ff4500', '#dc143c'],
    types: ['circle', 'spark'] as const,
    life: 1000,
    speed: 2
  },
  powerup: {
    particleCount: 30,
    colors: ['#ff00ff', '#9400d3', '#4b0082'],
    types: ['star', 'circle', 'spark'] as const,
    life: 2500,
    speed: 1.5
  },
  levelup: {
    particleCount: 50,
    colors: ['#ffd700', '#ff6347', '#ff1493', '#00ff00', '#00bfff'],
    types: ['star', 'circle', 'explosion'] as const,
    life: 3000,
    speed: 5
  },
  ambient: {
    particleCount: 8,
    colors: ['#ffffff', '#e0e0e0', '#c0c0c0'],
    types: ['circle', 'spark'] as const,
    life: 4000,
    speed: 0.5
  }
}

export default function UltraParticleSystem({
  isActive,
  intensity = 1,
  type = 'ambient',
  position = { x: 50, y: 50 },
  direction = 'up',
  color
}: UltraParticleSystemProps) {
  const [particles, setParticles] = React.useState<Particle[]>([])
  const animationRef = React.useRef<number | undefined>(undefined)
  const lastSpawnRef = React.useRef<number>(0)

  const config = effectConfigs[type]

  const createParticle = React.useCallback((id: number): Particle => {
    const colors = color ? [color] : config.colors
    const particleColor = colors[Math.floor(Math.random() * colors.length)]
    const particleType = config.types[Math.floor(Math.random() * config.types.length)]
    
    let vx = 0, vy = 0
    
    switch (direction) {
      case 'up':
        vx = (Math.random() - 0.5) * 2
        vy = -Math.random() * config.speed
        break
      case 'down':
        vx = (Math.random() - 0.5) * 2
        vy = Math.random() * config.speed
        break
      case 'left':
        vx = -Math.random() * config.speed
        vy = (Math.random() - 0.5) * 2
        break
      case 'right':
        vx = Math.random() * config.speed
        vy = (Math.random() - 0.5) * 2
        break
      case 'explosion':
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * config.speed
        vx = Math.cos(angle) * speed
        vy = Math.sin(angle) * speed
        break
      case 'ambient':
        vx = (Math.random() - 0.5) * config.speed
        vy = (Math.random() - 0.5) * config.speed
        break
    }

    return {
      id,
      x: position.x + (Math.random() - 0.5) * 20,
      y: position.y + (Math.random() - 0.5) * 20,
      vx: vx * intensity,
      vy: vy * intensity,
      life: config.life,
      maxLife: config.life,
      size: Math.random() * 4 + 2,
      color: particleColor,
      type: particleType
    }
  }, [position, intensity, config, direction, color])

  const updateParticles = React.useCallback(() => {
    const now = Date.now()
    
    setParticles(prevParticles => {
      let newParticles = [...prevParticles]
      
      // Spawn new particles
      if (isActive && now - lastSpawnRef.current > 50) {
        const spawnCount = Math.floor(config.particleCount * intensity / 10)
        for (let i = 0; i < spawnCount; i++) {
          newParticles.push(createParticle(now + i))
        }
        lastSpawnRef.current = now
      }
      
      // Update existing particles
      newParticles = newParticles
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 16, // Assuming 60fps
          vy: particle.vy + 0.1 // Gravity effect
        }))
        .filter(particle => particle.life > 0)
      
      return newParticles
    })
  }, [isActive, intensity, config, createParticle])

  React.useEffect(() => {
    const animate = () => {
      updateParticles()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, updateParticles])

  const renderParticle = (particle: Particle) => {
    const opacity = particle.life / particle.maxLife
    const scale = Math.sin((1 - opacity) * Math.PI) * 0.5 + 0.5

    switch (particle.type) {
      case 'star':
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: scale,
              rotate: 360,
              opacity: opacity
            }}
            transition={{ duration: 0.1 }}
          >
            <div 
              className="w-2 h-2 relative"
              style={{ color: particle.color }}
            >
              <div className="absolute inset-0 bg-current transform rotate-0" 
                   style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
            </div>
          </motion.div>
        )
      
      case 'circle':
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              transform: 'translate(-50%, -50%)',
              opacity: opacity,
              scale: scale,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
            }}
          />
        )
      
      case 'spark':
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [scale, scale * 1.5, scale],
              opacity: [opacity, opacity * 0.5, opacity],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <div 
              className="w-1 h-4 rounded-full"
              style={{ 
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size}px ${particle.color}`
              }} 
            />
          </motion.div>
        )
      
      case 'trail':
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div 
              className="w-8 h-1 rounded-full"
              style={{ 
                backgroundColor: particle.color,
                opacity: opacity,
                transform: `scale(${scale}, 1)`,
                boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`
              }} 
            />
          </motion.div>
        )
      
      case 'explosion':
        return (
          <motion.div
            key={particle.id}
            className="absolute pointer-events-none"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              scale: [0, scale * 2, 0],
              opacity: [0, opacity, 0],
              rotate: [0, 180]
            }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="w-6 h-6 rounded-full"
              style={{ 
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`
              }} 
            />
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(renderParticle)}
    </div>
  )
}
