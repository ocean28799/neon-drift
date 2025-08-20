'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { soundEngine } from '@/utils/soundEngine'
import ModernGameHUD from './ModernGameHUD'
import ScreenShake from './ScreenShake'
import NearMissEffect from './NearMissEffect'
import ModernStreakCounter from './ModernStreakCounter'
import LanguageLearning from './LanguageLearning'
import AnswerBox from './AnswerBox'
import UltraComboSystem from './UltraComboSystem'
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
  // Local state - keeping for now, will migrate to Zustand later
  const [playerX, setPlayerX] = useState(50) // percentage
  const [score, setScore] = useState(0)
  const [speed] = useState(1) // Reduced from 2 to 1
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
  const [questionType, setQuestionType] = useState<'translate' | 'reverse'>('translate')
  const [isQuestionActive, setIsQuestionActive] = useState(false)
  const [answerBoxes, setAnswerBoxes] = useState<Array<{
    id: string
    x: number
    y: number
    width: number
    height: number
    lane: 'left' | 'right'
    answer: string
    isCorrect: boolean
    color: string
  }>>([])
  
  // Question timing
  const questionTimer = useRef(0)
  const QUESTION_INTERVAL = 30000 // 30 seconds between questions
  
  const [powerups, setPowerups] = useState<{ shield: number; boost: number }>({
    shield: 0,
    boost: 0
  })
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number }>>([])
  
  // Addictive features state
  const [combo, setCombo] = useState(0)
  const [multiplier, setMultiplier] = useState(1.0)
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [shakeTrigger, setShakeTrigger] = useState(0)
  const [nearMisses, setNearMisses] = useState<Array<{ id: string; x: number; y: number }>>([])
  
  // Mystery boxes and game objects
  const [mysteryBoxes, setMysteryBoxes] = useState<Array<{
    id: string
    x: number
    y: number
    type: 'common' | 'rare' | 'epic' | 'legendary'
  }>>([])
  
  // Game objects for spawning
  const [gameObjects, setGameObjects] = useState<GameObject[]>([])
  const [upcomingItems, setUpcomingItems] = useState<PreviewItem[]>([])
  
  // Device orientation for mobile
  const [deviceOrientation, setDeviceOrientation] = useState({ gamma: 0 })
  
  // Lane system
  const [currentLane, setCurrentLane] = useState<'left' | 'right'>('left')
  // Keep only essential local refs for performance
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameLoopRef = useRef<number | null>(null)
  const languageLearningTimer = useRef(0)
  const LANGUAGE_LEARNING_INTERVAL = 45000 // 45 seconds
  
  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9)
  
  // Initialize sounds
  useEffect(() => {
    soundEngine.initSounds()
    soundEngine.enable()
  }, [])

  // Generate a new question using Zustand actions
  const generateQuestion = useCallback(() => {
    const vocabulary = vocabularyDatabase[selectedChapter as keyof typeof vocabularyDatabase] || vocabularyDatabase.chapter01
    // More flexible difficulty - allow higher level players to get all difficulties
    // Capture carLevel at the time of function call to avoid dependency issues
    const currentCarLevel = carLevel
    const maxDifficulty = Math.min(3, Math.max(1, Math.floor(currentCarLevel / 3) + 1))
    const availableWords = vocabulary.filter(word => word.difficulty <= maxDifficulty)
    
    // Fallback to all words if no words match the difficulty
    const wordsToUse = availableWords.length > 0 ? availableWords : vocabulary
    
    if (wordsToUse.length === 0) return
    
    const word = wordsToUse[Math.floor(Math.random() * wordsToUse.length)]
    
    // Always Vietnamese → English (translate mode only)
    const type = 'translate' // Fixed to always be translate (Vietnamese question, English answer)
    
    setQuestionType(type) // Use Zustand action
    
    // Get wrong answer from same category
    const wrongAnswers = vocabulary.filter(w => w.id !== word.id && w.category === word.category)
    const wrongWord = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)] || vocabulary[0]
    
    const correctAnswer = word.english // Always English answer
    const wrongAnswer = wrongWord.english // Always English wrong answer
    const correctSide: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right'
    
    console.log(`Generating question at car level ${currentCarLevel}:`, {
      question: word.vietnamese,
      correctAnswer,
      wrongAnswer,
      correctSide
    })
    
    setCurrentQuestion(word)
    setIsQuestionActive(true)
    
    // Delay answer box spawn by 2 seconds to give player time to read the question
    setTimeout(() => {
      // Generate random colors for the answer boxes with more variety
      const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
        'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500',
        'bg-lime-500', 'bg-amber-500', 'bg-teal-500', 'bg-sky-500'
      ]
      
      // Ensure the two boxes have different colors
      const leftColor = colors[Math.floor(Math.random() * colors.length)]
      let rightColor = colors[Math.floor(Math.random() * colors.length)]
      
      // Make sure they're different colors
      while (rightColor === leftColor) {
        rightColor = colors[Math.floor(Math.random() * colors.length)]
      }
      
      // Spawn answer boxes regardless of current state (the timeout ensures correct timing)
      const leftBox = {
        id: generateId(),
        x: 25, // Left lane position
        y: -30, // Start much higher up to avoid overlapping with question
        width: 12, // Made larger for better visibility
        height: 8,  // Made larger for better visibility
        lane: 'left' as const,
        answer: correctSide === 'left' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'left',
        color: leftColor
      }
      
      const rightBox = {
        id: generateId(),
        x: 75, // Right lane position (should match lane position at 75%)
        y: -30, // Start much higher up to avoid overlapping with question
        width: 12, // Made larger for better visibility
        height: 8,  // Made larger for better visibility
        lane: 'right' as const,
        answer: correctSide === 'right' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'right',
        color: rightColor
      }
      
      console.log(`Answer boxes generated:`, {
        leftBox: `"${leftBox.answer}" (${leftBox.isCorrect ? 'correct' : 'wrong'})`,
        rightBox: `"${rightBox.answer}" (${rightBox.isCorrect ? 'correct' : 'wrong'})`
      })
      
      setAnswerBoxes([leftBox, rightBox])
    }, 2000) // 2 second delay
  }, [selectedChapter, carLevel]) // Keep carLevel dependency for useCallback, but remove from useEffect

  // Generate new question without triggering on carLevel changes
  const generateNewQuestion = useCallback(() => {
    // Only generate if no question is currently active
    if (!isQuestionActive && questionTimer.current === 0) {
      generateQuestion()
    }
  }, [generateQuestion, isQuestionActive])

  // Start first question immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      generateNewQuestion()
    }, 1000) // Small delay to ensure everything is initialized
    
    return () => clearTimeout(timer)
  }, [generateNewQuestion]) // Include the dependency

  // Car upgrade function - ULTRA PROTECTION against level jumping
  const upgradeCarLevel = useCallback(() => {
    // QUINTUPLE PROTECTION SYSTEM
    // 0. Time-based protection - minimum 300ms between upgrades
    const now = Date.now()
    if (now - lastUpgradeTime.current < 300) {
      console.log('🚫 BLOCKED: Too soon since last upgrade (< 300ms)')
      return
    }
    
    // 1. Check if collision is still being processed
    if (collisionProcessing.current) {
      console.log('🚫 BLOCKED: Collision still being processed')
      return
    }
    
    // 2. Check if upgrade is already in progress
    if (upgradeInProgress.current) {
      console.log('🚫 BLOCKED: Upgrade already in progress')
      return
    }
    
    // 3. Prevent multiple upgrades from the same question
    const currentQuestionId = currentQuestion?.id
    if (currentQuestionId && lastQuestionId.current === currentQuestionId) {
      console.log('🚫 BLOCKED: Already upgraded for this question ID:', currentQuestionId)
      return
    }
    
    // 4. Lock the upgrade process immediately and record time
    upgradeInProgress.current = true
    lastUpgradeTime.current = now
    
    if (currentQuestionId) {
      lastQuestionId.current = currentQuestionId
    }
    
    setCarLevel(prev => {
      const newLevel = prev + 1
      console.log(`🚗 CAR LEVEL UPGRADE: ${prev} → ${newLevel}`)
      
      // Safety check: prevent extremely high levels from breaking the game
      if (newLevel > 50) {
        console.warn('Car level exceeds maximum, resetting to 50')
        upgradeInProgress.current = false // Reset lock
        return 50
      }
      
      // ADDICTIVE SOUND EFFECTS based on level
      if (newLevel <= 5) {
        soundEngine.play('success', 0.9) // Normal success sound
      } else if (newLevel <= 10) {
        soundEngine.play('success', 1.0) // Slightly louder
        // Add a satisfying "ding" sound for higher levels
        setTimeout(() => soundEngine.play('success', 0.5), 150)
      } else {
        // Epic level up sound for high levels
        soundEngine.play('success', 1.0)
        setTimeout(() => soundEngine.play('success', 0.7), 100)
        setTimeout(() => soundEngine.play('success', 0.5), 200)
      }
      
      // Simplified upgrades - no size changes or complex effects to prevent level 5-6 issues
      setCarUpgrades(prevUpgrades => {
        const newUpgrades = { ...prevUpgrades }
        
        // Only simple speed upgrades to prevent rendering issues
        if (newLevel >= 2) {
          newUpgrades.speed = Math.min(1.1 + (newLevel * 0.05), 2.0) // Gradual speed increase
        }
        if (newLevel >= 4) {
          newUpgrades.handling = Math.min(1.1 + (newLevel * 0.02), 1.5) // Gradual handling increase
        }
        // Remove all size, wings, boost, shield upgrades that could cause issues
        newUpgrades.size = 1.0 // Keep constant size
        newUpgrades.wings = false
        newUpgrades.boost = false
        newUpgrades.shield = false
        
        console.log(`✅ Level ${newLevel} upgrades applied - UI stable, size fixed at 1.0`)
        return newUpgrades
      })
      
      // Reset upgrade lock after a delay
      setTimeout(() => {
        upgradeInProgress.current = false
        console.log(`🔓 Upgrade lock released for level ${newLevel}`)
      }, 500) // Longer delay to prevent rapid upgrades
      
      return newLevel
    })
  }, [currentQuestion])

  // Two-lane system state - using declarations from above
  const [laneChangeKeys, setLaneChangeKeys] = useState<Set<string>>(new Set())

  // Lane-based collision detection - more reliable for two-lane system
  const checkAnswerBoxCollision = useCallback((box: {
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

  // Add collision protection to prevent level jumping - ENHANCED
  const collisionProcessing = useRef(false)
  const lastQuestionId = useRef<string | null>(null)
  const upgradeInProgress = useRef(false) // Additional protection for upgrades
  const lastUpgradeTime = useRef(0) // Track last upgrade time to prevent rapid-fire
  
  // Clean Answer Box Collision Handler - ULTIMATE PROTECTION
  const handleAnswerBoxCollisions = useCallback(() => {
    // MULTIPLE SAFETY CHECKS
    if (!isQuestionActive || answerBoxes.length === 0 || collisionProcessing.current || upgradeInProgress.current) {
      return
    }
    
    // Find the answer box in the current lane
    const boxInCurrentLane = answerBoxes.find(box => box.lane === currentLane)
    
    if (!boxInCurrentLane) return
    
    // Check for collision with the box in current lane
    if (checkAnswerBoxCollision(boxInCurrentLane)) {
      console.log('🎯 ANSWER BOX COLLISION DETECTED!')
      console.log(`Car lane: ${currentLane}, Box lane: ${boxInCurrentLane.lane}`)
      console.log(`Answer: "${boxInCurrentLane.answer}", Is Correct: ${boxInCurrentLane.isCorrect}`)
      
      // CRITICAL: Immediately set ALL processing flags to prevent multiple calls
      collisionProcessing.current = true
      
      // CRITICAL: Capture the collision result IMMEDIATELY before any state changes
      const wasCorrectAnswer = boxInCurrentLane.isCorrect
      
      // CRITICAL: Immediately prevent any further collisions and clear state
      setIsQuestionActive(false)
      setAnswerBoxes([])
      setCurrentQuestion(null)
      
      // Process the answer immediately (no delay) using the captured result
      if (wasCorrectAnswer) {
        console.log('✅ PROCESSING CORRECT ANSWER - NO HEALTH LOSS')
        
        // CORRECT ANSWER - NO HEALTH LOSS
        setScore(prev => prev + 100)
        setCombo(prev => prev + 1)
        
        // Add success effects
        setShakeIntensity(2) // Gentle shake for success
        setShakeTrigger(prev => prev + 1)
        
        // Upgrade car level for progression (includes addictive sounds)
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
      
      // Reset collision processing flag after answer is processed
      setTimeout(() => {
        collisionProcessing.current = false
      }, 100)
      
      // Set timer for next question with appropriate delay
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
    playerX,
    upgradeCarLevel
  ])

  // Handle mystery box collisions
  const handleMysteryBoxCollisions = useCallback(() => {
    // Check for collision between car and mystery boxes
    mysteryBoxes.forEach(box => {
      const carLeft = playerX
      const carRight = playerX + 12 // Car width
      const carTop = 85 // Car Y position
      const carBottom = carTop + 8 // Car height
      
      const boxLeft = box.x
      const boxRight = box.x + 6 // Box width (small mobile size)
      const boxTop = box.y
      const boxBottom = box.y + 6 // Box height
      
      // Check if rectangles overlap
      if (carLeft < boxRight && carRight > boxLeft && 
          carTop < boxBottom && carBottom > boxTop) {
        // Collision detected! Trigger the box's onCollect function
        const points = {
          common: 50,
          rare: 100,
          epic: 200,
          legendary: 500
        }[box.type]
        
        // Remove the collected box
        setMysteryBoxes(prev => prev.filter(b => b.id !== box.id))
        
        // Award points
        setScore(prev => prev + points)
        
        // Create sparkle particle effect
        const newParticles = Array.from({length: 10}, (_, i) => ({
          id: `sparkle-${Date.now()}-${i}`,
          x: box.x + Math.random() * 6,
          y: box.y + Math.random() * 6,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8
        }))
        setParticles(prev => [...prev, ...newParticles])
        
        // Play collection sound based on rarity
        const soundVolume = {
          common: 0.3,
          rare: 0.4,
          epic: 0.5,
          legendary: 0.7
        }[box.type]
        
        soundEngine.play('boost', soundVolume) // Use boost sound for collection
        
        console.log(`🎁 Mystery box collected! Type: ${box.type}, Points: +${points}`)
      }
    })
  }, [mysteryBoxes, playerX, setMysteryBoxes, setScore, setParticles])

  // Handle lane changes for two-lane system with device orientation support
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

    // Device orientation handler for phone tilt controls
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null) {
        setDeviceOrientation({ gamma: e.gamma })
        
        // Tilt sensitivity: gamma > 15 = right, gamma < -15 = left
        const tiltThreshold = 15
        
        if (e.gamma > tiltThreshold) {
          setCurrentLane('right')
          console.log('📱 TILT RIGHT: Moving to RIGHT lane (gamma:', e.gamma.toFixed(1), ')')
        } else if (e.gamma < -tiltThreshold) {
          setCurrentLane('left')
          console.log('📱 TILT LEFT: Moving to LEFT lane (gamma:', e.gamma.toFixed(1), ')')
        }
      }
    }

    // Request permission for device orientation on iOS 13+
    const requestOrientationPermission = async () => {
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleDeviceOrientation)
            console.log('📱 Device orientation permission granted')
          }
        } catch {
          console.log('📱 Device orientation permission denied')
        }
      } else {
        // For non-iOS devices or older iOS versions
        window.addEventListener('deviceorientation', handleDeviceOrientation)
        console.log('📱 Device orientation enabled (no permission required)')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    
    // Enable device orientation for phone tilt controls
    requestOrientationPermission()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
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
        const smoothness = 0.4 // Fixed value to prevent upgrade issues
        return prev + (diff * Math.min(smoothness, 0.9)) // Increased max speed to 0.9
      })
    }

    const interval = setInterval(moveToLane, 12) // Faster update rate for smoother movement
    return () => clearInterval(interval)
  }, [currentLane]) // Removed carUpgrades.handling dependency

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

  // Collision detection - simplified to prevent upgrade issues
  const checkCollision = useCallback((obj: GameObject) => {
    const playerWidth = 6 // Fixed size
    const playerHeight = 10 // Fixed size
    const playerY = 85
    
    // Regular collision detection for all objects
    const buffer = 1
    return (
      obj.x - buffer < playerX + playerWidth &&
      obj.x + obj.width + buffer > playerX &&
      obj.y - buffer < playerY + playerHeight &&
      obj.y + obj.height + buffer > playerY
    )
  }, [playerX]) // Removed carUpgrades.size dependency

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
      
      // Handle answer box collisions
      handleAnswerBoxCollisions()
      
      // Handle mystery box collisions
      handleMysteryBoxCollisions()
      
      // Move answer boxes down
      setAnswerBoxes(prev => {
        const movingBoxes = prev.map(box => ({ ...box, y: box.y + speed }))
        
        // Check if any answer boxes reached the bottom (missed)
        const reachedBottom = movingBoxes.filter(box => box.y >= 110)
        if (reachedBottom.length > 0 && isQuestionActive) {
          console.log('⚠️ ANSWER BOXES MISSED! Player failed to answer.')
          
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

      // Move mystery boxes down and handle spawning
      setMysteryBoxes(prev => {
        // Move existing mystery boxes
        const movingBoxes = prev.map(box => ({ ...box, y: box.y + speed }))
        
        // Remove boxes that went off screen
        const filteredBoxes = movingBoxes.filter(box => box.y < 110)
        
        // Randomly spawn new mystery boxes (2% chance per frame)
        if (Math.random() < 0.02 && filteredBoxes.length < 3) {
          const rarityRoll = Math.random()
          let type: 'common' | 'rare' | 'epic' | 'legendary'
          
          // Rarity distribution: 60% common, 25% rare, 12% epic, 3% legendary
          if (rarityRoll < 0.60) {
            type = 'common'
          } else if (rarityRoll < 0.85) {
            type = 'rare'
          } else if (rarityRoll < 0.97) {
            type = 'epic'
          } else {
            type = 'legendary'
          }
          
          const newBox = {
            id: generateId(),
            x: Math.random() * 70 + 15, // Random position across the road
            y: -10, // Start above screen
            type
          }
          
          console.log(`🎁 Mystery box spawned! Type: ${type} at position (${newBox.x.toFixed(1)}, ${newBox.y})`)
          
          return [...filteredBoxes, newBox]
        }
        
        return filteredBoxes
      })
      
      // Only generate new questions with proper timing control
      if (!isQuestionActive && questionTimer.current === 0) {
        // Generate first question immediately
        generateNewQuestion()
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
  }, [spawnObject, handleCollisions, handleAnswerBoxCollisions, handleMysteryBoxCollisions, generateNewQuestion, isQuestionActive, speed, setParticles, setPowerups, onLanguageLearning, onSpeedChange, onGameEnd, score])

  return (
    <ScreenShake intensity={shakeIntensity} trigger={shakeTrigger} duration={300}>
      <div 
        ref={gameAreaRef} 
        className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-blue-900 to-black"
        style={{ touchAction: 'none' }} // Prevent scrolling on mobile
      >
        {/* Moving background grid - Mobile optimized */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div 
            className="absolute inset-0 opacity-20 sm:opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, cyan 1px, transparent 1px),
                linear-gradient(to bottom, cyan 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px', // Smaller grid for mobile
              transform: `translateY(${(score * 0.5) % 30}px)`
            }}
          />
        </div>

        {/* Road lanes - Mobile-first responsive design */}
        <div className="absolute inset-0 flex justify-center" style={{ zIndex: 2 }}>
          <div className="relative w-full max-w-xs sm:max-w-sm md:w-96 h-full border-l-2 border-r-2 border-cyan-400 opacity-50">
            {/* Center divider for two lanes */}
            <div className="absolute left-1/2 top-0 w-0.5 sm:w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-80" />
          </div>
        </div>

        {/* Game HUD - Mobile-first with proper z-index */}
        <div style={{ zIndex: 100 }} className="pointer-events-none">
          <div className="pointer-events-auto">{/* Allow HUD interactions */}</div>
          <ModernGameHUD 
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
        </div>

        {/* Question preview removed per user request */}

        {/* Addictive Features - ensure high z-index */}
        <div style={{ zIndex: 90 }}>
          <UltraComboSystem 
            combo={combo} 
            maxCombo={combo}
            isVisible={true}
            onComboMilestone={() => {
              setCombo(prev => prev + 1)
              setMultiplier(prev => Math.min(prev + 0.1, 3.0))
            }} 
          />
          <ModernStreakCounter 
            streak={combo}
            isVisible={combo > 0}
            onStreakMilestone={() => {
              // Handle streak milestone
            }}
          />
        </div>
        <NearMissEffect triggers={nearMisses} />

        {/* Simplified particle effects - removed complex systems */}

      {/* Game objects removed - simplified language learning game */}

      {/* Car trail effect removed - could cause level 5-6 issues */}

      {/* Mobile-optimized Player car - Ultra Simplified for Level 5-6 Fix */}
      <div
        className="absolute"
        style={{
          left: `${playerX}%`,
          top: '80%', // Higher position for mobile visibility
          width: 'clamp(40px, 8%, 60px)', // Responsive width with min/max
          height: 'clamp(60px, 12%, 90px)', // Responsive height with min/max
          zIndex: 50, // Higher z-index to ensure visibility
        }}
      >
        {/* Ultra-simplified car body - no conditional styling */}
        <div 
          className={`w-full h-full bg-gradient-to-b ${selectedCar.gradient} rounded-lg border border-white/50`}
          style={{
            // Fixed simple shadow - no dynamic changes
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* Simple windshield */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1/3 bg-white/20 rounded-t-lg" />
          
          {/* Simple headlights */}
          <div className="absolute top-0.5 left-1 w-1.5 h-1 bg-white rounded-full" />
          <div className="absolute top-0.5 right-1 w-1.5 h-1 bg-white rounded-full" />
          
          {/* Simple racing stripe - no conditional logic */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-0.5 h-1/2 bg-white/70 rounded-full" />
          
          {/* Simple tail lights - no conditional logic */}
          <div className="absolute bottom-0.5 left-1 w-1 h-0.5 rounded-sm bg-red-500" />
          <div className="absolute bottom-0.5 right-1 w-1 h-0.5 rounded-sm bg-red-500" />
        </div>
      </div>

      {/* Simple particle effects - removed complex systems */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white rounded-full opacity-80"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
        />
      ))}

      {/* Mobile-first touch controls - Always visible on mobile */}
      <div className="absolute bottom-2 left-0 right-0 lg:hidden" style={{ zIndex: 90 }}>
        <div className="flex justify-center space-x-2 px-4">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-3 text-center border border-cyan-400/30">
            <div className="text-cyan-400 text-sm font-bold mb-1">👈 TRÁI</div>
            <div className="text-xs text-gray-300">Chạm bên trái</div>
          </div>
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-3 text-center border border-cyan-400/30">
            <div className="text-cyan-400 text-sm font-bold mb-1">PHẢI 👉</div>
            <div className="text-xs text-gray-300">Chạm bên phải</div>
          </div>
        </div>
        <div className="flex justify-center mt-2 px-4">
          <div className="bg-black/50 backdrop-blur-lg rounded-xl p-2 text-center border border-purple-400/30">
            <div className="text-purple-400 text-xs font-bold mb-1">📱 NGHIÊNG ĐIỆN THOẠI</div>
            <div className="text-xs text-gray-300">Trái/Phải để điều khiển</div>
          </div>
        </div>
      </div>

      {/* Desktop controls hint */}
      <div className="absolute bottom-4 left-0 right-0 hidden lg:block" style={{ zIndex: 90 }}>
        <div className="flex justify-center">
          <div className="bg-black/30 backdrop-blur-lg rounded-lg p-3 text-center">
            <div className="text-cyan-400 text-sm mb-1">← / → Arrow Keys</div>
            <div className="text-xs text-gray-400">Use arrow keys to steer</div>
          </div>
        </div>
      </div>

      {/* Mobile-responsive speed lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 10 }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 sm:w-1 h-16 sm:h-20 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-30"
            style={{
              left: `${25 + i * 16}%`, // More spaced out for mobile
              animation: `speedLine ${2 / speed}s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Answer Boxes for Language Learning - ensure high z-index */}
      <div style={{ zIndex: 80 }}>
        {answerBoxes.map(box => (
          <AnswerBox
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

      {/* Mystery Boxes - Special collectible items */}
      <div style={{ zIndex: 85 }}>
        {mysteryBoxes.map(box => (
          <MysteryBox
            key={box.id}
            x={box.x}
            y={box.y}
            type={box.type}
            onCollect={() => {
              // Remove collected mystery box
              setMysteryBoxes(prev => prev.filter(b => b.id !== box.id))
              
              // Award points based on rarity
              const points = {
                common: 50,
                rare: 100,
                epic: 200,
                legendary: 500
              }[box.type]
              
              setScore(prev => prev + points)
              
              // Visual feedback - create sparkle effect
              const newParticles = Array.from({length: 10}, (_, i) => ({
                id: `sparkle-${Date.now()}-${i}`,
                x: box.x,
                y: box.y,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5
              }))
              setParticles(prev => [...prev, ...newParticles])
            }}
          />
        ))}
      </div>
    </div>
    
    {/* Language Learning Component */}
    <LanguageLearning
      currentQuestion={currentQuestion}
      questionType={questionType}
      isQuestionActive={isQuestionActive}
      currentChapter={selectedChapter as keyof typeof vocabularyDatabase}
      playerHealth={health}
      answerBoxes={answerBoxes}
    />
    
    {/* Upgrade notifications removed - car upgrades happen silently */}
    
    </ScreenShake>
  )
}
