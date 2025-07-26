'use client'

import { motion } from 'framer-motion'
import { Check, ArrowLeft } from 'lucide-react'

interface Car {
  id: string
  name: string
  color: string
  gradient: string
  speed: number
  handling: number
  shield: number
  unlocked: boolean
  price?: number
}

interface CarSelectionProps {
  onSelectCar: (car: Car) => void
  onBack: () => void
  selectedCarId?: string
}

const cars: Car[] = [
  {
    id: 'cyber-racer',
    name: 'Cyber Racer',
    color: 'cyan',
    gradient: 'from-cyan-400 to-cyan-600',
    speed: 80,
    handling: 75,
    shield: 70,
    unlocked: true
  },
  {
    id: 'neon-blazer',
    name: 'Neon Blazer',
    color: 'purple',
    gradient: 'from-purple-400 to-purple-600',
    speed: 75,
    handling: 85,
    shield: 65,
    unlocked: true
  },
  {
    id: 'plasma-storm',
    name: 'Plasma Storm',
    color: 'yellow',
    gradient: 'from-yellow-400 to-orange-500',
    speed: 90,
    handling: 60,
    shield: 80,
    unlocked: true
  },
  {
    id: 'void-runner',
    name: 'Void Runner',
    color: 'black',
    gradient: 'from-gray-700 to-black',
    speed: 85,
    handling: 90,
    shield: 75,
    unlocked: true
  },
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    color: 'blue',
    gradient: 'from-blue-400 to-blue-600',
    speed: 95,
    handling: 70,
    shield: 60,
    unlocked: false,
    price: 1000
  },
  {
    id: 'shadow-phantom',
    name: 'Shadow Phantom',
    color: 'red',
    gradient: 'from-red-500 to-red-700',
    speed: 88,
    handling: 95,
    shield: 85,
    unlocked: false,
    price: 2500
  }
]

export default function CarSelection({ onSelectCar, onBack, selectedCarId }: CarSelectionProps) {
  const StatBar = ({ value, color }: { value: number; color: string }) => (
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div 
        className={`h-2 rounded-full bg-gradient-to-r ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-y-auto">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, cyan 1px, transparent 1px),
              linear-gradient(to bottom, cyan 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back</span>
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SELECT YOUR RIDE
          </h1>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              className={`relative bg-black/30 backdrop-blur-lg rounded-xl p-6 border-2 transition-all cursor-pointer ${
                selectedCarId === car.id 
                  ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' 
                  : 'border-gray-600 hover:border-cyan-400/50'
              } ${!car.unlocked ? 'opacity-75' : ''}`}
              onClick={() => car.unlocked && onSelectCar(car)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: car.unlocked ? 1.05 : 1 }}
            >
              {/* Selection indicator */}
              {selectedCarId === car.id && (
                <div className="absolute top-3 right-3">
                  <Check className="w-6 h-6 text-cyan-400" />
                </div>
              )}

              {/* Lock indicator */}
              {!car.unlocked && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  🔒 {car.price} coins
                </div>
              )}

              {/* Car Preview */}
              <div className="flex justify-center mb-4">
                <motion.div
                  className={`w-20 h-32 bg-gradient-to-b ${car.gradient} rounded-lg shadow-lg relative`}
                  animate={{
                    boxShadow: [
                      `0 0 20px ${car.color === 'cyan' ? '#06b6d4' : car.color === 'purple' ? '#8b5cf6' : car.color === 'yellow' ? '#f59e0b' : car.color === 'blue' ? '#3b82f6' : car.color === 'red' ? '#ef4444' : '#374151'}`,
                      `0 0 30px ${car.color === 'cyan' ? '#06b6d4' : car.color === 'purple' ? '#8b5cf6' : car.color === 'yellow' ? '#f59e0b' : car.color === 'blue' ? '#3b82f6' : car.color === 'red' ? '#ef4444' : '#374151'}`,
                      `0 0 20px ${car.color === 'cyan' ? '#06b6d4' : car.color === 'purple' ? '#8b5cf6' : car.color === 'yellow' ? '#f59e0b' : car.color === 'blue' ? '#3b82f6' : car.color === 'red' ? '#ef4444' : '#374151'}`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {/* Car details */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-white rounded-full opacity-80" />
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-400 rounded-full" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-red-400 rounded-full" />
                  
                  {/* Racing stripes */}
                  <div className="absolute inset-0 flex justify-center">
                    <div className="w-1 h-full bg-white/20 rounded" />
                  </div>
                </motion.div>
              </div>

              {/* Car Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{car.name}</h3>
                
                {/* Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Speed</span>
                    <div className="w-20">
                      <StatBar value={car.speed} color="from-red-500 to-orange-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Handling</span>
                    <div className="w-20">
                      <StatBar value={car.handling} color="from-blue-500 to-cyan-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Shield</span>
                    <div className="w-20">
                      <StatBar value={car.shield} color="from-green-500 to-emerald-500" />
                    </div>
                  </div>
                </div>

                {car.unlocked && (
                  <motion.button
                    className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      selectedCarId === car.id
                        ? 'bg-cyan-500 text-black'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCar(car)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedCarId === car.id ? 'Selected' : 'Select'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
