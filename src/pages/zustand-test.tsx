import React from 'react'
import { ZustandIntegrationExample, OptimizedScoreDisplay, GameStatsPanel } from '../components/ZustandExample'

export default function ZustandTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          🚗 Neon Drift - Zustand State Management Test
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main demo component */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Interactive Demo</h2>
            <ZustandIntegrationExample />
          </div>
          
          {/* Optimized components */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Performance Optimized Components</h2>
              <div className="bg-gray-800 p-4 rounded-lg">
                <OptimizedScoreDisplay />
                <p className="text-sm text-gray-400 mt-2">
                  ↑ This component only re-renders when score changes
                </p>
              </div>
            </div>
            
            <div>
              <GameStatsPanel />
              <p className="text-sm text-gray-400 mt-2">
                ↑ This component uses selective subscriptions
              </p>
            </div>
          </div>
        </div>
        
        {/* Documentation */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎯 Zustand Benefits Demonstrated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2">State Management</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Centralized game state</li>
                <li>✅ No prop drilling needed</li>
                <li>✅ Type-safe actions</li>
                <li>✅ DevTools integration</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Performance</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Selective subscriptions</li>
                <li>✅ Minimal re-renders</li>
                <li>✅ Efficient updates</li>
                <li>✅ Better UX</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Code examples */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📝 Usage Examples</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Basic State Access:</h3>
              <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                <code>{`const { score, health, carLevel } = usePlayerStats()
const { upgradeCarLevel } = useGameActions()`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Optimized Subscription:</h3>
              <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                <code>{`const score = useGameStore(state => state.score)
// Only re-renders when score changes`}</code>
              </pre>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Protected Actions:</h3>
              <pre className="bg-black p-3 rounded text-sm overflow-x-auto">
                <code>{`const { handleCorrectAnswer } = useGameActions()
// Includes: upgrade protection, sound effects, particles`}</code>
              </pre>
            </div>
          </div>
        </div>
        
        {/* Next steps */}
        <div className="mt-8 bg-gradient-to-r from-cyan-800 to-blue-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🚀 Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Test the interactive demo above</li>
            <li>Open browser DevTools → Redux tab to see state changes</li>
            <li>Migrate existing components one by one</li>
            <li>Replace useState with Zustand selectors</li>
            <li>Move business logic to gameActions.ts</li>
            <li>Enjoy cleaner, more maintainable code!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
