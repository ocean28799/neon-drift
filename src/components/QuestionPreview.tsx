'use client'

import { motion } from 'framer-motion'
import { Globe, Clock, Star } from 'lucide-react'

interface LanguageWord {
  id: string
  english: string
  vietnamese: string
  pronunciation: string
  category: string
  difficulty: number
  chapter: string
  examples?: string[]
  synonym?: string
  antonym?: string
}

interface QuestionPreviewProps {
  currentQuestion: LanguageWord | null
  isQuestionActive: boolean
  timeUntilNextQuestion?: number
  questionTimer?: number
  questionInterval?: number
}

export default function QuestionPreview({ 
  currentQuestion, 
  isQuestionActive
}: QuestionPreviewProps) {

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
      <motion.div 
        className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg rounded-xl p-4 border border-purple-500/30 max-w-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 text-sm font-semibold">
            LANGUAGE LEARNING
          </span>
        </div>

        {isQuestionActive && currentQuestion ? (
          /* Active Question Preview */
          <div className="text-center">
            <div className="text-green-400 text-xs font-semibold mb-2">
              ✨ QUESTION ACTIVE ✨
            </div>
            <div className="text-white text-sm font-bold mb-1">
              {currentQuestion.vietnamese}
            </div>
            {currentQuestion.pronunciation && (
              <div className="text-purple-300 text-xs italic mb-2">
                [{currentQuestion.pronunciation}]
              </div>
            )}
            <div className="flex items-center justify-center gap-2 text-xs">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-gray-300">Choose the correct road!</span>
            </div>
            <div className="text-purple-400 text-xs mt-1">
              ✅ Correct = Score + Combo | ❌ Wrong = -1 Health
            </div>
          </div>
        ) : (
          /* Next Question Coming Soon */
          <div className="text-center">
            <div className="text-gray-300 text-xs mb-2">
              Next Question Coming...
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-lg font-bold">
                Answer to continue!
              </span>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center space-x-1 mb-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>

            <div className="text-gray-400 text-xs">
              Choose the correct mystery box!
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center space-x-4 mt-3 pt-3 border-t border-purple-500/20">
          <div className="text-center">
            <div className="text-yellow-400 text-xs font-bold">+100</div>
            <div className="text-gray-400 text-xs">Points</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xs font-bold">+1</div>
            <div className="text-gray-400 text-xs">Level</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-xs font-bold">-1</div>
            <div className="text-gray-400 text-xs">Wrong</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
