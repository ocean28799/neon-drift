# Zustand State Management Migration Guide

## Overview
This guide explains how to migrate the Neon Drift game from React useState to Zustand global state management.

## Benefits of Zustand Migration
1. **Centralized State**: All game state in one place
2. **Better Performance**: Selective subscriptions prevent unnecessary re-renders
3. **Cleaner Code**: No prop drilling, simpler component logic
4. **Better Testing**: Easier to test state logic in isolation
5. **DevTools**: Built-in debugging with Redux DevTools

## File Structure
```
src/
  store/
    gameStore.ts          # Main Zustand store with all state and basic actions
    gameRefs.ts          # React refs that need synchronous access
    gameActions.ts       # Complex business logic actions
  components/
    NeonDriftGameZustand.tsx  # Example migrated component
```

## Migration Steps

### 1. Install Dependencies
```bash
npm install zustand
```

### 2. Create Store Structure

#### gameStore.ts
- Contains all game state (score, health, position, etc.)
- Basic actions for state updates
- Selectors for common state combinations

#### gameRefs.ts
- React refs that need synchronous access
- Protection refs for collision handling
- Timing refs for game loops

#### gameActions.ts
- Complex business logic combining store actions
- Protection logic for car upgrades
- Sound effects integration

### 3. Component Migration Example

#### Before (useState):
```tsx
const [score, setScore] = useState(0)
const [health, setHealth] = useState(3)
const [carLevel, setCarLevel] = useState(1)

const upgradeCarLevel = () => {
  setCarLevel(prev => prev + 1)
}
```

#### After (Zustand):
```tsx
import { usePlayerStats } from '../store/gameStore'
import { useGameActions } from '../store/gameActions'

const { score, health, carLevel } = usePlayerStats()
const { upgradeCarLevel } = useGameActions()
```

## Key Features

### Selective Subscriptions
```tsx
// Only subscribe to player stats
const { score, health, carLevel } = usePlayerStats()

// Only subscribe to game status
const { isPlaying, isPaused } = useGameStatus()
```

### Protected Actions
```tsx
const { upgradeCarLevel } = useGameActions()
// Includes all protection logic:
// - Time-based protection
// - Collision processing checks
// - Question ID tracking
// - Sound effects
```

### DevTools Integration
- Automatic state debugging
- Time-travel debugging
- Action logging

## Benefits in Practice

### 1. No Prop Drilling
```tsx
// Before: Pass props through multiple components
<GameHUD score={score} health={health} level={carLevel} />

// After: Components get state directly
const GameHUD = () => {
  const { score, health, carLevel } = usePlayerStats()
  // ...
}
```

### 2. Better Performance
```tsx
// Only re-renders when player stats change
const PlayerDisplay = () => {
  const { score, health } = usePlayerStats()
  return <div>{score} - {health}</div>
}
```

### 3. Cleaner Business Logic
```tsx
// Complex upgrade logic is isolated
const { upgradeCarLevel } = useGameActions()
// All protection and sound effects included automatically
```

## State Organization

### Core Game State
- `isPlaying`, `isPaused`, `gameStarted`
- `score`, `health`, `carLevel`
- `currentLane`, `playerX`

### Question System
- `currentQuestion`, `answerBoxes`
- `isQuestionActive`, `questionType`
- `selectedChapter`, `selectedRound`

### Visual Effects
- `particles`, `shakeIntensity`
- `gameObjects`, `powerups`

### Protection System
- Refs for synchronous access
- Time-based protection
- Question ID tracking

## Usage in Components

### Basic Usage
```tsx
import { useGameStore } from '../store/gameStore'

const MyComponent = () => {
  const { score, updateScore } = useGameStore()
  return <button onClick={() => updateScore(100)}>+100</button>
}
```

### Selective Subscriptions
```tsx
import { usePlayerStats } from '../store/gameStore'

const ScoreDisplay = () => {
  const { score, health } = usePlayerStats()
  return <div>Score: {score}, Health: {health}</div>
}
```

### Complex Actions
```tsx
import { useGameActions } from '../store/gameActions'

const GameLogic = () => {
  const { handleCorrectAnswer } = useGameActions()
  // Includes all business logic automatically
}
```

## Migration Checklist

- [ ] Install Zustand
- [ ] Create store files (gameStore.ts, gameRefs.ts, gameActions.ts)
- [ ] Migrate component by component
- [ ] Replace useState with store selectors
- [ ] Replace state setters with store actions
- [ ] Move business logic to gameActions.ts
- [ ] Test thoroughly
- [ ] Remove old useState code

## Testing Benefits

### Before
```tsx
// Hard to test - state is internal to component
```

### After
```tsx
// Easy to test - state is external and accessible
import { useGameStore } from '../store/gameStore'

test('score updates correctly', () => {
  const store = useGameStore.getState()
  store.updateScore(100)
  expect(store.score).toBe(100)
})
```

This migration provides a much cleaner, more maintainable, and performant state management solution for the Neon Drift game.
