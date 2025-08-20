import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'

// Types
export interface VocabularyWord {
  id: string
  vietnamese: string
  english: string
  category: string
  difficulty: number
}

export interface AnswerBox {
  id: string
  x: number
  y: number
  width: number
  height: number
  lane: 'left' | 'right'
  answer: string
  isCorrect: boolean
  color: string
}

export interface Particle {
  id: string
  x: number
  y: number
}

export interface GameObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'obstacle' | 'coin' | 'powerup'
  speed?: number
  gradient?: string
}

export interface CarUpgrades {
  speed: number
  handling: number
  size: number
  wings: boolean
  boost: boolean
  shield: boolean
}

export interface PreviewItem {
  id: string
  type: string
  distance: number
}

// Game State Interface
interface GameState {
  // Core game state
  isPlaying: boolean
  isPaused: boolean
  gameStarted: boolean
  roundComplete: boolean
  
  // Player stats
  score: number
  health: number
  lives: number
  carLevel: number
  correctAnswers: number
  
  // Game mechanics
  speed: number
  combo: number
  streak: number
  comboMultiplier: number
  multiplier: number
  coinStreak: number
  questionsAnswered: number
  totalCoins: number
  
  // Position and movement
  playerX: number
  currentLane: 'left' | 'right'
  laneChangeKeys: Set<string>
  
  // Visual effects
  shakeIntensity: number
  shakeTrigger: number
  particles: Particle[]
  
  // Questions and learning
  currentQuestion: VocabularyWord | null
  answerBoxes: AnswerBox[]
  isQuestionActive: boolean
  questionType: 'translate' | 'listening'
  selectedChapter: string
  selectedRound: number | null
  
  // Game objects
  gameObjects: GameObject[]
  nearMisses: Array<{ id: string; x: number; y: number }>
  upcomingItems: PreviewItem[]
  
  // Car upgrades
  carUpgrades: CarUpgrades
  
  // Power-ups
  powerups: { shield: number; boost: number }
  
  // Device controls
  deviceOrientation: { gamma: number }
  
  // Timing and refs (we'll handle these separately)
  timeUntilNextQuestion: number
}

// Actions Interface
interface GameActions {
  // Game flow
  startGame: () => void
  pauseGame: () => void
  endGame: () => void
  resetGame: () => void
  completeRound: () => void
  
  // Player actions
  updateScore: (points: number) => void
  takeDamage: (damage?: number) => void
  healPlayer: (amount?: number) => void
  upgradeCarLevel: () => void
  
  // Movement
  changeLane: (lane: 'left' | 'right') => void
  updatePlayerPosition: (x: number) => void
  setLaneChangeKeys: (keys: Set<string>) => void
  
  // Questions and learning
  setCurrentQuestion: (question: VocabularyWord | null) => void
  setAnswerBoxes: (boxes: AnswerBox[]) => void
  activateQuestion: () => void
  deactivateQuestion: () => void
  setQuestionType: (type: 'translate' | 'listening') => void
  selectChapter: (chapter: string) => void
  selectRound: (round: number | null) => void
  incrementQuestionsAnswered: () => void
  
  // Game mechanics
  updateCombo: (combo: number) => void
  updateStreak: (streak: number) => void
  resetStreak: () => void
  updateMultiplier: (multiplier: number) => void
  
  // Visual effects
  addParticles: (newParticles: Particle[]) => void
  clearParticles: () => void
  triggerShake: (intensity: number) => void
  
  // Game objects
  addGameObject: (object: GameObject) => void
  updateGameObjects: (objects: GameObject[]) => void
  clearGameObjects: () => void
  addNearMiss: (nearMiss: { id: string; x: number; y: number }) => void
  
  // Car upgrades
  updateCarUpgrades: (upgrades: Partial<CarUpgrades>) => void
  resetCarUpgrades: () => void
  
  // Power-ups
  addPowerup: (type: 'shield' | 'boost', amount: number) => void
  usePowerup: (type: 'shield' | 'boost', amount?: number) => void
  
  // Device controls
  setDeviceOrientation: (orientation: { gamma: number }) => void
  
  // Utility
  generateId: () => string
}

// Store type
type GameStore = GameState & GameActions

