'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, Lock, CreditCard, X, Copy } from 'lucide-react'
import Car3D from './Car3D'
import { useState } from 'react'

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
  isPremium?: boolean
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
    unlocked: true
  },
  {
    id: 'shadow-phantom',
    name: 'Shadow Phantom',
    color: 'red',
    gradient: 'from-red-500 to-red-700',
    speed: 88,
    handling: 95,
    shield: 85,
    unlocked: true
  },
  {
    id: 'quantum-ultimate',
    name: 'Quantum Ultimate',
    color: 'rainbow',
    gradient: 'from-pink-500 via-purple-500 via-blue-500 via-cyan-500 to-emerald-500',
    speed: 100,
    handling: 100,
    shield: 100,
    unlocked: false,
    price: 50000, // 50,000 VND
    isPremium: true
  }
]

export default function CarSelection({ onSelectCar, onBack, selectedCarId }: CarSelectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPremiumCar, setSelectedPremiumCar] = useState<Car | null>(null)
  const [paymentStep, setPaymentStep] = useState<'info' | 'payment' | 'success'>('info')

  const handlePremiumCarClick = (car: Car) => {
    if (car.isPremium && !car.unlocked) {
      setSelectedPremiumCar(car)
      setShowPaymentModal(true)
      setPaymentStep('info')
    } else if (car.unlocked) {
      onSelectCar(car)
    }
  }

  const handlePayment = () => {
    setPaymentStep('payment')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
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
          
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider">
            VEHICLE SELECTION
          </h1>
          
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              className={`relative backdrop-blur-xl rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                car.isPremium
                  ? 'bg-gradient-to-br from-pink-900/50 via-purple-900/50 via-blue-900/50 to-cyan-900/50 border-pink-400 shadow-2xl shadow-pink-400/50'
                  : 'bg-black/40 border-gray-600 hover:border-cyan-400/50'
              } ${
                selectedCarId === car.id 
                  ? 'border-cyan-400 shadow-2xl shadow-cyan-400/30' 
                  : ''
              } ${!car.unlocked ? 'opacity-75' : ''}`}
              onClick={() => car.isPremium ? handlePremiumCarClick(car) : (car.unlocked && onSelectCar(car))}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * cars.indexOf(car) }}
              whileHover={{ 
                scale: car.unlocked ? 1.02 : 1, 
                y: car.unlocked ? -5 : 0,
                ...(car.isPremium && {
                  boxShadow: '0 0 50px rgba(236, 72, 153, 0.6), 0 0 100px rgba(139, 92, 246, 0.4)'
                })
              }}
            >
              {/* Premium Badge */}
              {car.isPremium && (
                <motion.div
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-4 py-1 rounded-full text-xs font-black tracking-wider z-10"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(236, 72, 153, 0.8)',
                      '0 0 40px rgba(236, 72, 153, 0.8)',
                      '0 0 20px rgba(236, 72, 153, 0.8)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ PREMIUM ✨
                </motion.div>
              )}

              {/* Selection indicator */}
              {selectedCarId === car.id && (
                <div className="absolute top-3 right-3">
                  <Check className="w-6 h-6 text-cyan-400" />
                </div>
              )}

              {/* Premium MoMo Payment indicator */}
              {!car.unlocked && car.isPremium && (
                <motion.div
                  className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 20px rgba(236, 72, 153, 0.6)',
                      '0 0 30px rgba(236, 72, 153, 0.8)',
                      '0 0 20px rgba(236, 72, 153, 0.6)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-lg">💎</span>
                  <div className="text-center">
                    <div>MoMo Pay</div>
                    <div className="text-yellow-300">{car.price?.toLocaleString()} VND</div>
                  </div>
                </motion.div>
              )}

              {/* Regular lock indicator */}
              {!car.unlocked && !car.isPremium && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {car.price} coins
                </div>
              )}

              {/* Car Preview with 3D Model */}
              <div className="flex justify-center mb-6 h-48">
                <Car3D car={car} size="large" animated={car.unlocked || car.isPremium} />
              </div>

              {/* Car Info */}
              <div className="text-center">
                <h3 className="text-2xl font-black text-white mb-4 tracking-wide">{car.name}</h3>
                
                {/* Stats with modern styling */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                    <span className="text-red-400 font-bold">SPEED</span>
                    <div className="w-20">
                      <StatBar value={car.speed} color="from-red-500 to-orange-500" />
                    </div>
                    <span className="text-white font-bold text-xs">{car.speed}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                    <span className="text-blue-400 font-bold">HANDLE</span>
                    <div className="w-20">
                      <StatBar value={car.handling} color="from-blue-500 to-cyan-500" />
                    </div>
                    <span className="text-white font-bold text-xs">{car.handling}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                    <span className="text-green-400 font-bold">SHIELD</span>
                    <div className="w-20">
                      <StatBar value={car.shield} color="from-green-500 to-emerald-500" />
                    </div>
                    <span className="text-white font-bold text-xs">{car.shield}</span>
                  </div>
                </div>

                {car.unlocked && (
                  <motion.button
                    className={`mt-6 w-full py-3 px-4 rounded-xl font-black transition-colors tracking-wide ${
                      selectedCarId === car.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCar(car)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedCarId === car.id ? 'SELECTED' : 'SELECT'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Premium Car Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedPremiumCar && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-pink-900/50 rounded-3xl p-8 max-w-md w-full border border-pink-400/50 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {paymentStep === 'info' && (
                <div className="text-center">
                  <div className="mb-6">
                    <Car3D car={selectedPremiumCar} size="large" animated={true} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text mb-4">
                    {selectedPremiumCar.name}
                  </h3>
                  
                  <div className="bg-black/50 rounded-xl p-4 mb-6">
                    <div className="text-yellow-400 text-3xl font-black mb-2">
                      {selectedPremiumCar.price?.toLocaleString()} VND
                    </div>
                    <div className="text-gray-300 text-sm">
                      Unlock this exclusive premium car with MoMo payment
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-pink-400 text-lg font-bold">{selectedPremiumCar.speed}</div>
                      <div className="text-xs text-gray-400">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 text-lg font-bold">{selectedPremiumCar.handling}</div>
                      <div className="text-xs text-gray-400">Handling</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 text-lg font-bold">{selectedPremiumCar.shield}</div>
                      <div className="text-xs text-gray-400">Shield</div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay with MoMo
                  </button>
                </div>
              )}

              {paymentStep === 'payment' && (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">MoMo Payment</h3>
                  
                  <div className="bg-black/50 rounded-xl p-6 mb-6">
                    <div className="text-yellow-400 text-2xl font-bold mb-4">
                      {selectedPremiumCar.price?.toLocaleString()} VND
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">MoMo Number:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">0123456789</span>
                          <button
                            onClick={() => copyToClipboard('0123456789')}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">Name:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white">Tran Hanh Duc</span>
                          <button
                            onClick={() => copyToClipboard('Tran Hanh Duc')}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">Message:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-mono">QUANTUM-{selectedPremiumCar.id}</span>
                          <button
                            onClick={() => copyToClipboard(`QUANTUM-${selectedPremiumCar.id}`)}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-400 mb-4">
                    After payment, the car will be automatically unlocked in your garage.
                  </div>

                  <button
                    onClick={() => setPaymentStep('success')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-bold transition-colors"
                  >
                    I&apos;ve Made the Payment
                  </button>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-2">Payment Received!</h3>
                    <p className="text-gray-300">Your premium car has been unlocked!</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowPaymentModal(false)
                      // In a real app, you would unlock the car here
                      // For demo purposes, we'll just close the modal
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-bold transition-all"
                  >
                    Start Racing!
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
