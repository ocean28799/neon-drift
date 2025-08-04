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
import LanguageLearning from './LanguageLearning'
import MysteryBox from './MysteryBox'

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

interface GameObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'obstacle' | 'powerup' | 'coin'
  variant?: string
}

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

interface PreviewItem {
  id: string
  type: 'obstacle' | 'powerup' | 'coin'
  variant?: string
  lane: number // 0, 1, or 2 for left, center, right
  spawnTime: number // When this item will spawn
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

interface NeonDriftGameProps {
  onGameEnd: (score: number) => void
  onPause: () => void
  onLanguageLearning?: () => void
  onSpeedChange?: (speed: number) => void
  onRoundComplete?: (roundId: string) => void
  selectedCar: Car
  selectedChapter: string
  selectedRound?: string
}

// Vocabulary database - moved outside component to avoid re-renders
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

export default function NeonDriftGame({ 
  onGameEnd, 
  onPause, 
  onLanguageLearning, 
  onSpeedChange, 
  onRoundComplete,
  selectedCar, 
  selectedChapter,
  selectedRound 
}: NeonDriftGameProps) {
  const [playerX, setPlayerX] = useState(50) // percentage
  const [gameObjects, setGameObjects] = useState<GameObject[]>([])
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(2)
  const [health, setHealth] = useState(3) // New health system
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
  const [isQuestionActive, setIsQuestionActive] = useState(false)
  const [mysteryBoxes, setMysteryBoxes] = useState<Array<{
    id: string
    x: number
    y: number
    width: number
    height: number
    lane: 'left' | 'right'
    answer: string
    isCorrect: boolean
  }>>([])
  
  // Question timing
  const questionTimer = useRef(0)
  const QUESTION_INTERVAL = 30000 // 30 seconds between questions
  const [timeUntilNextQuestion, setTimeUntilNextQuestion] = useState(QUESTION_INTERVAL)
  
  const currentMusicTrack = useRef('gameMusic')
  const [powerups, setPowerups] = useState<{ shield: number; boost: number }>({
    shield: 0,
    boost: 0
  })
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number }>>([])
  
  // Addictive features state
  const [combo, setCombo] = useState(0)
  const [multiplier, setMultiplier] = useState(1.0)
  const [coinStreak, setCoinStreak] = useState(0)
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [shakeTrigger, setShakeTrigger] = useState(0)
  const [nearMisses, setNearMisses] = useState<Array<{ id: string; x: number; y: number }>>([])
  const [totalCoins, setTotalCoins] = useState(0)
  const [upcomingItems, setUpcomingItems] = useState<PreviewItem[]>([])
  
  // Language learning timer
  const languageLearningTimer = useRef(0)
  const LANGUAGE_LEARNING_INTERVAL = 45000 // 45 seconds
  
  const gameLoopRef = useRef<number | null>(null)
  const lastObjectSpawn = useRef(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Generate a unique ID
  // Initialize sounds
  useEffect(() => {
    soundEngine.initSounds()
    soundEngine.enable()
  }, [])

  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)

  // Generate a new question
  const generateQuestion = useCallback(() => {
    const vocabulary = vocabularyDatabase[selectedChapter as keyof typeof vocabularyDatabase] || vocabularyDatabase.chapter01
    const availableWords = vocabulary.filter(word => word.difficulty <= Math.min(3, Math.floor(speed / 2) + 1))
    
    if (availableWords.length === 0) return
    
    const word = availableWords[Math.floor(Math.random() * availableWords.length)]
    
    // Focus on learning English - show Vietnamese and ask for English (most common)
    const questionTypes: ('translate' | 'reverse')[] = ['translate', 'translate', 'reverse'] // 2/3 chance Vietnamese→English
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
    
    // Get wrong answer from same category
    const wrongAnswers = vocabulary.filter(w => w.id !== word.id && w.category === word.category)
    const wrongWord = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)] || vocabulary[0]
    
    const correctAnswer = type === 'translate' ? word.english : word.vietnamese
    const wrongAnswer = type === 'translate' ? wrongWord.english : wrongWord.vietnamese
    const correctSide: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right'
    
