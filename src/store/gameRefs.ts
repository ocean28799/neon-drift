import { useRef } from 'react'

// Custom hook for managing game refs that need synchronous access
export const useGameRefs = () => {
  // Protection refs for collision handling
  const collisionProcessing = useRef(false)
  const upgradeInProgress = useRef(false)
  const lastQuestionId = useRef<string | null>(null)
  const lastUpgradeTime = useRef(0)
  
  // Timing refs
  const questionTimer = useRef(0)
  const lastObjectSpawn = useRef(0)
  const currentMusicTrack = useRef('gameMusic')
  const gameAreaRef = useRef<HTMLDivElement>(null)
  
  return {
    // Protection refs
    collisionProcessing,
    upgradeInProgress,
    lastQuestionId,
    lastUpgradeTime,
    
    // Timing refs
    questionTimer,
    lastObjectSpawn,
    currentMusicTrack,
    gameAreaRef,
  }
}

// Export individual ref hooks for specific use cases
export const useCollisionRefs = () => {
  const collisionProcessing = useRef(false)
  const upgradeInProgress = useRef(false)
  const lastQuestionId = useRef<string | null>(null)
  const lastUpgradeTime = useRef(0)
  
  return {
    collisionProcessing,
    upgradeInProgress,
    lastQuestionId,
    lastUpgradeTime,
  }
}

export const useTimingRefs = () => {
  const questionTimer = useRef(0)
  const lastObjectSpawn = useRef(0)
  
  return {
    questionTimer,
    lastObjectSpawn,
  }
}
