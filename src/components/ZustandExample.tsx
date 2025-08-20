import React from 'react'
import { useGameStore, usePlayerStats } from '../store/gameStore'
import { useGameActions } from '../store/gameActions'

// Example of how to integrate Zustand with existing components
export const ZustandIntegrationExample: React.FC = () => {
  // Get state from Zustand store
  const { score, health, carLevel } = usePlayerStats()
  const { isPlaying } = useGameStore()
  const { upgradeCarLevel, handleCorrectAnswer } = useGameActions()
  
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Zustand State Management Demo</h2>
      
      {/* Display current state */}
      <div className="mb-4">
        <div>Game Status: {isPlaying ? 'Playing' : 'Stopped'}</div>
        <div>Score: {score}</div>
        <div>Health: {health}</div>
        <div>Car Level: {carLevel}</div>
      </div>
      
      {/* Actions to test state changes */}
      <div className="space-x-2">
        <button 
          onClick={handleCorrectAnswer}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Correct Answer (Score +100, Level +1)
        </button>
        
        <button 
          onClick={upgradeCarLevel}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
        >
          Upgrade Car Level
        </button>
        
        <button 
          onClick={() => useGameStore.getState().updateScore(50)}
          className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
        >
          Add Score +50
        </button>
      </div>
    </div>
  )
}

// Example of a performance-optimized component
export const OptimizedScoreDisplay: React.FC = () => {
  // Only subscribes to score changes, not other state
  const score = useGameStore(state => state.score)
  
  return (
    <div className="text-2xl font-bold text-yellow-400">
      Score: {score.toLocaleString()}
    </div>
  )
}

// Example of using multiple selectors efficiently
export const GameStatsPanel: React.FC = () => {
  const playerStats = usePlayerStats()
  const gameStatus = useGameStore(state => ({ 
    isPlaying: state.isPlaying, 
    isPaused: state.isPaused 
  }))
  
  return (
    <div className="bg-black/50 p-4 rounded-lg">
      <h3 className="font-bold mb-2">Game Stats</h3>
      <div>Status: {gameStatus.isPlaying ? 'Playing' : 'Stopped'}</div>
      {gameStatus.isPaused && <div className="text-yellow-400">PAUSED</div>}
      <div>Score: {playerStats.score}</div>
      <div>Health: {playerStats.health}/3</div>
      <div>Level: {playerStats.carLevel}</div>
    </div>
  )
}
