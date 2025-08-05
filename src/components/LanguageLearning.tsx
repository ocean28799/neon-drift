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

interface LanguageLearningProps {
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
    lane: 'left' | 'right'
    answer: string
    isCorrect: boolean
    color: string
  }>
}

export default function LanguageLearning({ 
  currentQuestion,
  questionType,
  isQuestionActive,
  answerBoxes
}: LanguageLearningProps) {

  if (!isQuestionActive || !currentQuestion) return null

  // Find the left and right answer boxes
  const leftBox = answerBoxes.find(box => box.lane === 'left')
  const rightBox = answerBoxes.find(box => box.lane === 'right')

  return (
    <div className="fixed top-0 left-0 right-0 z-40 p-4">
      {/* Question Display at top of screen */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-lg rounded-2xl p-4 mx-auto max-w-lg border border-purple-500/30"
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-bold">
              {questionType === 'translate' ? 'Vietnamese → English' : 'English → Vietnamese'}
            </span>
          </div>
          
          <div className="text-white text-xl font-bold mb-1">
            {questionType === 'translate' ? currentQuestion.vietnamese : currentQuestion.english}
          </div>
          
          {currentQuestion.pronunciation && questionType === 'translate' && (
            <div className="text-purple-300 text-sm italic">
              [{currentQuestion.pronunciation}]
            </div>
          )}
        </div>
      </motion.div>

      {/* Answer choices positioned below question */}
      <div className="fixed top-32 left-0 right-0 flex justify-between px-8 z-20">
        {/* Left Road Choice */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-gradient-to-b from-blue-500/90 to-indigo-600/90 backdrop-blur-lg rounded-lg p-3 border-2 border-blue-400/50 shadow-lg shadow-blue-500/50"
        >
          <div className="text-center">
            <div className="text-blue-100 text-xs font-bold mb-1">LEFT ROAD</div>
            <div className="text-white text-sm font-bold">
              {leftBox?.answer || (
                <motion.div
                  className="flex items-center justify-center gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1 h-3 bg-blue-300 rounded-full"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-1 h-3 bg-blue-300 rounded-full"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1 h-3 bg-blue-300 rounded-full"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Road Choice */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-gradient-to-b from-orange-500/90 to-red-600/90 backdrop-blur-lg rounded-lg p-3 border-2 border-orange-400/50 shadow-lg shadow-orange-500/50"
        >
          <div className="text-center">
            <div className="text-orange-100 text-xs font-bold mb-1">RIGHT ROAD</div>
            <div className="text-white text-sm font-bold">
              {rightBox?.answer || (
                <motion.div
                  className="flex items-center justify-center gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <motion.div
                    className="w-1 h-3 bg-orange-300 rounded-full"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-1 h-3 bg-orange-300 rounded-full"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-1 h-3 bg-orange-300 rounded-full"
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
  )
}
