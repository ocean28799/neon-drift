import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Crown, Target, Share, TrendingUp } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  level: number
  country?: string
  avatar?: string
  rank: number
}

interface SocialFeaturesProps {
  currentScore: number
  currentLevel: number
  playerName: string
  onShare?: (score: number) => void
}

export default function SocialFeatures({ 
  currentScore, 
  currentLevel, 
  playerName, 
  onShare 
}: SocialFeaturesProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerRank, setPlayerRank] = useState<number>(0)
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'all-time'>('daily')

  // Simulate leaderboard data (replace with real API calls)
  useEffect(() => {
    const generateLeaderboard = () => {
      const mockData: LeaderboardEntry[] = [
        { id: '1', name: 'NeonRacer_Pro', score: 45000, level: 25, country: '🇺🇸', rank: 1 },
        { id: '2', name: 'SpeedDemon_VN', score: 42500, level: 24, country: '🇻🇳', rank: 2 },
        { id: '3', name: 'CyberPilot_99', score: 40000, level: 23, country: '🇯🇵', rank: 3 },
        { id: '4', name: 'NightRider_KR', score: 38500, level: 22, country: '🇰🇷', rank: 4 },
        { id: '5', name: 'VelocityMaster', score: 37000, level: 21, country: '🇬🇧', rank: 5 },
        { id: '6', name: playerName || 'You', score: currentScore, level: currentLevel, country: '🇻🇳', rank: 6 },
        { id: '7', name: 'TurboCharger_DE', score: 35000, level: 20, country: '🇩🇪', rank: 7 },
        { id: '8', name: 'LightSpeed_FR', score: 33500, level: 19, country: '🇫🇷', rank: 8 },
        { id: '9', name: 'QuantumRush_AU', score: 32000, level: 18, country: '🇦🇺', rank: 9 },
        { id: '10', name: 'NeonDrift_BR', score: 30500, level: 17, country: '🇧🇷', rank: 10 }
      ]

      // Sort by score and update ranks
      const sorted = mockData.sort((a, b) => b.score - a.score)
      sorted.forEach((entry, index) => {
        entry.rank = index + 1
      })

      setLeaderboard(sorted)
      
      // Find player rank
      const playerEntry = sorted.find(entry => entry.name === (playerName || 'You'))
      setPlayerRank(playerEntry?.rank || sorted.length + 1)
    }

    generateLeaderboard()
  }, [currentScore, currentLevel, playerName, timeFrame])

  const handleShare = () => {
    const shareText = `🎮 Just scored ${currentScore.toLocaleString()} points in Neon Drift! Can you beat my level ${currentLevel} performance? 🚗💨 #NeonDrift #Racing #LanguageLearning`
    
    if (navigator.share) {
      navigator.share({
        title: 'Neon Drift - High Score!',
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
      onShare?.(currentScore)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />
      case 2: return <Trophy className="w-5 h-5 text-gray-300" />
      case 3: return <Trophy className="w-5 h-5 text-orange-400" />
      default: return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-yellow-600'
      case 2: return 'from-gray-400 to-gray-500'
      case 3: return 'from-orange-500 to-orange-600'
      default: return 'from-gray-600 to-gray-700'
    }
  }

  return (
    <>
      {/* Social Features Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowLeaderboard(true)}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
      >
        <Trophy className="w-4 h-4" />
        LEADERBOARD
        <div className="bg-white/20 rounded-full px-2 py-1 text-xs">
          #{playerRank}
        </div>
      </motion.button>

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={() => setShowLeaderboard(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl p-6 max-w-2xl w-full mx-4 border border-cyan-400/30 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  GLOBAL LEADERBOARD
                </h2>
                <div className="flex justify-center gap-2 mb-4">
                  {(['daily', 'weekly', 'all-time'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeFrame(period)}
                      className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                        timeFrame === period
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {period.toUpperCase().replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Stats Summary */}
              <div className="bg-black/40 rounded-xl p-4 mb-6 border border-cyan-400/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${getRankColor(playerRank)}`}>
                      {getRankIcon(playerRank)}
                    </div>
                    <div>
                      <div className="text-cyan-400 font-bold text-lg">{playerName || 'You'}</div>
                      <div className="text-gray-400 text-sm">Rank #{playerRank} • Level {currentLevel}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{currentScore.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">points</div>
                  </div>
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-2 mb-6">
                {leaderboard.slice(0, 10).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      entry.name === (playerName || 'You')
                        ? 'bg-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                        : 'bg-black/30 border-gray-600/30 hover:bg-black/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${getRankColor(entry.rank)} flex items-center justify-center min-w-[2.5rem]`}>
                        {entry.rank <= 3 ? getRankIcon(entry.rank) : <span className="text-white font-bold text-sm">#{entry.rank}</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{entry.name}</span>
                          {entry.country && <span className="text-lg">{entry.country}</span>}
                        </div>
                        <div className="text-gray-400 text-sm">Level {entry.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{entry.score.toLocaleString()}</div>
                      <div className="text-gray-400 text-xs">points</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Share className="w-4 h-4" />
                  SHARE SCORE
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLeaderboard(false)}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  CLOSE
                </motion.button>
              </div>

              {/* Additional Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="bg-black/30 rounded-lg p-3">
                  <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white font-bold">+{Math.floor(Math.random() * 1000)}</div>
                  <div className="text-gray-400 text-xs">Today</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white font-bold">{leaderboard.length}K</div>
                  <div className="text-gray-400 text-xs">Players</div>
                </div>
                <div className="bg-black/30 rounded-lg p-3">
                  <Trophy className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-bold">Top {Math.ceil((playerRank / leaderboard.length) * 100)}%</div>
                  <div className="text-gray-400 text-xs">Percentile</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