// Initial state
const initialState: GameState = {
  // Core game state
  isPlaying: false,
  isPaused: false,
  gameStarted: false,
  roundComplete: false,
  
  // Player stats
  score: 0,
  health: 3,
  lives: 3,
  carLevel: 1,
  correctAnswers: 0,
  
  // Game mechanics
  speed: 1,
  combo: 0,
  streak: 0,
  comboMultiplier: 1,
  multiplier: 1.0,
  coinStreak: 0,
  questionsAnswered: 0,
  totalCoins: 0,
  
  // Position and movement
  playerX: 50,
  currentLane: 'left',
  laneChangeKeys: new Set(),
  
  // Visual effects
  shakeIntensity: 0,
  shakeTrigger: 0,
  particles: [],
  
  // Questions and learning
  currentQuestion: null,
  answerBoxes: [],
  isQuestionActive: false,
  questionType: 'translate',
  selectedChapter: 'chapter01',
  selectedRound: null,
  
  // Game objects
  gameObjects: [],
  nearMisses: [],
  upcomingItems: [],
  
  // Car upgrades
  carUpgrades: {
    speed: 1.0,
    handling: 1.0,
    size: 1.0,
    wings: false,
    boost: false,
    shield: false,
  },
  
  // Power-ups
  powerups: { shield: 0, boost: 0 },
  
  // Device controls
  deviceOrientation: { gamma: 0 },
  
  // Timing
  timeUntilNextQuestion: 30000,
}

// Create the store
export const useGameStore = create<GameStore>()(
  devtools(
    subscribeWithSelector(
      (set) => ({
        ...initialState,
        
        // Game flow actions
        startGame: () => set((state) => ({
          ...state,
          isPlaying: true,
          gameStarted: true,
          isPaused: false,
        })),
        
        pauseGame: () => set((state) => ({
          ...state,
          isPaused: !state.isPaused,
        })),
        
        endGame: () => set((state) => ({
          ...state,
          isPlaying: false,
          gameStarted: false,
          isPaused: false,
        })),
        
        resetGame: () => set(() => ({ ...initialState })),
        
        completeRound: () => set((state) => ({
          ...state,
          roundComplete: true,
        })),
        
        // Player actions
        updateScore: (points: number) => set((state) => ({
          ...state,
          score: state.score + points,
        })),
        
        takeDamage: (damage = 1) => set((state) => {
          const newHealth = Math.max(0, state.health - damage)
          return {
            ...state,
            health: newHealth,
            isPlaying: newHealth > 0 ? state.isPlaying : false,
          }
        }),
        
        healPlayer: (amount = 1) => set((state) => ({
          ...state,
          health: Math.min(3, state.health + amount),
        })),
        
        upgradeCarLevel: () => set((state) => {
          const newLevel = state.carLevel + 1
          const newUpgrades = { ...state.carUpgrades }
          
          // Update car upgrades based on level
          if (newLevel >= 2) {
            newUpgrades.speed = Math.min(1.1 + (newLevel * 0.05), 2.0)
          }
          if (newLevel >= 4) {
            newUpgrades.handling = Math.min(1.1 + (newLevel * 0.02), 1.5)
          }
          
          console.log(`🚗 CAR LEVEL UPGRADE: ${state.carLevel} → ${newLevel}`)
          
          return {
            ...state,
            carLevel: newLevel,
            correctAnswers: state.correctAnswers + 1,
            carUpgrades: newUpgrades,
          }
        }),
        
        // Movement actions
        changeLane: (lane: 'left' | 'right') => set((state) => ({
          ...state,
          currentLane: lane,
          playerX: lane === 'left' ? 37.5 : 62.5,
        })),
        
        updatePlayerPosition: (x: number) => set((state) => ({
          ...state,
          playerX: x,
        })),
        
        setLaneChangeKeys: (keys: Set<string>) => set((state) => ({
          ...state,
          laneChangeKeys: keys,
        })),
        
        // Questions and learning
        setCurrentQuestion: (question: VocabularyWord | null) => set((state) => ({
          ...state,
          currentQuestion: question,
        })),
        
        setAnswerBoxes: (boxes: AnswerBox[]) => set((state) => ({
          ...state,
          answerBoxes: boxes,
        })),
        
        activateQuestion: () => set((state) => ({
          ...state,
          isQuestionActive: true,
        })),
        
        deactivateQuestion: () => set((state) => ({
          ...state,
          isQuestionActive: false,
        })),
        
        setQuestionType: (type: 'translate' | 'listening') => set((state) => ({
          ...state,
          questionType: type,
        })),
        
        selectChapter: (chapter: string) => set((state) => ({
          ...state,
          selectedChapter: chapter,
        })),
        
        selectRound: (round: number | null) => set((state) => ({
          ...state,
          selectedRound: round,
        })),
        
        incrementQuestionsAnswered: () => set((state) => ({
          ...state,
          questionsAnswered: state.questionsAnswered + 1,
        })),
        
        // Game mechanics
        updateCombo: (combo: number) => set((state) => ({
          ...state,
          combo,
        })),
        
        updateStreak: (streak: number) => set((state) => ({
          ...state,
          streak,
          comboMultiplier: streak >= 4 ? Math.min(state.comboMultiplier + 0.5, 5) : state.comboMultiplier,
        })),
        
        resetStreak: () => set((state) => ({
          ...state,
          streak: 0,
          comboMultiplier: 1,
        })),
        
        updateMultiplier: (multiplier: number) => set((state) => ({
          ...state,
          multiplier,
        })),
        
        // Visual effects
        addParticles: (newParticles: Particle[]) => set((state) => ({
          ...state,
          particles: [...state.particles, ...newParticles],
        })),
        
        clearParticles: () => set((state) => ({
          ...state,
          particles: [],
        })),
        
        triggerShake: (intensity: number) => set((state) => ({
          ...state,
          shakeIntensity: intensity,
          shakeTrigger: state.shakeTrigger + 1,
        })),
        
        // Game objects
        addGameObject: (object: GameObject) => set((state) => ({
          ...state,
          gameObjects: [...state.gameObjects, object],
        })),
        
        updateGameObjects: (objects: GameObject[]) => set((state) => ({
          ...state,
          gameObjects: objects,
        })),
        
        clearGameObjects: () => set((state) => ({
          ...state,
          gameObjects: [],
        })),
        
        addNearMiss: (nearMiss: { id: string; x: number; y: number }) => set((state) => ({
          ...state,
          nearMisses: [...state.nearMisses, nearMiss],
        })),
        
        // Car upgrades
        updateCarUpgrades: (upgrades: Partial<CarUpgrades>) => set((state) => ({
          ...state,
          carUpgrades: { ...state.carUpgrades, ...upgrades },
        })),
        
        resetCarUpgrades: () => set((state) => ({
          ...state,
          carUpgrades: initialState.carUpgrades,
        })),
        
        // Power-ups
        addPowerup: (type: 'shield' | 'boost', amount: number) => set((state) => ({
          ...state,
          powerups: {
            ...state.powerups,
            [type]: state.powerups[type] + amount,
          },
        })),
        
        usePowerup: (type: 'shield' | 'boost', amount = 1) => set((state) => ({
          ...state,
          powerups: {
            ...state.powerups,
            [type]: Math.max(0, state.powerups[type] - amount),
          },
        })),
        
        // Device controls
        setDeviceOrientation: (orientation: { gamma: number }) => set((state) => ({
          ...state,
          deviceOrientation: orientation,
        })),
        
        // Utility
        generateId: () => Math.random().toString(36).substr(2, 9),
      })
    ),
    {
      name: 'neon-drift-game-store',
    }
  )
)

