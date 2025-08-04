'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import NeonDriftGame from '@/components/NeonDriftGame'
import GameMenu from '@/components/GameMenu'
import CarSelection from '@/components/CarSelection'
import ChapterSelection from '@/components/ChapterSelection'
import RoundSelection from '@/components/RoundSelection'
import LanguageLearning from '@/components/LanguageLearning'
import { soundEngine } from '@/utils/soundEngine'

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

export default function Home() {
  // Chapter name mapping
  const chapterNames: Record<string, string> = {
    'chapter01': 'Basic Everyday',
    'chapter02': 'Family & People',
    'chapter03': 'Food & Drink',
    'chapter04': 'House & Home',
    'chapter05': 'Transportation',
    'chapter06': 'Work & Career',
    'chapter07': 'Health & Body',
    'chapter08': 'Education & Learning',
    'chapter09': 'Technology & Communication',
    'chapter10': 'Shopping & Commerce',
    'chapter11': 'Sports & Recreation',
    'chapter12': 'Weather & Nature',
    'chapter13': 'Emotions & Feelings',
    'chapter14': 'Time & Calendar',
    'chapter15': 'Transportation & Travel',
    'chapter16': 'Colors & Descriptions',
    'chapter17': 'Clothing & Fashion',
    'chapter18': 'Hobbies & Entertainment',
    'chapter19': 'Work & Professions',
    'chapter20': 'Relationships & Social',
    'chapter21': 'Household Items',
    'chapter22': 'Numbers & Mathematics',
    'chapter23': 'Communication & Language',
    'chapter24': 'Arts & Culture',
    'chapter25': 'Emotions & Feelings',
    'chapter26': 'Weather & Seasons',
    'chapter27': 'Sports & Fitness',
    'chapter28': 'Science & Nature',
    'chapter29': 'Daily Routines & Time',
    'chapter30': 'Advanced Essential',
    'chapter31': 'Punctuation & Symbols'
  }

  const [gameState, setGameState] = useState<'menu' | 'carSelection' | 'chapterSelection' | 'roundSelection' | 'countdown' | 'playing' | 'paused' | 'gameOver' | 'roundSuccess'>('menu')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [showLanguageLearning, setShowLanguageLearning] = useState(false)
  const [gameSpeed, setGameSpeed] = useState(2)
  const [selectedChapter, setSelectedChapter] = useState('chapter01')
  const [selectedRound, setSelectedRound] = useState('')
  const [completedRounds, setCompletedRounds] = useState<string[]>([])
  const [completedChapters, setCompletedChapters] = useState<string[]>([])
  const [selectedCar, setSelectedCar] = useState<Car>({
    id: 'cyber-racer',
    name: 'Cyber Racer',
    color: 'cyan',
    gradient: 'from-cyan-400 to-cyan-600',
    speed: 80,
    handling: 75,
    shield: 70,
    unlocked: true
  })

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('neonDriftHighScore')
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore))
    }
    
    // Load completed rounds and chapters from localStorage
    const savedCompletedRounds = localStorage.getItem('neonDriftCompletedRounds')
    if (savedCompletedRounds) {
      setCompletedRounds(JSON.parse(savedCompletedRounds))
    }
    
    const savedCompletedChapters = localStorage.getItem('neonDriftCompletedChapters')
    if (savedCompletedChapters) {
      setCompletedChapters(JSON.parse(savedCompletedChapters))
    }
    
    // Initialize sound engine
    soundEngine.initSounds()
    soundEngine.enable()
    
    // Start menu music after a short delay
    setTimeout(() => {
      soundEngine.playMusic('menuMusic', true)
    }, 1000)
  }, [])

  const startGame = () => {
    setGameState('countdown')
    setScore(0)
    setCountdown(3)
    
    // Stop menu music and prepare game music
    soundEngine.stopMusic()
    
    // Play initial countdown sound
    soundEngine.play('countdown', 0.6)
    
    // Start countdown timer
    let currentCount = 3
    const countdownInterval = setInterval(() => {
      currentCount -= 1
      if (currentCount <= 0) {
        clearInterval(countdownInterval)
        // Show "GO!" for a brief moment before starting
        setCountdown(0)
        soundEngine.play('start', 0.8)
        setTimeout(() => {
          setGameState('playing')
          // Start gameplay music
          soundEngine.playMusic('gameMusic', true)
        }, 800) // Give more time to see "GO!"
      } else {
        setCountdown(currentCount)
        soundEngine.play('countdown', 0.6) // Play countdown beep
      }
    }, 1000) // Every 1 second
  }

  const endGame = (finalScore: number) => {
    setScore(finalScore)
    if (finalScore > highScore) {
      setHighScore(finalScore)
      localStorage.setItem('neonDriftHighScore', finalScore.toString())
    }
    
    // Stop game music and return to menu music
    soundEngine.stopMusic()
    setTimeout(() => {
      soundEngine.playMusic('menuMusic', true)
    }, 1000)
    
    setGameState('gameOver')
  }

  const returnToMenu = () => {
    setGameState('menu')
  }

  const showCarSelection = () => {
    setGameState('carSelection')
  }

  const selectCar = (car: Car) => {
    setSelectedCar(car)
    // Optionally save to localStorage
    localStorage.setItem('neonDriftSelectedCar', JSON.stringify(car))
  }

  // Language learning callbacks
  const handleLanguageLearningTrigger = useCallback(() => {
    setShowLanguageLearning(true)
  }, [])

  const handleLanguageLearningComplete = useCallback(() => {
    setShowLanguageLearning(false)
  }, [])

  const handleLanguageLearningCorrect = useCallback((points: number) => {
    setScore(prev => prev + points)
  }, [])

    const handleLanguageLearningIncorrect = useCallback(() => {
    // Handle incorrect answer - maybe reduce health or show feedback
  }, [])

  // Chapter and Round handlers
  const handleSelectChapter = useCallback((chapterId: string) => {
    setSelectedChapter(chapterId)
    setGameState('roundSelection')
  }, [])

  const handleSelectRound = useCallback((roundId: string) => {
    setSelectedRound(roundId)
    startGame()
  }, [])

  const handleRoundComplete = useCallback((roundId: string) => {
    const newCompletedRounds = [...completedRounds, roundId]
    setCompletedRounds(newCompletedRounds)
    localStorage.setItem('neonDriftCompletedRounds', JSON.stringify(newCompletedRounds))
    
    // Check if chapter is complete (all 5 rounds finished)
    const chapterRounds = newCompletedRounds.filter(id => id.startsWith(selectedChapter))
    if (chapterRounds.length === 5 && !completedChapters.includes(selectedChapter)) {
      const newCompletedChapters = [...completedChapters, selectedChapter]
      setCompletedChapters(newCompletedChapters)
      localStorage.setItem('neonDriftCompletedChapters', JSON.stringify(newCompletedChapters))
    }
    
    // Play success sound and stop game music
    soundEngine.stopMusic()
    soundEngine.play('success', 0.8)
    
    // Show success screen instead of going directly to round selection
    setGameState('roundSuccess')
  }, [completedRounds, completedChapters, selectedChapter])

  const handleBackToChapters = useCallback(() => {
    setGameState('chapterSelection')
  }, [])

  const handleSuccessContinue = useCallback(() => {
    // Restart menu music
    soundEngine.playMusic('menuMusic', true)
    setGameState('roundSelection')
  }, [])

  const handleSpeedChange = useCallback((speed: number) => {
    setGameSpeed(speed)
  }, [])

  // Test function for language learning
  const testLanguageLearning = useCallback(() => {
    setShowLanguageLearning(true)
  }, [])

  // Make test function available globally for the test button
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as Window & { testLanguageLearning?: () => void }).testLanguageLearning = testLanguageLearning
    }
  }, [testLanguageLearning])

  // Control body overflow based on game state - only prevent scrolling during actual gameplay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.body
      // Prevent scrolling only during gameplay (playing/paused states)
      if (gameState === 'playing' || gameState === 'paused') {
        body.style.overflow = 'hidden'
      } else {
        // Allow scrolling for menus (menu, carSelection, chapterSelection, countdown, gameOver)
        body.style.overflow = 'auto'
      }
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto'
      }
    }
  }, [gameState])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
      </div>
      
      {gameState === 'menu' && (
        <GameMenu
          onStartGame={startGame}
          onSelectCar={() => setGameState('carSelection')}
          onSelectChapter={() => setGameState('chapterSelection')}
          highScore={highScore}
          selectedCar={selectedCar}
        />
      )}

      {gameState === 'carSelection' && (
        <CarSelection
          onSelectCar={selectCar}
          onBack={returnToMenu}
          selectedCarId={selectedCar.id}
        />
      )}

      {gameState === 'chapterSelection' && (
        <ChapterSelection
          onSelectChapter={handleSelectChapter}
          onBack={returnToMenu}
          selectedChapter={selectedChapter}
          completedChapters={completedChapters}
        />
      )}

      {gameState === 'roundSelection' && (
        <RoundSelection
          chapterName={chapterNames[selectedChapter] || 'Unknown Chapter'}
          chapterId={selectedChapter}
          onSelectRound={handleSelectRound}
          onBack={handleBackToChapters}
          selectedRound={selectedRound}
          completedRounds={completedRounds.filter(roundId => roundId.startsWith(selectedChapter))}
        />
      )}
      
      {gameState === 'countdown' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
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
              className="relative"
            >
              <div 
                className="text-9xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 50px rgba(6, 182, 212, 0.8), 0 0 100px rgba(6, 182, 212, 0.4)',
                  filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.8))'
                }}
              >
                {countdown === 0 ? 'GO!' : countdown}
              </div>
              
              {/* Pulsing ring effect */}
              <motion.div
                className="absolute inset-0 border-4 border-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.8, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
              
              {/* Secondary ring */}
              <motion.div
                className="absolute inset-0 border-2 border-purple-400 rounded-full"
                animate={{
                  scale: [1, 2],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.3
                }}
              />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl text-cyan-300 mt-8"
            >
              Get Ready!
            </motion.p>
          </div>
        </div>
      )}
      
      {gameState === 'playing' && (
        <NeonDriftGame 
          onGameEnd={endGame}
          onPause={() => setGameState('paused')}
          onLanguageLearning={handleLanguageLearningTrigger}
          onSpeedChange={handleSpeedChange}
          onRoundComplete={handleRoundComplete}
          selectedCar={selectedCar}
          selectedChapter={selectedChapter}
          selectedRound={selectedRound}
        />
      )}
      
      {gameState === 'paused' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 text-center max-w-sm mx-auto">
            <h2 className="text-4xl font-bold text-cyan-400 mb-6">PAUSED</h2>
            <div className="space-y-4">
              <button
                onClick={() => setGameState('playing')}
                className="block w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Resume
              </button>
              <button
                onClick={returnToMenu}
                className="block w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}
      
      {gameState === 'roundSuccess' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300,
                damping: 20,
                delay: 0.2
              }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30 max-w-md mx-auto"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 400 }}
                className="mb-6"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-white text-4xl"
                  >
                    ✓
                  </motion.div>
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2"
              >
                Round Complete!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-gray-300 mb-2"
              >
                Great job! You&apos;ve successfully completed this round.
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="text-sm text-green-400 mb-6"
              >
                The next round is now unlocked!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="space-y-4"
              >
                <button
                  onClick={handleSuccessContinue}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Continue to Next Round
                </button>
                
                <button
                  onClick={handleBackToChapters}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Back to Chapters
                </button>
              </motion.div>

              {/* Celebration particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    style={{
                      left: `${20 + i * 10}%`,
                      top: `${30 + (i % 2) * 20}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-4xl font-bold text-red-400 mb-4">GAME OVER</h2>
            <div className="space-y-2 mb-6">
              <p className="text-2xl text-cyan-400">Score: {score.toLocaleString()}</p>
              <p className="text-lg text-yellow-400">High Score: {highScore.toLocaleString()}</p>
            </div>
            <div className="space-y-4">
              <button
                onClick={startGame}
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Play Again
              </button>
              <button
                onClick={returnToMenu}
                className="block w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Main Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Language Learning Component */}
      {showLanguageLearning && (
        <LanguageLearning
          currentQuestion={null}
          isQuestionActive={false}
          currentChapter="basics"
          playerHealth={100}
          answerBoxes={[]}
        />
      )}
    </div>
  )
}
