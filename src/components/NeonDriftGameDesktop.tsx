'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Pause, Zap, Shield } from 'lucide-react'
import { soundEngine } from '@/utils/soundEngine'
import ParticleSystem from './ParticleSystem'
import CarTrail from './CarTrail'
import GameHUD from './GameHUD'
import ComboSystem from './ComboSystem'
import ScreenShake from './ScreenShake'
import NearMissEffect from './NearMissEffect'
import StreakCounter from './StreakCounter'
import LanguageLearningDesktop from './LanguageLearningDesktop'
import AnswerBoxDesktop from './AnswerBoxDesktop'
import Car3DDesktop from './Car3DDesktop'

// Import all vocabulary chapters
import { chapter01Words } from '@/vocabulary/chapter01-basic-everyday'
import { chapter02Words } from '@/vocabulary/chapter02-family-people'
import { chapter03Words } from '@/vocabulary/chapter03-food-drink'
import { chapter04Words } from '@/vocabulary/chapter04-house-home'
import { chapter05Words } from '@/vocabulary/chapter05-transportation'
import { chapter06Words } from '@/vocabulary/chapter06-work-career'
import { chapter07Words } from '@/vocabulary/chapter07-health-body'
import { chapter08Words } from '@/vocabulary/chapter08-education-learning'
import { chapter09Words } from '@/vocabulary/chapter09-technology-communication'
import { chapter10Words } from '@/vocabulary/chapter10-shopping-commerce'
import { chapter11Words } from '@/vocabulary/chapter11-sports-recreation'
import { chapter12Words } from '@/vocabulary/chapter12-weather-nature'
import { chapter13Words } from '@/vocabulary/chapter13-emotions-feelings'
import { chapter14Words } from '@/vocabulary/chapter14-time-calendar'
import { chapter15Words } from '@/vocabulary/chapter15-transportation-travel'
import { chapter16Words } from '@/vocabulary/chapter16-colors-descriptions'
import { chapter17Words } from '@/vocabulary/chapter17-clothing-fashion'
import { chapter18Words } from '@/vocabulary/chapter18-hobbies-entertainment'
import { chapter19Words } from '@/vocabulary/chapter19-work-professions'
import { chapter20Words } from '@/vocabulary/chapter20-relationships-social'
import { chapter21Words } from '@/vocabulary/chapter21-household-items'
import { chapter22Words } from '@/vocabulary/chapter22-numbers-mathematics'
import { chapter23Words } from '@/vocabulary/chapter23-communication-language'
import { chapter24Words } from '@/vocabulary/chapter24-arts-culture'
import { chapter25Words } from '@/vocabulary/chapter25-emotions-feelings'
import { chapter26Words } from '@/vocabulary/chapter26-weather-seasons'
import { chapter27Words } from '@/vocabulary/chapter27-sports-fitness'
import { chapter28Words } from '@/vocabulary/chapter28-science-nature'
import { chapter29Words } from '@/vocabulary/chapter29-daily-routines-time'
import { chapter30Words } from '@/vocabulary/chapter30-advanced-essential'
import { chapter31Words } from '@/vocabulary/chapter31-punctuation-symbols'

interface LanguageWord {
  id: string
  english: string
  vietnamese: string
  pronunciation: string
  category: string
  difficulty: number
  chapter: string
  examples?: string[]
  synonym?: string
  antonym?: string
}

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

interface NeonDriftGameDesktopProps {
  onGameEnd: (score: number) => void
  onPause: () => void
  onLanguageLearning?: () => void
  onSpeedChange?: (speed: number) => void
  onRoundComplete?: (roundId: string) => void
  selectedCar: Car
  selectedChapter: string
  selectedRound?: string
}

