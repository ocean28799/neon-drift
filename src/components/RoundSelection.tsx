'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Play, CheckCircle2, Lock, Star } from 'lucide-react'
import { useState } from 'react'

interface Round {
  id: string
  name: string
  description: string
  wordCount: number
  isCompleted: boolean
  isUnlocked: boolean
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
}

interface RoundSelectionProps {
  chapterName: string
  chapterId: string
  onSelectRound: (roundId: string) => void
  onBack: () => void
  selectedRound: string
  completedRounds: string[]
}

// Generate rounds for each chapter (5 rounds of 20 words each)
const generateRounds = (chapterId: string): Round[] => {
  const baseRounds = [
    { category: 'basic', name: 'Basic Foundation', description: 'Essential everyday words' },
    { category: 'intermediate', name: 'Building Skills', description: 'Expanding vocabulary' },
    { category: 'practical', name: 'Practical Usage', description: 'Real-world applications' },
    { category: 'advanced', name: 'Advanced Concepts', description: 'Complex expressions' },
    { category: 'mastery', name: 'Complete Mastery', description: 'Full chapter proficiency' }
  ]

  return baseRounds.map((round, index) => ({
    id: `${chapterId}_round${index + 1}`,
    name: `Round ${index + 1}: ${round.name}`,
    description: round.description,
    wordCount: 20,
    isCompleted: false,
    isUnlocked: index === 0, // Only first round is unlocked initially
    category: round.category,
    difficulty: index < 2 ? 'Easy' : index < 4 ? 'Medium' : 'Hard'
  }))
}

export default function RoundSelection({ 
  chapterName, 
  chapterId, 
  onSelectRound, 
  onBack, 
  selectedRound,
  completedRounds = []
}: RoundSelectionProps) {
  const [rounds] = useState<Round[]>(() => {
    const generatedRounds = generateRounds(chapterId)
    
    // Update completion and unlock status based on completed rounds
    return generatedRounds.map((round, index) => ({
      ...round,
      isCompleted: completedRounds.includes(round.id),
      isUnlocked: index === 0 || completedRounds.some(completedId => {
        const completedIndex = generatedRounds.findIndex(r => r.id === completedId)
        return completedIndex === index - 1
      })
    }))
  })

  const completedCount = rounds.filter(round => round.isCompleted).length
  const totalRounds = rounds.length
  const progressPercentage = (completedCount / totalRounds) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'from-green-500 to-emerald-600'
      case 'Medium': return 'from-yellow-500 to-orange-600'
      case 'Hard': return 'from-red-500 to-pink-600'
      default: return 'from-gray-500 to-slate-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Chapters
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{chapterName}</h1>
            <p className="text-white/80">Choose a round to practice</p>
            <div className="text-sm text-white/60 mt-2">
              {completedCount} of {totalRounds} rounds completed
            </div>
          </div>
          
          <div className="w-20" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Chapter Progress</span>
            <span className="text-white/80 text-sm">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-md border border-white/20">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-end pr-2"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {progressPercentage > 10 && <Star className="w-3 h-3 text-white" />}
            </motion.div>
          </div>
        </div>

        {/* Rounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rounds.map((round, index) => (
            <motion.div
              key={round.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                !round.isUnlocked
                  ? 'bg-gray-800/50 border-gray-600/30 cursor-not-allowed opacity-60'
                  : round.isCompleted
                  ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30 cursor-pointer hover:scale-105'
                  : `bg-gradient-to-br ${getDifficultyColor(round.difficulty)}/20 border-white/20 cursor-pointer hover:scale-105 ${
                      selectedRound === round.id ? 'ring-4 ring-white/50' : ''
                    }`
              }`}
              onClick={() => round.isUnlocked && onSelectRound(round.id)}
              whileHover={round.isUnlocked ? { scale: 1.05 } : {}}
              whileTap={round.isUnlocked ? { scale: 0.95 } : {}}
            >
              <div className="flex flex-col items-center text-center text-white">
                {/* Round Icon */}
                <div className={`mb-4 p-3 rounded-full ${
                  !round.isUnlocked
                    ? 'bg-gray-600/30'
                    : round.isCompleted
                    ? 'bg-green-500/30'
                    : 'bg-white/20'
                }`}>
                  {!round.isUnlocked ? (
                    <Lock className="w-8 h-8 text-gray-400" />
                  ) : round.isCompleted ? (
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </div>
                
                <h3 className="text-lg font-bold mb-2">{round.name}</h3>
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  {round.description}
                </p>
                
                <div className="flex items-center justify-between w-full mt-auto">
                  <div className={`text-xs px-3 py-1 rounded-full ${
                    round.isCompleted ? 'bg-green-500/30' : 'bg-white/20'
                  }`}>
                    {round.wordCount} words
                  </div>
                  <div className={`text-xs px-3 py-1 rounded-full ${
                    round.difficulty === 'Easy' ? 'bg-green-500/30' :
                    round.difficulty === 'Medium' ? 'bg-yellow-500/30' :
                    'bg-red-500/30'
                  }`}>
                    {round.difficulty}
                  </div>
                </div>
                
                {/* Status Indicator */}
                {round.isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </motion.div>
                )}
                
                {!round.isUnlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
                  >
                    <Lock className="w-4 h-4 text-gray-300" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chapter Completion Status */}
        {completedCount === totalRounds && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl backdrop-blur-md text-center"
          >
            <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Chapter Completed!</h3>
            <p className="text-white/80">Congratulations! You&apos;ve mastered all rounds in this chapter.</p>
            <p className="text-white/60 text-sm mt-2">The next chapter is now unlocked!</p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-white" />
              <span className="text-white/80 text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-white/80 text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-white/80 text-sm">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