// Selectors for common state combinations
export const useGameStatus = () => useGameStore((state) => ({
  isPlaying: state.isPlaying,
  isPaused: state.isPaused,
  gameStarted: state.gameStarted,
  roundComplete: state.roundComplete,
}))

export const usePlayerStats = () => useGameStore((state) => ({
  score: state.score,
  health: state.health,
  lives: state.lives,
  carLevel: state.carLevel,
  correctAnswers: state.correctAnswers,
}))

export const useGameMechanics = () => useGameStore((state) => ({
  speed: state.speed,
  combo: state.combo,
  streak: state.streak,
  comboMultiplier: state.comboMultiplier,
  questionsAnswered: state.questionsAnswered,
}))

export const usePlayerPosition = () => useGameStore((state) => ({
  playerX: state.playerX,
  currentLane: state.currentLane,
  laneChangeKeys: state.laneChangeKeys,
}))

export const useQuestionState = () => useGameStore((state) => ({
  currentQuestion: state.currentQuestion,
  answerBoxes: state.answerBoxes,
  isQuestionActive: state.isQuestionActive,
  questionType: state.questionType,
}))

export const useVisualEffects = () => useGameStore((state) => ({
  shakeIntensity: state.shakeIntensity,
  shakeTrigger: state.shakeTrigger,
  particles: state.particles,
}))

export const useCarUpgrades = () => useGameStore((state) => state.carUpgrades)
export const usePowerups = () => useGameStore((state) => state.powerups)
