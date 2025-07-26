'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Users, Clock, Utensils, Palette, Heart, Car, Smartphone, 
         Shirt, Home, Film, Briefcase, Handshake, Wrench, 
         Calculator, MessageCircle, Palette as Arts, Sun, Dumbbell, Atom, Calendar, 
         GraduationCap, Hash, Lock, CheckCircle2 } from 'lucide-react'

interface Chapter {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  wordCount: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  color: string
}

interface ChapterSelectionProps {
  onSelectChapter: (chapterId: string) => void
  onBack: () => void
  selectedChapter: string
  completedChapters: string[]
}

const chapters: Chapter[] = [
  {
    id: 'chapter01',
    name: 'Basic Everyday',
    description: 'Essential daily words and greetings',
    icon: <BookOpen className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'chapter02',
    name: 'Family & People',
    description: 'Family relationships and people',
    icon: <Users className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'chapter03',
    name: 'Food & Drink',
    description: 'Meals, snacks, and beverages',
    icon: <Utensils className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'chapter04',
    name: 'House & Home',
    description: 'Home environment and household items',
    icon: <Home className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'chapter05',
    name: 'Transportation',
    description: 'Vehicles and travel methods',
    icon: <Car className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'chapter06',
    name: 'Work & Career',
    description: 'Professional environments and careers',
    icon: <Briefcase className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-slate-500 to-gray-600'
  },
  {
    id: 'chapter07',
    name: 'Health & Body',
    description: 'Body parts and health vocabulary',
    icon: <Heart className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'chapter08',
    name: 'Education & Learning',
    description: 'School, learning, and education',
    icon: <GraduationCap className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'chapter09',
    name: 'Technology & Communication',
    description: 'Modern technology and communication',
    icon: <Smartphone className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'chapter10',
    name: 'Shopping & Commerce',
    description: 'Shopping, buying, and commercial activities',
    icon: <Calculator className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'chapter11',
    name: 'Sports & Recreation',
    description: 'Sports activities and recreational fun',
    icon: <Dumbbell className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'chapter12',
    name: 'Weather & Nature',
    description: 'Weather conditions and natural environment',
    icon: <Sun className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'chapter13',
    name: 'Emotions & Feelings',
    description: 'Emotional expressions and feelings',
    icon: <Heart className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'chapter14',
    name: 'Time & Calendar',
    description: 'Time expressions and calendar terms',
    icon: <Clock className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'chapter15',
    name: 'Transportation & Travel',
    description: 'Travel methods and journey vocabulary',
    icon: <Car className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'chapter16',
    name: 'Colors & Descriptions',
    description: 'Colors, shapes, and descriptive words',
    icon: <Palette className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'chapter17',
    name: 'Clothing & Fashion',
    description: 'Clothing items and fashion vocabulary',
    icon: <Shirt className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'chapter18',
    name: 'Hobbies & Entertainment',
    description: 'Recreational activities and entertainment',
    icon: <Film className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'chapter19',
    name: 'Work & Professions',
    description: 'Various career fields and job roles',
    icon: <Briefcase className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Hard',
    color: 'from-gray-500 to-slate-600'
  },
  {
    id: 'chapter20',
    name: 'Relationships & Social',
    description: 'Social relationships and interactions',
    icon: <Handshake className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-pink-500 to-red-600'
  },
  {
    id: 'chapter21',
    name: 'Household Items',
    description: 'Kitchen utensils and daily objects',
    icon: <Wrench className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-orange-500 to-yellow-600'
  },
  {
    id: 'chapter22',
    name: 'Numbers & Mathematics',
    description: 'Numbers, operations, and measurements',
    icon: <Calculator className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'chapter23',
    name: 'Communication & Language',
    description: 'Language skills and conversation terms',
    icon: <MessageCircle className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'chapter24',
    name: 'Arts & Culture',
    description: 'Artistic expressions and cultural activities',
    icon: <Arts className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'chapter25',
    name: 'Emotions & Feelings',
    description: 'Advanced emotional vocabulary',
    icon: <Heart className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-red-500 to-rose-600'
  },
  {
    id: 'chapter26',
    name: 'Weather & Seasons',
    description: 'Weather patterns and seasonal changes',
    icon: <Sun className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'chapter27',
    name: 'Sports & Fitness',
    description: 'Sports activities and fitness vocabulary',
    icon: <Dumbbell className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'chapter28',
    name: 'Science & Nature',
    description: 'Scientific concepts and natural world',
    icon: <Atom className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Hard',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'chapter29',
    name: 'Daily Routines & Time',
    description: 'Daily activities and time management',
    icon: <Calendar className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Easy',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'chapter30',
    name: 'Advanced Essential',
    description: 'Advanced vocabulary for complex communication',
    icon: <GraduationCap className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Hard',
    color: 'from-slate-500 to-gray-600'
  },
  {
    id: 'chapter31',
    name: 'Punctuation & Symbols',
    description: 'Essential punctuation, symbols, and digital characters',
    icon: <Hash className="w-8 h-8" />,
    wordCount: 100,
    difficulty: 'Medium',
    color: 'from-amber-500 to-yellow-600'
  }
]