    setCurrentQuestion(word)
    setIsQuestionActive(true)
    
    // Delay mystery box spawn by 2 seconds to give player time to read the question
    setTimeout(() => {
      // Spawn mystery boxes regardless of current state (the timeout ensures correct timing)
      const leftBox = {
        id: generateId(),
        x: 25, // Left lane position
        y: -30, // Start much higher up to avoid overlapping with question
        width: 12, // Made larger for better visibility
        height: 8,  // Made larger for better visibility
        lane: 'left' as const,
        answer: correctSide === 'left' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'left'
      }
      
      const rightBox = {
        id: generateId(),
        x: 75, // Right lane position (should match lane position at 75%)
        y: -30, // Start much higher up to avoid overlapping with question
        width: 12, // Made larger for better visibility
        height: 8,  // Made larger for better visibility
        lane: 'right' as const,
        answer: correctSide === 'right' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'right'
      }
      
      console.log(`Correct side: ${correctSide}`)
      console.log(`Left box: "${leftBox.answer}" (correct: ${leftBox.isCorrect})`)
      console.log(`Right box: "${rightBox.answer}" (correct: ${rightBox.isCorrect})`)
      
      setMysteryBoxes([leftBox, rightBox])
    }, 2000) // 2 second delay
  }, [selectedChapter, speed])

  // Car upgrade function
  const upgradeCarLevel = useCallback(() => {
    setCarLevel(prev => {
      const newLevel = prev + 1
      
      // Apply upgrades based on level
      setCarUpgrades(prevUpgrades => {
        const newUpgrades = { ...prevUpgrades }
        
        switch(newLevel) {
          case 2:
            // Level 2: Speed boost
            newUpgrades.speed = 1.2
            break
          case 3:
            // Level 3: Better handling + wings
            newUpgrades.handling = 1.3
            newUpgrades.wings = true
            break
          case 4:
            // Level 4: Smaller size (harder to hit)
            newUpgrades.size = 0.8
            break
          case 5:
            // Level 5: Speed boost upgrade
            newUpgrades.speed = 1.5
            newUpgrades.boost = true
            break
          case 6:
            // Level 6: Shield upgrade
            newUpgrades.shield = true
            break
          case 7:
            // Level 7: Maximum speed
            newUpgrades.speed = 2.0
            break
          case 8:
            // Level 8: Ultra compact
            newUpgrades.size = 0.6
            break
          case 9:
            // Level 9: Enhanced handling
            newUpgrades.handling = 1.8
            break
          case 10:
            // Level 10: God mode
            newUpgrades.speed = 2.5
            newUpgrades.size = 0.5
            newUpgrades.handling = 2.0
            break
        }
        
        return newUpgrades
      })
      
      return newLevel
    })
  }, [])

  // Two-lane system state
  const [currentLane, setCurrentLane] = useState<'left' | 'right'>('left') // Start in left lane
  const [laneChangeKeys, setLaneChangeKeys] = useState<Set<string>>(new Set())

  // Lane-based collision detection - more reliable for two-lane system
  const checkMysteryBoxCollision = useCallback((box: {
    x: number
    y: number
    width: number
    height: number
    lane: 'left' | 'right'
  }) => {
    const playerHeight = 10 // Fixed height in percentage units
    const playerY = 85 // Car Y position in percentage
    const yBuffer = 5 // Buffer for Y collision
    
    // Check Y collision first (simpler)
    const yCollision = (
      box.y - yBuffer < playerY + playerHeight &&
      box.y + box.height + yBuffer > playerY
    )
    
    // For lane-based collision, we use the current lane instead of exact X position
    // This prevents issues when car is transitioning between lanes
    const laneCollision = box.lane === currentLane
    
    const collision = yCollision && laneCollision
    
    // Debug collision detection
    if (collision) {
      console.log('🔍 Lane-Based Collision Debug:')
      console.log(`Player lane: ${currentLane}, Box lane: ${box.lane}`)
      console.log(`Player Y: ${playerY}%, Box Y: ${box.y}%`)
      console.log(`Y collision: ${yCollision}, Lane match: ${laneCollision}`)
    }
    
    return collision
  }, [currentLane])

  // Clean Mystery Box Collision Handler - FIXED VERSION
  const handleMysteryBoxCollisions = useCallback(() => {
    // Safety checks
    if (!isQuestionActive || mysteryBoxes.length === 0) return
    
    // Find the mystery box in the current lane
    const boxInCurrentLane = mysteryBoxes.find(box => box.lane === currentLane)
    
    if (!boxInCurrentLane) return
    
    // Check for collision with the box in current lane
    if (checkMysteryBoxCollision(boxInCurrentLane)) {
      console.log('🎯 MYSTERY BOX COLLISION DETECTED!')
      console.log(`Car lane: ${currentLane}, Box lane: ${boxInCurrentLane.lane}`)
      console.log(`Answer: "${boxInCurrentLane.answer}", Is Correct: ${boxInCurrentLane.isCorrect}`)
      
      // CRITICAL: Capture the collision result IMMEDIATELY before any state changes
      const wasCorrectAnswer = boxInCurrentLane.isCorrect
      
      // CRITICAL: Immediately prevent any further collisions and clear state
      setIsQuestionActive(false)
      setMysteryBoxes([])
      setCurrentQuestion(null)
      
      // Process the answer immediately (no delay) using the captured result
      if (wasCorrectAnswer) {
        console.log('✅ PROCESSING CORRECT ANSWER - NO HEALTH LOSS')
        
        // CORRECT ANSWER - NO HEALTH LOSS
        setScore(prev => prev + 100)
        setCombo(prev => prev + 1)
        soundEngine.play('success', 0.8)
        
        // Add success effects
        setShakeIntensity(2) // Gentle shake for success
        setShakeTrigger(prev => prev + 1)
        
        // Upgrade car level for progression
        upgradeCarLevel()
        
        // Create success particles
        const successParticles = Array.from({ length: 15 }, () => ({
          id: generateId(),
          x: playerX + Math.random() * 8,
          y: 85 + Math.random() * 6
        }))
        setParticles(prev => [...prev, ...successParticles])
        
        // Check for round completion
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
        console.log('❌ PROCESSING WRONG ANSWER - REDUCING HEALTH')
        
        // WRONG ANSWER - REDUCE HEALTH
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
        
        // Add failure effects
        setShakeIntensity(5) // Strong shake for failure
        setShakeTrigger(prev => prev + 1)
      }
      
      // Set timer for next question with appropriate delay
      questionTimer.current = Date.now()
    }
  }, [
    isQuestionActive, 
    mysteryBoxes, 
    currentLane,
    checkMysteryBoxCollision, 
    selectedRound,
    onRoundComplete,
    onGameEnd,
    score,
    playerX,
    upgradeCarLevel
  ])

  // Handle lane changes for two-lane system
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'escape') {
        onPause()
        return
      }
      
      if (['arrowleft', 'a', 'arrowright', 'd'].includes(key)) {
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

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const screenWidth = window.innerWidth
      const touchX = touch.clientX
      
      // Left half = left lane, right half = right lane
      if (touchX < screenWidth / 2) {
        setCurrentLane('left')
      } else {
        setCurrentLane('right')
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      setLaneChangeKeys(new Set())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onPause])

  // Handle lane changes - immediate and responsive
  useEffect(() => {
    // Immediate lane change on key press - no gradual movement for collision detection
    if (laneChangeKeys.has('arrowleft') || laneChangeKeys.has('a')) {
      setCurrentLane('left')
      console.log('🚗 LANE CHANGE: Moving to LEFT lane')
    }
    if (laneChangeKeys.has('arrowright') || laneChangeKeys.has('d')) {
      setCurrentLane('right')
      console.log('🚗 LANE CHANGE: Moving to RIGHT lane')
    }
  }, [laneChangeKeys])

  // Update player position for visual movement (separate from collision logic)
  useEffect(() => {
    const targetX = currentLane === 'left' ? 25 : 75 // Left lane at 25%, right lane at 75%
    
    const moveToLane = () => {
      setPlayerX(prev => {
        const diff = targetX - prev
        if (Math.abs(diff) < 1) return targetX
        
        // Fast, smooth movement - prioritize responsiveness over slow animation
        const smoothness = 0.4 * carUpgrades.handling // Increased base speed
        return prev + (diff * Math.min(smoothness, 0.9)) // Increased max speed to 0.9
      })
    }

    const interval = setInterval(moveToLane, 12) // Faster update rate for smoother movement
    return () => clearInterval(interval)
  }, [currentLane, carUpgrades.handling])

  // Generate upcoming items preview
  const generateUpcomingItems = useCallback(() => {
    const items: PreviewItem[] = []
    const currentTime = Date.now()
    
    // Generate next 8 items (showing 6, keeping buffer)
    for (let i = 0; i < 8; i++) {
      const spawnTime = currentTime + (i + 1) * 2000 // Every 2 seconds
      const objectType = Math.random()
      
      // Determine lane (0 = left, 1 = center, 2 = right)
      const lane = Math.floor(Math.random() * 3)
      
      let item: PreviewItem
      
      if (objectType < 0.6) {
        // Obstacle
        item = {
          id: generateId(),
          type: 'obstacle',
          variant: Math.random() > 0.5 ? 'spike' : 'block',
          lane,
          spawnTime
        }
      } else if (objectType < 0.85) {
        // Coin
        item = {
          id: generateId(),
          type: 'coin',
          lane,
          spawnTime
        }
      } else {
        // Power-up
        const powerupTypes = ['shield', 'boost', 'magnet']
        item = {
          id: generateId(),
          type: 'powerup',
          variant: powerupTypes[Math.floor(Math.random() * powerupTypes.length)],
          lane,
          spawnTime
        }
      }
      
      items.push(item)
    }
    
    setUpcomingItems(items)
  }, [])

  // Initialize upcoming items on game start
  useEffect(() => {
    generateUpcomingItems()
  }, [generateUpcomingItems])

  // Convert lane number to x position
  const laneToX = (lane: number): number => {
    switch (lane) {
      case 0: return 20  // Left lane (was 25)
      case 1: return 50  // Center lane
      case 2: return 80  // Right lane (was 75)
      default: return 50
    }
  }

  // Updated spawn function that uses upcoming items
  const spawnObject = useCallback(() => {
    // Disabled - only mystery boxes spawn now via language learning system
    return
  }, [])

  // Collision detection
  const checkCollision = useCallback((obj: GameObject) => {
    const playerWidth = 6 * carUpgrades.size // Use upgraded size
    const playerHeight = 10 * carUpgrades.size // Use upgraded size
    const playerY = 85
    
    // Regular collision detection for all objects
    const buffer = 1
    return (
      obj.x - buffer < playerX + playerWidth &&
      obj.x + obj.width + buffer > playerX &&
      obj.y - buffer < playerY + playerHeight &&
      obj.y + obj.height + buffer > playerY
    )
  }, [playerX, carUpgrades.size])

  // Handle collisions and scoring
  const handleCollisions = useCallback(() => {
    // Disabled - no obstacles, coins, or powerups in simplified game
    return
  }, [])

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      // Move objects down
      setGameObjects(prev => 
        prev
          .map(obj => ({ ...obj, y: obj.y + speed }))
          .filter(obj => obj.y < 110)
      )
      
      // Clean up particles
      setParticles(prev => prev.filter((_, i) => i < 20))
      
      // Spawn new objects
      spawnObject()
      
      // Handle collisions
      handleCollisions()
      
      // Handle mystery box collisions
      handleMysteryBoxCollisions()
      
      // Move mystery boxes down
      setMysteryBoxes(prev => {
        const movingBoxes = prev.map(box => ({ ...box, y: box.y + speed }))
        
        // Check if any mystery boxes reached the bottom (missed)
        const reachedBottom = movingBoxes.filter(box => box.y >= 110)
        if (reachedBottom.length > 0 && isQuestionActive) {
          console.log('⚠️ MYSTERY BOXES MISSED! Player failed to answer.')
          
          // Player missed the question - treat as wrong answer
          setIsQuestionActive(false)
          setCurrentQuestion(null)
          questionTimer.current = Date.now() // Set timer to prevent immediate new question
          
          setTimeout(() => {
            console.log('❌ PROCESSING MISSED QUESTION AS WRONG ANSWER')
            
            setHealth(prev => {
              const newHealth = prev - 1
              console.log(`Health reduced for missed question: ${prev} → ${newHealth}`)
              
              if (newHealth <= 0) {
                console.log('💀 GAME OVER!')
                setTimeout(() => onGameEnd(score), 100)
                return 0
              }
              
              return newHealth
            })
            
            setCombo(0)
            soundEngine.play('crash', 0.6)
            
            // Add failure effects for missed question
            setShakeIntensity(5)
            setShakeTrigger(prev => prev + 1)
            
            // Set timer for next question - reduced delay for missed question
            setTimeout(() => {
              questionTimer.current = 0 // Allow new question to be generated
            }, 1750) // 1.75 second delay before allowing new question
          }, 200)
        }
        
        // Return only boxes that haven't reached the bottom
        return movingBoxes.filter(box => box.y < 110)
      })
      
      // Only generate new questions with proper timing control
      if (!isQuestionActive && questionTimer.current === 0) {
        // Generate first question immediately
        generateQuestion()
      } else if (!isQuestionActive && questionTimer.current > 0) {
        const timeSinceLastQuestion = Date.now() - questionTimer.current
        // Wait at least 2 seconds between questions to prevent conflicts
        if (timeSinceLastQuestion >= 2000) {
          questionTimer.current = 0 // Reset timer to allow new question
        }
      }
      
      // Speed remains constant for consistent gameplay
      
      // Update score for survival
      setScore(prev => prev + 1)
      
      // Check for language learning trigger
      const currentTime = Date.now()
      if (onLanguageLearning && currentTime - languageLearningTimer.current > LANGUAGE_LEARNING_INTERVAL) {
        languageLearningTimer.current = currentTime
        onLanguageLearning()
      }
      
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
  }, [spawnObject, handleCollisions, handleMysteryBoxCollisions, generateQuestion, isQuestionActive, speed, setParticles, setPowerups, onLanguageLearning, onSpeedChange, onGameEnd, score])

  return (
    <ScreenShake intensity={shakeIntensity} trigger={shakeTrigger} duration={300}>
      <div ref={gameAreaRef} className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-blue-900 to-black">
        {/* Moving background grid */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, cyan 1px, transparent 1px),
                linear-gradient(to bottom, cyan 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translateY(${(score * 0.5) % 50}px)`
            }}
          />
        </div>

        {/* Road lanes - Two lane system */}
        <div className="absolute inset-0 flex justify-center">
          <div className="relative w-96 h-full border-l-2 border-r-2 border-cyan-400 opacity-50">
            {/* Center divider for two lanes */}
            <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-80" />
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

        {/* Question preview removed per user request */}

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

        {/* Old HUD - keeping for backup */}
        <div className="absolute top-4 left-4 z-20 hidden">
          <div className="bg-black/50 backdrop-blur-lg rounded-lg p-4 space-y-2">
            <div className="text-cyan-400 font-bold text-xl">
              Score: {score.toLocaleString()}
            </div>
            <div className="text-purple-400">
              Speed: {speed.toFixed(1)}x
            </div>
            {powerups.shield > 0 && (
              <div className="flex items-center gap-2 text-blue-400">
                <Shield className="w-4 h-4" />
                Shield: {Math.ceil((powerups.shield - Date.now()) / 1000)}s
              </div>
            )}
            {powerups.boost > 0 && (
              <div className="flex items-center gap-2 text-yellow-400">
                <Zap className="w-4 h-4" />
                Boost: {Math.ceil((powerups.boost - Date.now()) / 1000)}s
              </div>
            )}
          </div>
        </div>

      {/* Old pause button - keeping for backup */}
      <button
        onClick={onPause}
        className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-lg rounded-lg p-3 text-white hover:bg-black/70 transition-colors hidden"
      >
        <Pause className="w-6 h-6" />
      </button>

      {/* Game objects removed - simplified language learning game */}

      {/* Car trail effect */}
      <CarTrail 
        playerX={playerX} 
        playerY={85} 
        boost={powerups.boost > 0} 
      />

      {/* Player car - Sports Car Design (Lamborghini/Bugatti Style) */}
      <motion.div
        className="absolute z-10"
        style={{
          left: `${playerX}%`,
          top: '85%',
          width: `${6 * carUpgrades.size}%`,
          height: `${10 * carUpgrades.size}%`,
          transform: carLevel > 3 ? 'scale(1.1)' : 'scale(1)',
        }}
        animate={{
          y: carUpgrades.boost ? [0, -2, 0] : 0,
        }}
        transition={{
          duration: carUpgrades.boost ? 0.3 : 1,
          repeat: Infinity,
        }}
      >
        {/* Main Car Body */}
        <div className={`relative w-full h-full bg-gradient-to-b ${selectedCar.gradient} shadow-2xl ${
          powerups.shield > 0 || carUpgrades.shield ? 'shadow-blue-500/75' : `shadow-${selectedCar.color}-500/50`
        } ${carLevel > 5 ? 'border border-yellow-400/60' : ''}`}
          style={{
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)', // Sports car silhouette
            borderRadius: '12px 12px 6px 6px',
            boxShadow: powerups.shield > 0 || carUpgrades.shield
              ? '0 0 20px #3b82f6, inset 0 2px 4px rgba(255,255,255,0.2)'
              : carLevel > 7
              ? '0 0 20px #fbbf24, inset 0 2px 4px rgba(255,255,255,0.2)'
              : `0 0 15px ${selectedCar.color === 'cyan' ? '#06b6d4' : selectedCar.color === 'purple' ? '#8b5cf6' : selectedCar.color === 'yellow' ? '#f59e0b' : selectedCar.color === 'blue' ? '#3b82f6' : selectedCar.color === 'red' ? '#ef4444' : '#374151'}, inset 0 2px 4px rgba(255,255,255,0.2)`
          }}
        >
          {/* Front Windshield */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/3 bg-gradient-to-b from-white/30 to-white/10 border-b border-white/20" 
               style={{ borderRadius: '8px 8px 0 0' }} />
          
          {/* Front Grille */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-black/80" 
               style={{ borderRadius: '0 0 4px 4px' }}>
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          
          {/* Headlights */}
          <div className="absolute top-0.5 left-1 w-1.5 h-1 bg-white rounded-full shadow-sm">
            <div className="w-full h-full bg-gradient-to-br from-white to-blue-200 rounded-full animate-pulse" />
          </div>
          <div className="absolute top-0.5 right-1 w-1.5 h-1 bg-white rounded-full shadow-sm">
            <div className="w-full h-full bg-gradient-to-bl from-white to-blue-200 rounded-full animate-pulse" />
          </div>
          
          {/* Side Vents/Air Intakes */}
          <div className="absolute top-1/3 left-0 w-1 h-1/3 bg-black/40" style={{ borderRadius: '0 4px 4px 0' }}>
            <div className="w-full h-full bg-gradient-to-r from-black/60 to-transparent" />
          </div>
          <div className="absolute top-1/3 right-0 w-1 h-1/3 bg-black/40" style={{ borderRadius: '4px 0 0 4px' }}>
            <div className="w-full h-full bg-gradient-to-l from-black/60 to-transparent" />
          </div>
          
          {/* Central Racing Stripe */}
          <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 w-0.5 h-1/2 ${carLevel > 5 ? 'bg-yellow-400/80' : 'bg-white/30'} rounded-full`} />
          
          {/* Side Racing Stripes (Level 8+) */}
          {carLevel > 8 && (
            <>
              <div className="absolute top-1/4 left-1/4 w-0.5 h-1/2 bg-yellow-400/60 rounded-full" />
              <div className="absolute top-1/4 right-1/4 w-0.5 h-1/2 bg-yellow-400/60 rounded-full" />
            </>
          )}
          
          {/* Rear Spoiler (Level 3+) */}
          {carUpgrades.wings && (
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-black/60 via-black/80 to-black/60 rounded-sm shadow-sm" />
          )}
          
          {/* Tail Lights */}
          <div className={`absolute bottom-0.5 left-1 w-1 h-0.5 rounded-sm ${carLevel > 5 ? 'bg-cyan-400' : 'bg-red-500'} shadow-sm`}>
            <div className={`w-full h-full bg-gradient-to-r ${carLevel > 5 ? 'from-cyan-300 to-cyan-500' : 'from-red-400 to-red-600'} rounded-sm animate-pulse`} />
          </div>
          <div className={`absolute bottom-0.5 right-1 w-1 h-0.5 rounded-sm ${carLevel > 5 ? 'bg-cyan-400' : 'bg-red-500'} shadow-sm`}>
            <div className={`w-full h-full bg-gradient-to-l ${carLevel > 5 ? 'from-cyan-300 to-cyan-500' : 'from-red-400 to-red-600'} rounded-sm animate-pulse`} />
          </div>
          
          {/* Exhaust Flames (Boost Effect) */}
          {carUpgrades.boost && (
            <>
              <div className="absolute -bottom-1 left-1/4 w-0.5 h-2 bg-gradient-to-t from-blue-400 via-cyan-400 to-transparent rounded-b opacity-80 animate-pulse" />
              <div className="absolute -bottom-1 right-1/4 w-0.5 h-2 bg-gradient-to-t from-orange-400 via-yellow-400 to-transparent rounded-b opacity-80 animate-pulse" />
            </>
          )}
          
          {/* Level Indicator Badge */}
          {carLevel > 1 && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-bold shadow-sm border border-yellow-300">
                L{carLevel}
              </div>
            </div>
          )}
          
          {/* Carbon Fiber Effect (Level 6+) */}
          {carLevel > 6 && (
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/10 to-black/20 opacity-60" 
                 style={{
                   backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)',
                   clipPath: 'polygon(20% 0%, 80% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)',
                   borderRadius: '12px 12px 6px 6px'
                 }} />
          )}
          
          {/* God mode effects (Level 10) */}
          {carLevel >= 10 && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-yellow-500/30 to-purple-500/30 rounded-lg animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-yellow-400 to-purple-400 rounded-lg opacity-20 animate-spin" style={{ animationDuration: '3s' }} />
            </>
          )}
        </div>
        
        {/* Aerodynamic Wings (Level 3+) */}
        {carUpgrades.wings && (
          <>
            <div className="absolute top-1/3 -left-1 w-1.5 h-0.5 bg-gradient-to-r from-black/80 to-transparent rounded-r transform rotate-12 shadow-sm" />
            <div className="absolute top-1/3 -right-1 w-1.5 h-0.5 bg-gradient-to-l from-black/80 to-transparent rounded-l transform -rotate-12 shadow-sm" />
          </>
        )}
      </motion.div>

      {/* Enhanced particle effects */}
      <ParticleSystem particles={particles.map(p => ({ ...p, type: 'sparkle' }))} />

      {/* Simple particle effects for backwards compatibility */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        />
      ))}

      {/* Mobile touch controls indicator */}
      <div className="absolute bottom-4 left-0 right-0 md:hidden">
        <div className="flex justify-center space-x-4">
          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-sm mb-1">👈 TAP LEFT</div>
            <div className="text-xs text-gray-400">Steer Left</div>
          </div>
          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-4 text-center">
            <div className="text-cyan-400 text-sm mb-1">TAP RIGHT 👉</div>
            <div className="text-xs text-gray-400">Steer Right</div>
          </div>
        </div>
      </div>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40"
            style={{
              left: `${20 + i * 8}%`,
            }}
            animate={{
              y: ['-100px', '100vh'],
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

      {/* Mystery Boxes for Language Learning */}
      {mysteryBoxes.map(box => (
        <MysteryBox
          key={box.id}
          x={box.x}
          y={box.y}
          width={box.width}
          height={box.height}
          isCorrect={box.isCorrect}
          answer={box.answer}
          lane={box.lane}
        />
      ))}
    </div>
    
    {/* Language Learning Component */}
    <LanguageLearning
      currentQuestion={currentQuestion}
      isQuestionActive={isQuestionActive}
      currentChapter={selectedChapter as keyof typeof vocabularyDatabase}
      playerHealth={health}
    />
    
    {/* Upgrade notifications removed - car upgrades happen silently */}
    
    </ScreenShake>
  )
}