// Vocabulary database
const vocabularyDatabase = {
  'chapter01': chapter01Words,
  'chapter02': chapter02Words,
  'chapter03': chapter03Words,
  'chapter04': chapter04Words,
  'chapter05': chapter05Words,
  'chapter06': chapter06Words,
  'chapter07': chapter07Words,
  'chapter08': chapter08Words,
  'chapter09': chapter09Words,
  'chapter10': chapter10Words,
  'chapter11': chapter11Words,
  'chapter12': chapter12Words,
  'chapter13': chapter13Words,
  'chapter14': chapter14Words,
  'chapter15': chapter15Words,
  'chapter16': chapter16Words,
  'chapter17': chapter17Words,
  'chapter18': chapter18Words,
  'chapter19': chapter19Words,
  'chapter20': chapter20Words,
  'chapter21': chapter21Words,
  'chapter22': chapter22Words,
  'chapter23': chapter23Words,
  'chapter24': chapter24Words,
  'chapter25': chapter25Words,
  'chapter26': chapter26Words,
  'chapter27': chapter27Words,
  'chapter28': chapter28Words,
  'chapter29': chapter29Words,
  'chapter30': chapter30Words,
  'chapter31': chapter31Words,
  // Legacy support for old chapter names
  basics: chapter01Words,
  family: chapter01Words.filter(word => word.category === 'family'),
  food: chapter02Words.filter(word => word.category === 'fruits' || word.category === 'vegetables' || word.category === 'meals' || word.category === 'beverages')
}

