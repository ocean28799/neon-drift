'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'

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

interface LanguageLearningDesktopProps {
  currentQuestion: LanguageWord | null
  questionType: 'translate' | 'reverse'
  isQuestionActive: boolean
  currentChapter: string
  playerHealth: number
  answerBoxes: Array<{
    id: string
    x: number
    y: number
    width: number
    height: number
    lane: 'top' | 'bottom'
    answer: string
    isCorrect: boolean
    color: string
  }>
}

export default function LanguageLearningDesktop({ 
  currentQuestion,
  questionType,
  isQuestionActive,
  answerBoxes
}: LanguageLearningDesktopProps) {
  if (!isQuestionActive || !currentQuestion) return null

  // Find the top and bottom answer boxes
  const topBox = answerBoxes.find(box => box.lane === 'top')
  const bottomBox = answerBoxes.find(box => box.lane === 'bottom')

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-4">
      {/* Question Display at top of screen - horizontal layout */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        className="bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-lg rounded-2xl p-6 mx-auto max-w-2xl border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          {/* Question section */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-bold">
                Vietnamese → English
              </span>
            </div>
            
            <div className="text-white text-2xl font-bold mb-2">
              {currentQuestion.vietnamese}
            </div>
            
            {currentQuestion.pronunciation && (
              <div className="text-purple-300 text-sm italic">
                [{currentQuestion.pronunciation}]
              </div>
            )}
          </div>

          {/* Answer choices positioned on the right */}
          <div className="flex flex-col gap-4 ml-8">
            {/* Top Lane Choice */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 backdrop-blur-lg rounded-lg p-4 border-2 border-blue-400/50 shadow-lg shadow-blue-500/50 min-w-[200px]"
            >
              <div className="text-center">
                <div className="text-blue-100 text-xs font-bold mb-2">⬆️ TOP LANE</div>
                <div className="text-white text-lg font-bold">
                  {topBox?.answer || (
                    <motion.div
                      className="flex items-center justify-center gap-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        className="w-1 h-4 bg-blue-300 rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-1 h-4 bg-blue-300 rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-1 h-4 bg-blue-300 rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Bottom Lane Choice */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-orange-500/90 to-red-600/90 backdrop-blur-lg rounded-lg p-4 border-2 border-orange-400/50 shadow-lg shadow-orange-500/50 min-w-[200px]"
            >
              <div className="text-center">
                <div className="text-orange-100 text-xs font-bold mb-2">⬇️ BOTTOM LANE</div>
                <div className="text-white text-lg font-bold">
                  {bottomBox?.answer || (
                    <motion.div
                      className="flex items-center justify-center gap-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <motion.div
                        className="w-1 h-4 bg-orange-300 rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-1 h-4 bg-orange-300 rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-1 h-4 bg-orange-300 rounded-full"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
