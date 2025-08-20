import React, { useEffect, useCallback } from 'react'
import { 
  useGameStore, 
  useGameStatus, 
  usePlayerStats, 
  usePlayerPosition, 
  useQuestionState,
  useVisualEffects,
  useCarUpgrades 
} from '../store/gameStore'
import { useGameRefs } from '../store/gameRefs'
import { useGameActions } from '../store/gameActions'
import { soundEngine } from '../utils/soundEngine'
import { vocabularyDatabase } from '../vocabulary/vocabulary-summary'

// Import existing components
import GameHUD from './GameHUD'
import QuestionPreview from './QuestionPreview'
import AnswerBox from './AnswerBox'
import ParticleSystem from './ParticleSystem'
import ScreenShake from './ScreenShake'

interface NeonDriftGameProps {
  selectedChapter: string
  onLanguageLearning: (mode: string) => void
  onSpeedChange: (speed: number) => void
  onGameEnd: (score: number) => void
  onRoundComplete: (round: number) => void
}

const NeonDriftGameZustand: React.FC<NeonDriftGameProps> = ({
  selectedChapter,
  onLanguageLearning,
  onSpeedChange,
  onGameEnd,
  onRoundComplete
}) => {
  // Zustand store hooks
  const gameStatus = useGameStatus()
  const playerStats = usePlayerStats()
  const playerPosition = usePlayerPosition()
  const questionState = useQuestionState()
  const visualEffects = useVisualEffects()
  const carUpgrades = useCarUpgrades()
  
  // Store actions
  const {
    selectChapter,
    setCurrentQuestion,
    setAnswerBoxes,
    activateQuestion,
    deactivateQuestion,
    setQuestionType,
    generateId,
    changeLane,
    updateGameObjects,
    triggerShake,
    addParticles,
  } = useGameStore()
  
  // Refs for synchronous operations
  const refs = useGameRefs()
  
  // Enhanced actions with business logic
  const { 
    upgradeCarLevel, 
    handleCorrectAnswer, 
    handleWrongAnswer,
    changeLaneWithPosition 
  } = useGameActions()
  
  // Initialize sound engine
  useEffect(() => {
    soundEngine.initSounds()
    soundEngine.enable()
  }, [])
  
  // Set selected chapter
  useEffect(() => {
    selectChapter(selectedChapter)
  }, [selectedChapter, selectChapter])
  
  // Generate a new question
  const generateQuestion = useCallback(() => {
    const vocabulary = vocabularyDatabase[selectedChapter as keyof typeof vocabularyDatabase] || vocabularyDatabase.chapter01
    
    // Capture carLevel at the time of function call to avoid dependency issues
    const currentCarLevel = playerStats.carLevel
    const maxDifficulty = Math.min(3, Math.max(1, Math.floor(currentCarLevel / 3) + 1))
    const availableWords = vocabulary.filter(word => word.difficulty <= maxDifficulty)
    
    // Fallback to all words if no words match the difficulty
    const wordsToUse = availableWords.length > 0 ? availableWords : vocabulary
    
    if (wordsToUse.length === 0) return
    
    const word = wordsToUse[Math.floor(Math.random() * wordsToUse.length)]
    
    // Always Vietnamese → English (translate mode only)
    const type = 'translate'
    setQuestionType(type)
    
    // Get wrong answer from same category
    const wrongAnswers = vocabulary.filter(w => w.id !== word.id && w.category === word.category)
    const wrongWord = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)] || vocabulary[0]
    
    const correctAnswer = word.english
    const wrongAnswer = wrongWord.english
    const correctSide: 'left' | 'right' = Math.random() > 0.5 ? 'left' : 'right'
    
    console.log(`Generating question at car level ${currentCarLevel}:`, {
      question: word.vietnamese,
      correctAnswer,
      wrongAnswer,
      correctSide
    })
    
    setCurrentQuestion(word)
    activateQuestion()
    
    // Delay answer box spawn by 2 seconds
    setTimeout(() => {
      const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
        'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
        'bg-cyan-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500',
        'bg-lime-500', 'bg-amber-500', 'bg-teal-500', 'bg-sky-500'
      ]
      
      const leftColor = colors[Math.floor(Math.random() * colors.length)]
      let rightColor = colors[Math.floor(Math.random() * colors.length)]
      
      while (rightColor === leftColor) {
        rightColor = colors[Math.floor(Math.random() * colors.length)]
      }
      
      const leftBox = {
        id: generateId(),
        x: 25,
        y: -30,
        width: 12,
        height: 8,
        lane: 'left' as const,
        answer: correctSide === 'left' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'left',
        color: leftColor
      }
      
      const rightBox = {
        id: generateId(),
        x: 75,
        y: -30,
        width: 12,
        height: 8,
        lane: 'right' as const,
        answer: correctSide === 'right' ? correctAnswer : wrongAnswer,
        isCorrect: correctSide === 'right',
        color: rightColor
      }
      
      console.log('Answer boxes generated:', {
        leftBox: `"${leftBox.answer}" (${leftBox.isCorrect ? 'correct' : 'wrong'})`,
        rightBox: `"${rightBox.answer}" (${rightBox.isCorrect ? 'correct' : 'wrong'})`
      })
      
      setAnswerBoxes([leftBox, rightBox])
    }, 2000)
  }, [selectedChapter, playerStats.carLevel, setCurrentQuestion, setQuestionType, activateQuestion, setAnswerBoxes, generateId])
  
  // Generate new question wrapper
  const generateNewQuestion = useCallback(() => {
    if (!questionState.isQuestionActive && refs.questionTimer.current === 0) {
      generateQuestion()
    }
  }, [generateQuestion, questionState.isQuestionActive, refs.questionTimer])
  
  // Collision detection for answer boxes
  const checkAnswerBoxCollision = useCallback((box: any) => {
    const carY = 85 // Fixed car Y position
    const tolerance = 2
    
    return (
      box.y + box.height >= carY - tolerance &&
      box.y <= carY + 8 + tolerance &&
      box.x + box.width >= playerPosition.playerX - 4 &&
      box.x <= playerPosition.playerX + 8
    )
  }, [playerPosition.playerX])
  
  // Handle answer box collisions with enhanced protection
  const handleAnswerBoxCollisions = useCallback(() => {
    // MULTIPLE SAFETY CHECKS
    if (!questionState.isQuestionActive || questionState.answerBoxes.length === 0 || 
        refs.collisionProcessing.current || refs.upgradeInProgress.current) {
      return
    }
    
    // Find the answer box in the current lane
    const boxInCurrentLane = questionState.answerBoxes.find(box => box.lane === playerPosition.currentLane)
    
    if (!boxInCurrentLane) return
    
    // Check for collision with the box in current lane
    if (checkAnswerBoxCollision(boxInCurrentLane)) {
      console.log('🎯 ANSWER BOX COLLISION DETECTED!')
      console.log(`Car lane: ${playerPosition.currentLane}, Box lane: ${boxInCurrentLane.lane}`)
      console.log(`Answer: "${boxInCurrentLane.answer}", Is Correct: ${boxInCurrentLane.isCorrect}`)
      
      // CRITICAL: Immediately set ALL processing flags to prevent multiple calls
      refs.collisionProcessing.current = true
      
      // CRITICAL: Capture the collision result IMMEDIATELY before any state changes
      const wasCorrectAnswer = boxInCurrentLane.isCorrect
      
      // CRITICAL: Immediately prevent any further collisions and clear state
      deactivateQuestion()
      setAnswerBoxes([])
      setCurrentQuestion(null)
      
      // Process the answer
      if (wasCorrectAnswer) {
        handleCorrectAnswer()
      } else {
        handleWrongAnswer()
      }
      
      // Reset collision processing flag after answer is processed
      setTimeout(() => {
        refs.collisionProcessing.current = false
      }, 100)
      
      // Set timer for next question with appropriate delay
      refs.questionTimer.current = Date.now()
    }
  }, [
    questionState.isQuestionActive, 
    questionState.answerBoxes, 
    playerPosition.currentLane,
    checkAnswerBoxCollision,
    deactivateQuestion,
    setAnswerBoxes,
    setCurrentQuestion,
    handleCorrectAnswer,
    handleWrongAnswer,
    refs
  ])
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key === 'a' || key === 'arrowleft') {
        changeLaneWithPosition('left')
      } else if (key === 'd' || key === 'arrowright') {
        changeLaneWithPosition('right')
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [changeLaneWithPosition])
  
  // Game loop
  useEffect(() => {
    if (!gameStatus.isPlaying || gameStatus.isPaused) return
    
    const gameLoop = setInterval(() => {
      // Handle answer box collisions
      handleAnswerBoxCollisions()
      
      // Generate new questions with proper timing
      if (!questionState.isQuestionActive && refs.questionTimer.current === 0) {
        generateNewQuestion()
      } else if (!questionState.isQuestionActive && refs.questionTimer.current > 0) {
        const timeSinceLastQuestion = Date.now() - refs.questionTimer.current
        if (timeSinceLastQuestion >= 2000) {
          refs.questionTimer.current = 0
        }
      }
    }, 16) // 60 FPS
    
    return () => clearInterval(gameLoop)
  }, [
    gameStatus.isPlaying, 
    gameStatus.isPaused, 
    handleAnswerBoxCollisions, 
    generateNewQuestion, 
    questionState.isQuestionActive, 
    refs.questionTimer
  ])
  
  // Start first question
  useEffect(() => {
    const timer = setTimeout(() => {
      generateNewQuestion()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [generateNewQuestion])
  
  // Handle game end
  useEffect(() => {
    if (playerStats.health <= 0) {
      setTimeout(() => onGameEnd(playerStats.score), 100)
    }
  }, [playerStats.health, playerStats.score, onGameEnd])
  
  // Handle round completion
  useEffect(() => {
    if (gameStatus.roundComplete && questionState.selectedRound) {
      setTimeout(() => onRoundComplete(questionState.selectedRound), 1000)
    }
  }, [gameStatus.roundComplete, questionState.selectedRound, onRoundComplete])
  
  return (
    <ScreenShake intensity={visualEffects.shakeIntensity} trigger={visualEffects.shakeTrigger}>
      <div 
        ref={refs.gameAreaRef} 
        className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-blue-900 to-black"
      >
        {/* Moving background grid */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, cyan 1px, transparent 1px),
                linear-gradient(to bottom, cyan 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `translateY(${(playerStats.score * 0.5) % 50}px)`
            }}
          />
        </div>

        {/* Road lanes */}
        <div className="absolute inset-0 flex justify-center" style={{ zIndex: 2 }}>
          <div className="relative w-96 h-full border-l-2 border-r-2 border-cyan-400 opacity-50">
            <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white opacity-30 transform -translate-x-1/2" />
          </div>
        </div>

        {/* Game HUD */}
        <div style={{ zIndex: 100 }}>
          <GameHUD
            score={playerStats.score}
            health={playerStats.health}
            level={playerStats.carLevel}
            combo={0}
            speed={1}
            streak={0}
            powerups={{ shield: 0, boost: 0 }}
            carLevel={playerStats.carLevel}
          />
        </div>

        {/* Question Preview */}
        <div style={{ zIndex: 90 }}>
          <QuestionPreview
            question={questionState.currentQuestion}
            isActive={questionState.isQuestionActive}
            type={questionState.questionType}
          />
        </div>

        {/* Car */}
        <div
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: `${playerPosition.playerX}%`,
            top: '85%',
            width: '8%',
            height: '8%',
            zIndex: 50,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-full h-full bg-gradient-to-t from-cyan-400 to-blue-500 rounded-lg shadow-lg shadow-cyan-400/50">
            <div className="w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-t-lg" />
          </div>
        </div>

        {/* Answer Boxes */}
        {questionState.answerBoxes.map((box) => (
          <AnswerBox
            key={box.id}
            answer={box.answer}
            x={box.x}
            y={box.y}
            width={box.width}
            height={box.height}
            color={box.color}
            isCorrect={box.isCorrect}
            lane={box.lane}
          />
        ))}

        {/* Particle System */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 10 }}>
          <ParticleSystem particles={visualEffects.particles} />
        </div>

        {/* Car Level Display */}
        <div style={{ zIndex: 80 }}>
          <div className="absolute top-20 left-4 text-white">
            <div className="bg-black/50 px-4 py-2 rounded-lg">
              <div className="text-lg font-bold">Car Level: {playerStats.carLevel}</div>
              <div className="text-sm opacity-75">Speed: {carUpgrades.speed.toFixed(1)}x</div>
              <div className="text-sm opacity-75">Handling: {carUpgrades.handling.toFixed(1)}x</div>
            </div>
          </div>
        </div>
      </div>
    </ScreenShake>
  )
}

export default NeonDriftGameZustand