export default function NeonDriftGameDesktop({ 
  onGameEnd, 
  onPause, 
  onLanguageLearning, 
  onSpeedChange, 
  onRoundComplete,
  selectedCar, 
  selectedChapter,
  selectedRound 
}: NeonDriftGameDesktopProps) {
  const [playerY, setPlayerY] = useState(50) // percentage - for horizontal movement
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(0.7) // Reduced from 1 to 0.7 for better desktop experience
  const [health, setHealth] = useState(3)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [roundComplete, setRoundComplete] = useState(false)
  
  // Car upgrade system
  const [carLevel, setCarLevel] = useState(1)
  const [carUpgrades, setCarUpgrades] = useState({
    speed: 1,
    handling: 1,
    size: 1,
    wings: false,
    boost: false,
    shield: false
  })
  
  const [currentQuestion, setCurrentQuestion] = useState<LanguageWord | null>(null)
  const [questionType, setQuestionType] = useState<'translate' | 'reverse'>('translate')
  const [isQuestionActive, setIsQuestionActive] = useState(false)
  const [answerBoxes, setAnswerBoxes] = useState<Array<{
    id: string
    x: number
    y: number
    width: number
    height: number
    lane: 'top' | 'bottom' // Changed to top/bottom for horizontal layout
    answer: string
    isCorrect: boolean
    color: string
  }>>([])
  
  // Question timing
  const questionTimer = useRef(0)
  const [powerups, setPowerups] = useState<{ shield: number; boost: number }>({
    shield: 0,
    boost: 0
  })
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number }>>([])
  
  // Game state
  const [combo, setCombo] = useState(0)
  const [multiplier, setMultiplier] = useState(1.0)
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [shakeTrigger, setShakeTrigger] = useState(0)
  const [nearMisses, setNearMisses] = useState<Array<{ id: string; x: number; y: number }>>([])
  const [totalCoins, setTotalCoins] = useState(0)
  
  const gameLoopRef = useRef<number | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Two-lane system state for horizontal (top/bottom lanes)
  const [currentLane, setCurrentLane] = useState<'top' | 'bottom'>('top')
  const [laneChangeKeys, setLaneChangeKeys] = useState<Set<string>>(new Set())

  // Initialize sounds
  useEffect(() => {
    soundEngine.initSounds()
    soundEngine.enable()
  }, [])

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Generate a new question for horizontal layout
  const generateQuestion = useCallback(() => {
    const vocabulary = vocabularyDatabase[selectedChapter as keyof typeof vocabularyDatabase] || vocabularyDatabase.chapter01
    const availableWords = vocabulary.filter(word => word.difficulty <= Math.min(3, Math.floor(speed / 2) + 1))
    
    if (availableWords.length === 0) return
    
    const word = availableWords[Math.floor(Math.random() * availableWords.length)]
    
    // Always Vietnamese → English
    const type = 'translate'
    setQuestionType(type)
    
    // Get wrong answer from same category
    const wrongAnswers = vocabulary.filter(w => w.id !== word.id && w.category === word.category)
    const wrongWord = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)] || vocabulary[0]
    
    const correctAnswer = word.english // Always English answer
    const wrongAnswer = wrongWord.english // Always English wrong answer
    const correctSide: 'top' | 'bottom' = Math.random() > 0.5 ? 'top' : 'bottom'
    
    setCurrentQuestion(word)
    setIsQuestionActive(true)
    
    // Delay answer box spawn by 2 seconds
    setTimeout(() => {
      const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
        'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500',
        'bg-lime-500', 'bg-amber-500', 'bg-teal-500', 'bg-sky-500'
      ]
      
      const topColor = colors[Math.floor(Math.random() * colors.length)]
      let bottomColor = colors[Math.floor(Math.random() * colors.length)]
      
      while (bottomColor === topColor) {
        bottomColor = colors[Math.floor(Math.random() * colors.length)]
      }
      
      // Answer boxes come from the right side horizontally
      const topBox = {
        id: generateId(),
        x: 110, // Start from right side
        y: 25, // Top lane position
        width: 12,
        height: 8,
        lane: 'top' as const,
        answer: correctSide === 'top' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'top',
        color: topColor
      }
      
      const bottomBox = {
        id: generateId(),
        x: 110, // Start from right side
        y: 75, // Bottom lane position
        width: 12,
        height: 8,
        lane: 'bottom' as const,
        answer: correctSide === 'bottom' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'bottom',
        color: bottomColor
      }
      
      console.log(`Correct side: ${correctSide}`)
      console.log(`Top box: "${topBox.answer}" (correct: ${topBox.isCorrect})`)
      console.log(`Bottom box: "${bottomBox.answer}" (correct: ${bottomBox.isCorrect})`)
      
      setAnswerBoxes([topBox, bottomBox])
    }, 2000)
  }, [selectedChapter, speed])

  // Car upgrade function
  const upgradeCarLevel = useCallback(() => {
    setCarLevel(prev => {
      const newLevel = prev + 1
      
      setCarUpgrades(prevUpgrades => {
        const newUpgrades = { ...prevUpgrades }
        
        switch(newLevel) {
          case 2:
            newUpgrades.speed = 1.2
            break
          case 4:
            newUpgrades.handling = 1.3
            newUpgrades.wings = true
            break
          case 6:
            newUpgrades.size = 0.8
            newUpgrades.speed = 1.5
            break
          case 8:
            newUpgrades.boost = true
            newUpgrades.shield = true
            newUpgrades.speed = 2.0
            break
          case 10:
            newUpgrades.size = 0.6
            newUpgrades.handling = 1.8
            break
          case 12:
            newUpgrades.handling = 2.0
            break
          case 14:
            newUpgrades.speed = 2.5
            newUpgrades.size = 0.5
            newUpgrades.handling = 2.5
            break
        }
        
        return newUpgrades
      })
      
      return newLevel
    })
  }, [])

  // Collision detection for horizontal layout
  const checkAnswerBoxCollision = useCallback((box: {
    x: number
    y: number
    width: number
    height: number
    lane: 'top' | 'bottom'
  }) => {
    const playerWidth = 10 // Fixed width for horizontal layout
    const playerX = 15 // Car X position (fixed on left side)
    const xBuffer = 5 // Buffer for X collision
    
    // Check X collision (horizontal movement)
    const xCollision = (
      box.x - xBuffer < playerX + playerWidth &&
      box.x + box.width + xBuffer > playerX
    )
    
    // For lane-based collision, check if player is in same lane
    const laneCollision = box.lane === currentLane
    
    const collision = xCollision && laneCollision
    
    if (collision) {
      console.log('🔍 Horizontal Collision Debug:')
      console.log(`Player lane: ${currentLane}, Box lane: ${box.lane}`)
      console.log(`Player X: ${playerX}%, Box X: ${box.x}%`)
      console.log(`X collision: ${xCollision}, Lane match: ${laneCollision}`)
    }
    
    return collision
  }, [currentLane])

  // Handle answer box collisions
  const handleAnswerBoxCollisions = useCallback(() => {
    if (!isQuestionActive || answerBoxes.length === 0) return
    
    const boxInCurrentLane = answerBoxes.find(box => box.lane === currentLane)
    
    if (!boxInCurrentLane) return
    
    if (checkAnswerBoxCollision(boxInCurrentLane)) {
      console.log('🎯 HORIZONTAL ANSWER BOX COLLISION!')
      console.log(`Car lane: ${currentLane}, Box lane: ${boxInCurrentLane.lane}`)
      console.log(`Answer: "${boxInCurrentLane.answer}", Is Correct: ${boxInCurrentLane.isCorrect}`)
      
      const wasCorrectAnswer = boxInCurrentLane.isCorrect
      
      setIsQuestionActive(false)
      setAnswerBoxes([])
      setCurrentQuestion(null)
      
      if (wasCorrectAnswer) {
        console.log('✅ CORRECT ANSWER!')
        
        setScore(prev => prev + 100)
        setCombo(prev => prev + 1)
        soundEngine.play('success', 0.8)
        
        setShakeIntensity(2)
        setShakeTrigger(prev => prev + 1)
        
        upgradeCarLevel()
        
        const successParticles = Array.from({ length: 15 }, () => ({
          id: generateId(),
          x: 15 + Math.random() * 8,
          y: playerY + Math.random() * 6
        }))
        setParticles(prev => [...prev, ...successParticles])
        
        setQuestionsAnswered(prev => {
          const newCount = prev + 1
          console.log(`Questions answered: ${newCount}/10`)
          
          if (newCount >= 10 && selectedRound && onRoundComplete) {
            console.log('🎉 ROUND COMPLETE!')
            setRoundComplete(true)
            setTimeout(() => onRoundComplete(selectedRound), 1000)
            return newCount
          }
          
          return newCount
        })
        
      } else {
        console.log('❌ WRONG ANSWER!')
        
        setHealth(prev => {
          const newHealth = prev - 1
          console.log(`Health reduced: ${prev} → ${newHealth}`)
          
          if (newHealth <= 0) {
            console.log('💀 GAME OVER!')
            setTimeout(() => onGameEnd(score), 100)
            return 0
          }
          
          return newHealth
        })
        
        setCombo(0)
        soundEngine.play('crash', 0.6)
        
        setShakeIntensity(5)
        setShakeTrigger(prev => prev + 1)
      }
      
      questionTimer.current = Date.now()
    }
  }, [
    isQuestionActive, 
    answerBoxes, 
    currentLane,
    checkAnswerBoxCollision, 
    selectedRound,
    onRoundComplete,
    onGameEnd,
    score,
    playerY,
    upgradeCarLevel
  ])

  // Handle keyboard controls for up/down movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'escape') {
        onPause()
        return
      }
      
      if (['arrowup', 'w', 'arrowdown', 's'].includes(key)) {
        setLaneChangeKeys(prev => new Set(prev).add(key))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      setLaneChangeKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
    }

    const handleClick = (e: MouseEvent) => {
      const screenHeight = window.innerHeight
      const clickY = e.clientY
      
      // Top half = top lane, bottom half = bottom lane
      if (clickY < screenHeight / 2) {
        setCurrentLane('top')
      } else {
        setCurrentLane('bottom')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('click', handleClick)
    }
  }, [onPause])

  // Handle lane changes
  useEffect(() => {
    if (laneChangeKeys.has('arrowup') || laneChangeKeys.has('w')) {
      setCurrentLane('top')
      console.log('🚗 LANE CHANGE: Moving to TOP lane')
    }
    if (laneChangeKeys.has('arrowdown') || laneChangeKeys.has('s')) {
      setCurrentLane('bottom')
      console.log('🚗 LANE CHANGE: Moving to BOTTOM lane')
    }
  }, [laneChangeKeys])

  // Update player position for visual movement
  useEffect(() => {
    const targetY = currentLane === 'top' ? 25 : 75 // Top lane at 25%, bottom lane at 75%
    
    const moveToLane = () => {
      setPlayerY(prev => {
        const diff = targetY - prev
        if (Math.abs(diff) < 1) return targetY
        
        const smoothness = 0.4 * carUpgrades.handling
        return prev + (diff * Math.min(smoothness, 0.9))
      })
    }

    const interval = setInterval(moveToLane, 12)
    return () => clearInterval(interval)
  }, [currentLane, carUpgrades.handling])

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      // Clean up particles
      setParticles(prev => prev.filter((_, i) => i < 20))
      
      // Handle answer box collisions
      handleAnswerBoxCollisions()
      
      // Move answer boxes left (horizontal movement)
      setAnswerBoxes(prev => {
        const movingBoxes = prev.map(box => ({ ...box, x: box.x - speed * 2 })) // Move left
        
        // Check if any answer boxes reached the left side (missed)
        const reachedLeft = movingBoxes.filter(box => box.x <= -20)
        if (reachedLeft.length > 0 && isQuestionActive) {
          console.log('⚠️ ANSWER BOXES MISSED!')
          
          setIsQuestionActive(false)
          setCurrentQuestion(null)
          questionTimer.current = Date.now()
          
          setTimeout(() => {
            console.log('❌ PROCESSING MISSED QUESTION')
            
            setHealth(prev => {
              const newHealth = prev - 1
              
              if (newHealth <= 0) {
                setTimeout(() => onGameEnd(score), 100)
                return 0
              }
              
              return newHealth
            })
            
            setCombo(0)
            soundEngine.play('crash', 0.6)
            setShakeIntensity(5)
            setShakeTrigger(prev => prev + 1)
            
            setTimeout(() => {
              questionTimer.current = 0
            }, 1750)
          }, 200)
        }
        
        return movingBoxes.filter(box => box.x > -20)
      })
      
      // Generate new questions
      if (!isQuestionActive && questionTimer.current === 0) {
        generateQuestion()
      } else if (!isQuestionActive && questionTimer.current > 0) {
        const timeSinceLastQuestion = Date.now() - questionTimer.current
        if (timeSinceLastQuestion >= 2000) {
          questionTimer.current = 0
        }
      }
      
      // Update score
      setScore(prev => prev + 1)
      
      // Clean up expired powerups
      const now = Date.now()
      setPowerups(prev => ({
        shield: prev.shield > now ? prev.shield : 0,
        boost: prev.boost > now ? prev.boost : 0
      }))
      
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [handleAnswerBoxCollisions, generateQuestion, isQuestionActive, speed, onGameEnd, score])

  return (
    <ScreenShake intensity={shakeIntensity} trigger={shakeTrigger} duration={300}>
      <div 
        ref={gameAreaRef} 
        className={`relative w-full h-screen overflow-hidden transition-all duration-1000 ${
          carLevel >= 12 ? 'bg-gradient-to-r from-black via-gray-900 to-black' :
          carLevel >= 10 ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900' :
          carLevel >= 8 ? 'bg-gradient-to-r from-purple-950 via-black to-purple-950' :
          carLevel >= 6 ? 'bg-gradient-to-r from-purple-900 via-gray-900 to-black' :
          carLevel >= 4 ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-gray-900' :
          carLevel >= 2 ? 'bg-gradient-to-r from-purple-900 via-blue-900 to-black' :
          'bg-gradient-to-r from-purple-900 via-blue-900 to-black'
        }`}
      >
        {/* Moving background grid - horizontal */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, cyan 1px, transparent 1px),
                linear-gradient(to bottom, cyan 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translateX(${(-score * 0.5) % 50}px)` // Move left instead of down
            }}
          />
        </div>

        {/* Road lanes - Horizontal two lane system */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative h-96 w-full border-t-2 border-b-2 border-cyan-400 opacity-50">
            {/* Center divider for two lanes */}
            <div className="absolute top-1/2 left-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
          </div>
        </div>

        {/* Game HUD */}
        <GameHUD 
          score={score}
          speed={speed}
          shieldTime={powerups.shield > 0 ? powerups.shield - Date.now() : 0}
          boostTime={powerups.boost > 0 ? powerups.boost - Date.now() : 0}
          health={health}
          carLevel={carLevel}
          questionsAnswered={questionsAnswered}
          roundComplete={roundComplete}
          onPause={onPause}
        />

        {/* Addictive Features */}
        <ComboSystem 
          combo={combo} 
          multiplier={multiplier} 
          onComboBreak={() => {
            setCombo(0)
            setMultiplier(1.0)
          }} 
        />
        <StreakCounter visible={totalCoins > 0} />
        <NearMissEffect triggers={nearMisses} />

        {/* Car trail effect - horizontal */}
        <CarTrail 
          playerX={15} // Fixed X position
          playerY={playerY} 
          boost={powerups.boost > 0} 
        />

        {/* Player car - Horizontal layout with 3D design */}
        <div
          className="absolute z-10"
          style={{
            left: '15%', // Fixed on left side
            top: `${playerY}%`,
            width: `${10 * carUpgrades.size}%`, // Car dimensions
            height: `${6 * carUpgrades.size}%`,
            transform: 'translateY(-50%)' // Center vertically
          }}
        >
          <Car3DDesktop
            carColor={selectedCar.color}
            carGradient={selectedCar.gradient}
            carLevel={carLevel}
            boost={carUpgrades.boost}
            shield={powerups.shield > 0 || carUpgrades.shield}
            size={carUpgrades.size}
            isPremium={selectedCar.id === 'quantum-ultimate'}
          />
        </div>

        {/* Enhanced particle effects */}
        <ParticleSystem particles={particles.map(p => ({ ...p, type: 'sparkle' }))} />

        {/* Particle effects */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0, x: -20 }} // Move left for horizontal
            transition={{ duration: 0.5 }}
          />
        ))}

        {/* Desktop controls indicator */}
        <div className="absolute bottom-4 left-0 right-0">
          <div className="flex justify-center space-x-4">
            <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 text-center">
              <div className="text-cyan-400 text-sm mb-1">⬆️ UP / W</div>
              <div className="text-xs text-gray-400">Top Lane</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 text-center">
              <div className="text-cyan-400 text-sm mb-1">⬇️ DOWN / S</div>
              <div className="text-xs text-gray-400">Bottom Lane</div>
            </div>
            <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 text-center">
              <div className="text-cyan-400 text-sm mb-1">🖱️ CLICK</div>
              <div className="text-xs text-gray-400">Top/Bottom Half</div>
            </div>
          </div>
        </div>

        {/* Speed lines - horizontal */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"
              style={{
                top: `${20 + i * 8}%`,
              }}
              animate={{
                x: ['100vw', '-100px'], // Move left to right
              }}
              transition={{
                duration: 1 / speed,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Answer Boxes for Language Learning - Horizontal */}
        {answerBoxes.map(box => (
          <AnswerBoxDesktop
            key={box.id}
            id={box.id}
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            isCorrect={box.isCorrect}
            answer={box.answer}
            lane={box.lane}
            color={box.color}
          />
        ))}
      </div>
      
      {/* Language Learning Component */}
      <LanguageLearningDesktop
        currentQuestion={currentQuestion}
        questionType={questionType}
        isQuestionActive={isQuestionActive}
        currentChapter={selectedChapter as keyof typeof vocabularyDatabase}
        playerHealth={health}
        answerBoxes={answerBoxes}
      />
    </ScreenShake>
  )
}