export default function ChapterSelection({ onSelectChapter, onBack, selectedChapter, completedChapters = [] }: ChapterSelectionProps) {
  
  // Check if a chapter is unlocked
  const isChapterUnlocked = (chapterIndex: number) => {
    if (chapterIndex === 0) return true // First chapter is always unlocked
    const previousChapterId = `chapter${(chapterIndex).toString().padStart(2, '0')}`
    return completedChapters.includes(previousChapterId)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Choose Your Chapter</h1>
            <p className="text-white/80">Select a vocabulary chapter to practice</p>
            <div className="text-sm text-white/60 mt-2">31 Chapters • 3,100 Words Total</div>
          </div>
          
          <div className="w-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {chapters.map((chapter, index) => {
            const isUnlocked = isChapterUnlocked(index)
            const isCompleted = completedChapters.includes(chapter.id)
            
            return (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-6 rounded-xl border backdrop-blur-md transition-all duration-300 ${
                  !isUnlocked
                    ? 'bg-gray-800/50 border-gray-600/30 cursor-not-allowed opacity-60'
                    : isCompleted
                    ? 'bg-gradient-to-br from-green-600/20 to-emerald-600/20 border-green-500/30 cursor-pointer hover:scale-105'
                    : `bg-gradient-to-br ${chapter.color}/20 border-white/20 cursor-pointer hover:scale-105 ${
                        selectedChapter === chapter.id ? 'ring-4 ring-white/50' : ''
                      }`
                }`}
                onClick={() => isUnlocked && onSelectChapter(chapter.id)}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
              >
                <div className="flex flex-col items-center text-center text-white">
                  <div className={`mb-4 p-3 rounded-full ${
                    !isUnlocked
                      ? 'bg-gray-600/30'
                      : isCompleted
                      ? 'bg-green-500/30'
                      : 'bg-white/20'
                  }`}>
                    {!isUnlocked ? (
                      <Lock className="w-8 h-8 text-gray-400" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    ) : (
                      chapter.icon
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{chapter.name}</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    {chapter.description}
                  </p>
                  
                  <div className="flex items-center justify-between w-full mt-auto">
                    <div className={`text-xs px-3 py-1 rounded-full ${
                      isCompleted ? 'bg-green-500/30' : 'bg-white/20'
                    }`}>
                      {chapter.wordCount} words
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full ${
                      chapter.difficulty === 'Easy' ? 'bg-green-500/30' :
                      chapter.difficulty === 'Medium' ? 'bg-yellow-500/30' :
                      'bg-red-500/30'
                    }`}>
                      {chapter.difficulty}
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                  
                  {!isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center"
                    >
                      <Lock className="w-4 h-4 text-gray-300" />
                    </motion.div>
                  )}
                  
                  {selectedChapter === chapter.id && isUnlocked && !isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    >
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-white/80 text-sm">Easy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-white/80 text-sm">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-white/80 text-sm">Hard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
