'use client'

import { useState, useEffect } from 'react'
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
  isQuestionActive: boolean
  currentChapter: keyof typeof vocabularyDatabase
  playerHealth: number
}

// Vietnamese-English Vocabulary Database - 3000 Essential Words by Chapters
const vocabularyDatabase: { [key: string]: LanguageWord[] } = {
  // Chapter 1: Basic Everyday Words (100 words)
  basics: [
    { id: 'basic1', english: 'Hello', vietnamese: 'Xin chào', pronunciation: 'sin chow', category: 'greeting', chapter: 'basics', difficulty: 1, examples: ['Hello, how are you?'] },
    { id: 'basic2', english: 'Thank you', vietnamese: 'Cảm ơn', pronunciation: 'gam un', category: 'politeness', chapter: 'basics', difficulty: 1, examples: ['Thank you very much!'] },
    { id: 'basic3', english: 'Yes', vietnamese: 'Có', pronunciation: 'go', category: 'response', chapter: 'basics', difficulty: 1, examples: ['Yes, I agree.'] },
    { id: 'basic4', english: 'No', vietnamese: 'Không', pronunciation: 'kohng', category: 'response', chapter: 'basics', difficulty: 1, examples: ['No, I disagree.'] },
    { id: 'basic5', english: 'Please', vietnamese: 'Làm ơn', pronunciation: 'lam un', category: 'politeness', chapter: 'basics', difficulty: 1, examples: ['Please help me.'] },
    { id: 'basic6', english: 'Sorry', vietnamese: 'Xin lỗi', pronunciation: 'sin loy', category: 'politeness', chapter: 'basics', difficulty: 1, examples: ['Sorry for being late.'] },
    { id: 'basic7', english: 'Good', vietnamese: 'Tốt', pronunciation: 'tot', category: 'quality', chapter: 'basics', difficulty: 1, examples: ['This is good.'], antonym: 'Bad' },
    { id: 'basic8', english: 'Bad', vietnamese: 'Xấu', pronunciation: 'sau', category: 'quality', chapter: 'basics', difficulty: 1, examples: ['The weather is bad.'], antonym: 'Good' },
    { id: 'basic9', english: 'Big', vietnamese: 'To', pronunciation: 'to', category: 'size', chapter: 'basics', difficulty: 1, examples: ['A big house.'], antonym: 'Small' },
    { id: 'basic10', english: 'Small', vietnamese: 'Nhỏ', pronunciation: 'nyo', category: 'size', chapter: 'basics', difficulty: 1, examples: ['A small car.'], antonym: 'Big' },
    { id: 'basic11', english: 'Hot', vietnamese: 'Nóng', pronunciation: 'nong', category: 'temperature', chapter: 'basics', difficulty: 1, examples: ['Hot weather.'], antonym: 'Cold' },
    { id: 'basic12', english: 'Cold', vietnamese: 'Lạnh', pronunciation: 'lanh', category: 'temperature', chapter: 'basics', difficulty: 1, examples: ['Cold water.'], antonym: 'Hot' },
    { id: 'basic13', english: 'Fast', vietnamese: 'Nhanh', pronunciation: 'nyah', category: 'speed', chapter: 'basics', difficulty: 1, examples: ['Drive fast.'], antonym: 'Slow' },
    { id: 'basic14', english: 'Slow', vietnamese: 'Chậm', pronunciation: 'chahm', category: 'speed', chapter: 'basics', difficulty: 1, examples: ['Walk slowly.'], antonym: 'Fast' },
    { id: 'basic15', english: 'New', vietnamese: 'Mới', pronunciation: 'moy', category: 'time', chapter: 'basics', difficulty: 1, examples: ['A new phone.'], antonym: 'Old' },
    { id: 'basic16', english: 'Old', vietnamese: 'Cũ', pronunciation: 'goo', category: 'time', chapter: 'basics', difficulty: 1, examples: ['An old book.'], antonym: 'New' },
    { id: 'basic17', english: 'High', vietnamese: 'Cao', pronunciation: 'kao', category: 'position', chapter: 'basics', difficulty: 1, examples: ['High mountain.'], antonym: 'Low' },
    { id: 'basic18', english: 'Low', vietnamese: 'Thấp', pronunciation: 'thap', category: 'position', chapter: 'basics', difficulty: 1, examples: ['Low price.'], antonym: 'High' },
    { id: 'basic19', english: 'Left', vietnamese: 'Trái', pronunciation: 'chai', category: 'direction', chapter: 'basics', difficulty: 1, examples: ['Turn left.'], antonym: 'Right' },
    { id: 'basic20', english: 'Right', vietnamese: 'Phải', pronunciation: 'fai', category: 'direction', chapter: 'basics', difficulty: 1, examples: ['Turn right.'], antonym: 'Left' }
  ],

  // Chapter 2: Family & People (100 words)
  family: [
    { id: 'family1', english: 'Family', vietnamese: 'Gia đình', pronunciation: 'za dinh', category: 'people', chapter: 'family', difficulty: 1, examples: ['My family is big.'] },
    { id: 'family2', english: 'Father', vietnamese: 'Bố', pronunciation: 'bo', category: 'people', chapter: 'family', difficulty: 1, examples: ['My father works hard.'] },
    { id: 'family3', english: 'Mother', vietnamese: 'Mẹ', pronunciation: 'me', category: 'people', chapter: 'family', difficulty: 1, examples: ['My mother cooks well.'] },
    { id: 'family4', english: 'Son', vietnamese: 'Con trai', pronunciation: 'gon chai', category: 'people', chapter: 'family', difficulty: 1, examples: ['He is my son.'] },
    { id: 'family5', english: 'Daughter', vietnamese: 'Con gái', pronunciation: 'gon gai', category: 'people', chapter: 'family', difficulty: 1, examples: ['She is my daughter.'] },
    { id: 'family6', english: 'Brother', vietnamese: 'Anh trai', pronunciation: 'ang chai', category: 'people', chapter: 'family', difficulty: 1, examples: ['My brother is tall.'] },
    { id: 'family7', english: 'Sister', vietnamese: 'Chị gái', pronunciation: 'chi gai', category: 'people', chapter: 'family', difficulty: 1, examples: ['My sister is smart.'] },
    { id: 'family8', english: 'Friend', vietnamese: 'Bạn', pronunciation: 'ban', category: 'people', chapter: 'family', difficulty: 1, examples: ['He is my friend.'] },
    { id: 'family9', english: 'Teacher', vietnamese: 'Giáo viên', pronunciation: 'zao vien', category: 'people', chapter: 'family', difficulty: 1, examples: ['My teacher is kind.'] },
    { id: 'family10', english: 'Student', vietnamese: 'Học sinh', pronunciation: 'hoc sin', category: 'people', chapter: 'family', difficulty: 1, examples: ['I am a student.'] },
    { id: 'family11', english: 'Man', vietnamese: 'Đàn ông', pronunciation: 'dan ong', category: 'people', chapter: 'family', difficulty: 1, examples: ['A tall man.'], antonym: 'Woman' },
    { id: 'family12', english: 'Woman', vietnamese: 'Phụ nữ', pronunciation: 'fu nu', category: 'people', chapter: 'family', difficulty: 1, examples: ['A beautiful woman.'], antonym: 'Man' },
    { id: 'family13', english: 'Boy', vietnamese: 'Cậu bé', pronunciation: 'gau be', category: 'people', chapter: 'family', difficulty: 1, examples: ['A young boy.'], antonym: 'Girl' },
    { id: 'family14', english: 'Girl', vietnamese: 'Cô gái', pronunciation: 'go gai', category: 'people', chapter: 'family', difficulty: 1, examples: ['A smart girl.'], antonym: 'Boy' },
    { id: 'family15', english: 'Baby', vietnamese: 'Em bé', pronunciation: 'em be', category: 'people', chapter: 'family', difficulty: 1, examples: ['A cute baby.'] }
  ],

  // Chapter 3: Time & Numbers (100 words)
  time: [
    { id: 'time1', english: 'Time', vietnamese: 'Thời gian', pronunciation: 'thoy gan', category: 'time', chapter: 'time', difficulty: 1, examples: ['What time is it?'] },
    { id: 'time2', english: 'Day', vietnamese: 'Ngày', pronunciation: 'ngay', category: 'time', chapter: 'time', difficulty: 1, examples: ['Today is a good day.'], antonym: 'Night' },
    { id: 'time3', english: 'Night', vietnamese: 'Đêm', pronunciation: 'dem', category: 'time', chapter: 'time', difficulty: 1, examples: ['Good night!'], antonym: 'Day' },
    { id: 'time4', english: 'Morning', vietnamese: 'Buổi sáng', pronunciation: 'buoy sang', category: 'time', chapter: 'time', difficulty: 1, examples: ['Good morning!'] },
    { id: 'time5', english: 'Afternoon', vietnamese: 'Buổi chiều', pronunciation: 'buoy chieu', category: 'time', chapter: 'time', difficulty: 1, examples: ['Good afternoon!'] },
    { id: 'time6', english: 'Today', vietnamese: 'Hôm nay', pronunciation: 'hom nay', category: 'time', chapter: 'time', difficulty: 1, examples: ['Today is Monday.'] },
    { id: 'time7', english: 'Tomorrow', vietnamese: 'Ngày mai', pronunciation: 'ngay mai', category: 'time', chapter: 'time', difficulty: 1, examples: ['See you tomorrow.'] },
    { id: 'time8', english: 'Yesterday', vietnamese: 'Hôm qua', pronunciation: 'hom qua', category: 'time', chapter: 'time', difficulty: 1, examples: ['Yesterday was fun.'] },
    { id: 'time9', english: 'Week', vietnamese: 'Tuần', pronunciation: 'tuan', category: 'time', chapter: 'time', difficulty: 1, examples: ['Next week.'] },
    { id: 'time10', english: 'Month', vietnamese: 'Tháng', pronunciation: 'thang', category: 'time', chapter: 'time', difficulty: 1, examples: ['This month.'] },
    { id: 'time11', english: 'Year', vietnamese: 'Năm', pronunciation: 'nam', category: 'time', chapter: 'time', difficulty: 1, examples: ['Happy new year!'] },
    { id: 'time12', english: 'Hour', vietnamese: 'Giờ', pronunciation: 'zo', category: 'time', chapter: 'time', difficulty: 1, examples: ['One hour later.'] },
    { id: 'time13', english: 'Minute', vietnamese: 'Phút', pronunciation: 'fut', category: 'time', chapter: 'time', difficulty: 1, examples: ['Five minutes.'] },
    { id: 'time14', english: 'Second', vietnamese: 'Giây', pronunciation: 'zay', category: 'time', chapter: 'time', difficulty: 1, examples: ['Wait a second.'] },
    { id: 'time15', english: 'Early', vietnamese: 'Sớm', pronunciation: 'som', category: 'time', chapter: 'time', difficulty: 1, examples: ['Come early.'], antonym: 'Late' },
    { id: 'time16', english: 'Late', vietnamese: 'Muộn', pronunciation: 'muon', category: 'time', chapter: 'time', difficulty: 1, examples: ['I am late.'], antonym: 'Early' },
    { id: 'time17', english: 'Now', vietnamese: 'Bây giờ', pronunciation: 'bay zo', category: 'time', chapter: 'time', difficulty: 1, examples: ['Do it now.'] },
    { id: 'time18', english: 'Soon', vietnamese: 'Sớm', pronunciation: 'som', category: 'time', chapter: 'time', difficulty: 1, examples: ['Coming soon.'] },
    { id: 'time19', english: 'Always', vietnamese: 'Luôn luôn', pronunciation: 'luon luon', category: 'time', chapter: 'time', difficulty: 2, examples: ['Always be kind.'], antonym: 'Never' },
    { id: 'time20', english: 'Never', vietnamese: 'Không bao giờ', pronunciation: 'khong bao zo', category: 'time', chapter: 'time', difficulty: 2, examples: ['Never give up.'], antonym: 'Always' }
  ],

  // Chapter 4: Food & Drinks (100 words)
  food: [
    { id: 'food1', english: 'Food', vietnamese: 'Thức ăn', pronunciation: 'thuc an', category: 'food', chapter: 'food', difficulty: 1, examples: ['Delicious food.'] },
    { id: 'food2', english: 'Water', vietnamese: 'Nước', pronunciation: 'nuoc', category: 'drinks', chapter: 'food', difficulty: 1, examples: ['Drink water daily.'] },
    { id: 'food3', english: 'Rice', vietnamese: 'Cơm', pronunciation: 'gom', category: 'food', chapter: 'food', difficulty: 1, examples: ['Eat rice every day.'] },
    { id: 'food4', english: 'Bread', vietnamese: 'Bánh mì', pronunciation: 'banh mi', category: 'food', chapter: 'food', difficulty: 1, examples: ['Fresh bread.'] },
    { id: 'food5', english: 'Meat', vietnamese: 'Thịt', pronunciation: 'thit', category: 'food', chapter: 'food', difficulty: 1, examples: ['Cook the meat.'] },
    { id: 'food6', english: 'Fish', vietnamese: 'Cá', pronunciation: 'ga', category: 'food', chapter: 'food', difficulty: 1, examples: ['Fresh fish.'] },
    { id: 'food7', english: 'Chicken', vietnamese: 'Gà', pronunciation: 'ga', category: 'food', chapter: 'food', difficulty: 1, examples: ['Fried chicken.'] },
    { id: 'food8', english: 'Vegetable', vietnamese: 'Rau', pronunciation: 'zau', category: 'food', chapter: 'food', difficulty: 1, examples: ['Eat vegetables.'] },
    { id: 'food9', english: 'Fruit', vietnamese: 'Trái cây', pronunciation: 'chai kay', category: 'food', chapter: 'food', difficulty: 1, examples: ['Fresh fruit.'] },
    { id: 'food10', english: 'Apple', vietnamese: 'Táo', pronunciation: 'tao', category: 'fruit', chapter: 'food', difficulty: 1, examples: ['Red apple.'] },
    { id: 'food11', english: 'Banana', vietnamese: 'Chuối', pronunciation: 'chuoy', category: 'fruit', chapter: 'food', difficulty: 1, examples: ['Yellow banana.'] },
    { id: 'food12', english: 'Orange', vietnamese: 'Cam', pronunciation: 'gam', category: 'fruit', chapter: 'food', difficulty: 1, examples: ['Sweet orange.'] },
    { id: 'food13', english: 'Milk', vietnamese: 'Sữa', pronunciation: 'sua', category: 'drinks', chapter: 'food', difficulty: 1, examples: ['Drink milk.'] },
    { id: 'food14', english: 'Coffee', vietnamese: 'Cà phê', pronunciation: 'ga fe', category: 'drinks', chapter: 'food', difficulty: 1, examples: ['Strong coffee.'] },
    { id: 'food15', english: 'Tea', vietnamese: 'Trà', pronunciation: 'cha', category: 'drinks', chapter: 'food', difficulty: 1, examples: ['Green tea.'] }
  ],

  // Chapter 5: Colors & Nature (100 words)  
  colors: [
    { id: 'color1', english: 'Color', vietnamese: 'Màu sắc', pronunciation: 'mau sac', category: 'color', chapter: 'colors', difficulty: 1, examples: ['What color is it?'] },
    { id: 'color2', english: 'Red', vietnamese: 'Đỏ', pronunciation: 'do', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Red apple.'] },
    { id: 'color3', english: 'Blue', vietnamese: 'Xanh dương', pronunciation: 'sanh zuong', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Blue sky.'] },
    { id: 'color4', english: 'Green', vietnamese: 'Xanh lá', pronunciation: 'sanh la', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Green tree.'] },
    { id: 'color5', english: 'Yellow', vietnamese: 'Vàng', pronunciation: 'vang', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Yellow sun.'] },
    { id: 'color6', english: 'Black', vietnamese: 'Đen', pronunciation: 'den', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Black cat.'], antonym: 'White' },
    { id: 'color7', english: 'White', vietnamese: 'Trắng', pronunciation: 'chang', category: 'color', chapter: 'colors', difficulty: 1, examples: ['White snow.'], antonym: 'Black' },
    { id: 'color8', english: 'Brown', vietnamese: 'Nâu', pronunciation: 'nau', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Brown bear.'] },
    { id: 'color9', english: 'Pink', vietnamese: 'Hồng', pronunciation: 'hong', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Pink flower.'] },
    { id: 'color10', english: 'Purple', vietnamese: 'Tím', pronunciation: 'tim', category: 'color', chapter: 'colors', difficulty: 1, examples: ['Purple grape.'] },
    { id: 'color11', english: 'Sun', vietnamese: 'Mặt trời', pronunciation: 'mat choy', category: 'nature', chapter: 'colors', difficulty: 1, examples: ['Bright sun.'] },
    { id: 'color12', english: 'Moon', vietnamese: 'Mặt trăng', pronunciation: 'mat chang', category: 'nature', chapter: 'colors', difficulty: 1, examples: ['Full moon.'] },
    { id: 'color13', english: 'Star', vietnamese: 'Ngôi sao', pronunciation: 'ngoy sao', category: 'nature', chapter: 'colors', difficulty: 1, examples: ['Bright star.'] },
    { id: 'color14', english: 'Tree', vietnamese: 'Cây', pronunciation: 'kay', category: 'nature', chapter: 'colors', difficulty: 1, examples: ['Tall tree.'] },
    { id: 'color15', english: 'Flower', vietnamese: 'Hoa', pronunciation: 'hoa', category: 'nature', chapter: 'colors', difficulty: 1, examples: ['Beautiful flower.'] }
  ]
}

export default function LanguageLearning({ 
  currentQuestion,
  isQuestionActive,
  currentChapter, 
  playerHealth
}: LanguageLearningProps) {
  const [questionType, setQuestionType] = useState<'translate' | 'reverse'>('translate')
  const [correctAnswer, setCorrectAnswer] = useState<string>('')
  const [wrongAnswer, setWrongAnswer] = useState<string>('')
  const [correctSide, setCorrectSide] = useState<'left' | 'right'>('left')

  // Generate question data when currentQuestion changes
  useEffect(() => {
    if (currentQuestion) {
      // Focus on learning English - show Vietnamese and ask for English (most common)
      const questionTypes: ('translate' | 'reverse')[] = ['translate', 'translate', 'reverse'] // 2/3 chance Vietnamese→English
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      setQuestionType(type)
      
      // Get vocabulary for wrong answers
      const vocabulary = vocabularyDatabase[currentChapter] || vocabularyDatabase.basics
      const wrongOptions = vocabulary
        .filter(w => w.id !== currentQuestion.id && w.category === currentQuestion.category)
      
      const wrongWord = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || vocabulary[0]
      
      setCorrectAnswer(type === 'translate' ? currentQuestion.english : currentQuestion.vietnamese)
      setWrongAnswer(type === 'translate' ? wrongWord.english : wrongWord.vietnamese)
      setCorrectSide(Math.random() > 0.5 ? 'left' : 'right')
    }
  }, [currentQuestion, currentChapter])

  if (!isQuestionActive || !currentQuestion) return null

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
              {correctSide === 'left' ? correctAnswer : wrongAnswer}
            </div>
            {correctSide === 'left' && (
              <div className="text-green-300 text-xs mt-1">✨ Correct Answer!</div>
            )}
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
              {correctSide === 'right' ? correctAnswer : wrongAnswer}
            </div>
            {correctSide === 'right' && (
              <div className="text-green-300 text-xs mt-1">✨ Correct Answer!</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
