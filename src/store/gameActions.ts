import { useCallback } from 'react'
import { useGameStore } from './gameStore'
import { useGameRefs } from './gameRefs'
import { soundEngine } from '../utils/soundEngine'

// Custom hooks that combine Zustand actions with business logic
export const useGameActions = () => {
  const store = useGameStore()
  const refs = useGameRefs()
  
  // Enhanced car upgrade function with protection
  const upgradeCarLevel = useCallback(() => {
    // QUINTUPLE PROTECTION SYSTEM
    // 0. Time-based protection - minimum 300ms between upgrades
    const now = Date.now()
    if (now - refs.lastUpgradeTime.current < 300) {
      console.log('🚫 BLOCKED: Too soon since last upgrade (< 300ms)')
      return
    }
    
    // 1. Check if collision is still being processed
    if (refs.collisionProcessing.current) {
      console.log('🚫 BLOCKED: Collision still being processed')
      return
    }
    
    // 2. Check if upgrade is already in progress
    if (refs.upgradeInProgress.current) {
      console.log('🚫 BLOCKED: Upgrade already in progress')
      return
    }
    
    // 3. Prevent multiple upgrades from the same question
    const currentQuestion = store.currentQuestion
    const currentQuestionId = currentQuestion?.id
    if (currentQuestionId && refs.lastQuestionId.current === currentQuestionId) {
      console.log('🚫 BLOCKED: Already upgraded for this question ID:', currentQuestionId)
      return
    }
    
    // 4. Lock the upgrade process immediately and record time
    refs.upgradeInProgress.current = true
    refs.lastUpgradeTime.current = now
    
    if (currentQuestionId) {
      refs.lastQuestionId.current = currentQuestionId
    }
    
    // Get current level for sound effects
    const currentLevel = store.carLevel
    
    // Upgrade the car level in store
    store.upgradeCarLevel()
    
    // Play addictive level-based sound effects
    if (currentLevel <= 5) {
      soundEngine.play('success', 0.9) // Normal success sound
    } else if (currentLevel <= 10) {
      soundEngine.play('success', 1.0) // Slightly louder
      setTimeout(() => soundEngine.play('success', 0.5), 150)
    } else {
      // Epic level up sound for high levels
      soundEngine.play('success', 1.0)
      setTimeout(() => soundEngine.play('success', 0.7), 100)
      setTimeout(() => soundEngine.play('success', 0.5), 200)
    }
    
    // Reset upgrade lock after a delay
    setTimeout(() => {
      refs.upgradeInProgress.current = false
      console.log(`🔓 Upgrade lock released for level ${currentLevel + 1}`)
    }, 500)
    
  }, [store, refs])
  
  // Enhanced collision handler for answer boxes
  const handleCorrectAnswer = useCallback(() => {
    console.log('✅ PROCESSING CORRECT ANSWER - NO HEALTH LOSS')
    
    // Update score and combo
    store.updateScore(100)
    store.updateCombo(store.combo + 1)
    
    // Trigger visual effects
    store.triggerShake(2) // Gentle shake for success
    
    // Upgrade car level (includes sound effects and protection)
    upgradeCarLevel()
    
    // Create success particles
    const successParticles = Array.from({ length: 15 }, () => ({
      id: store.generateId(),
      x: store.playerX + Math.random() * 8,
      y: 85 + Math.random() * 6
    }))
    store.addParticles(successParticles)
    
    // Increment questions answered
    store.incrementQuestionsAnswered()
    
    // Check for round completion
    if (store.questionsAnswered >= 9 && store.selectedRound) { // 9 because we increment after
      console.log('🎉 ROUND COMPLETE!')
      store.completeRound()
    }
    
  }, [store, upgradeCarLevel])
  
  // Enhanced collision handler for wrong answers
  const handleWrongAnswer = useCallback(() => {
    console.log('❌ PROCESSING WRONG ANSWER - REDUCING HEALTH')
    
    // Take damage
    store.takeDamage(1)
    
    // Reset combo and streak
    store.updateCombo(0)
    store.resetStreak()
    
    // Play error sound
    soundEngine.play('crash', 0.6)
    
    // Trigger failure effects
    store.triggerShake(5) // Strong shake for failure
    
  }, [store])
  
  // Lane change with proper position updates
  const changeLaneWithPosition = useCallback((lane: 'left' | 'right') => {
    store.changeLane(lane)
    console.log(`🚗 Lane changed to: ${lane.toUpperCase()}`)
  }, [store])
  
  // Generate new question with proper timing
  const generateNewQuestion = useCallback(() => {
    if (!store.isQuestionActive && refs.questionTimer.current === 0) {
      // This would call the question generation logic
      console.log('📝 Generating new question...')
      return true
    }
    return false
  }, [store.isQuestionActive, refs.questionTimer])
  
  return {
    upgradeCarLevel,
    handleCorrectAnswer,
    handleWrongAnswer,
    changeLaneWithPosition,
    generateNewQuestion,
  }
}
