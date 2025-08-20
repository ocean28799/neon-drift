'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowLeft, Lock, CreditCard, X, Copy, QrCode, Phone } from 'lucide-react'
import Car3D from './Car3D'
import { useState } from 'react'
import Image from 'next/image'

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
    price: 20000,
    isPremium: true
  }
]

export default function CarSelection({ onSelectCar, onBack, selectedCarId }: CarSelectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPremiumCar, setSelectedPremiumCar] = useState<Car | null>(null)
  const [paymentStep, setPaymentStep] = useState<'info' | 'qr' | 'success'>('info')

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
    setPaymentStep('qr')
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
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden">
      {/* Mobile-optimized animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-10 md:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, cyan 1px, transparent 1px),
              linear-gradient(to bottom, cyan 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* Mobile-first header */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Back</span>
          </button>
          
          <h1 className="text-lg sm:text-2xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wider text-center">
            VEHICLES
          </h1>
          
          <div className="w-12 sm:w-20" /> {/* Spacer */}
        </div>

        {/* Mobile-optimized car grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto pb-20">
          {cars.map((car) => (
            <motion.div
              key={car.id}
              className={`relative backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 transition-all cursor-pointer ${
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
              transition={{ duration: 0.3, delay: 0.05 * cars.indexOf(car) }}
              whileHover={{ 
                scale: car.unlocked ? 1.02 : 1, 
                y: car.unlocked ? -5 : 0,
                ...(car.isPremium && {
                  boxShadow: '0 0 30px rgba(236, 72, 153, 0.6), 0 0 60px rgba(139, 92, 246, 0.4)'
                })
              }}
            >
              {/* Premium Badge - Mobile optimized */}
              {car.isPremium && (
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-black tracking-wider z-10"
                  animate={{
                    boxShadow: [
                      '0 0 15px rgba(236, 72, 153, 0.8)',
                      '0 0 25px rgba(236, 72, 153, 0.8)',
                      '0 0 15px rgba(236, 72, 153, 0.8)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ PREMIUM
                </motion.div>
              )}

              {/* Selection indicator */}
              {selectedCarId === car.id && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
                </div>
              )}

              {/* Premium price indicator - Mobile optimized */}
              {!car.unlocked && car.isPremium && (
                <motion.div
                  className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                      '0 0 15px rgba(236, 72, 153, 0.6)',
                      '0 0 25px rgba(236, 72, 153, 0.8)',
                      '0 0 15px rgba(236, 72, 153, 0.6)'
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-sm">💎</span>
                  <div className="text-center">
                    <div className="text-xs">MoMo</div>
                    <div className="text-yellow-300 text-xs">{car.price?.toLocaleString()}</div>
                  </div>
                </motion.div>
              )}

              {/* Regular lock indicator */}
              {!car.unlocked && !car.isPremium && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {car.price}
                </div>
              )}

              {/* Car Preview - Mobile optimized */}
              <div className="flex justify-center mb-4 sm:mb-6 h-32 sm:h-48">
                <Car3D car={car} size="large" animated={car.unlocked || car.isPremium} />
              </div>

              {/* Car Info - Mobile optimized */}
              <div className="text-center">
                <h3 className="text-lg sm:text-2xl font-black text-white mb-3 sm:mb-4 tracking-wide">{car.name}</h3>
                
                {/* Stats with mobile-friendly styling */}
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                    <span className="text-red-400 font-bold text-xs">SPEED</span>
                    <div className="w-16 sm:w-20">
                      <StatBar value={car.speed} color="from-red-500 to-orange-500" />
                    </div>
                    <span className="text-white font-bold text-xs">{car.speed}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                    <span className="text-blue-400 font-bold text-xs">HANDLE</span>
                    <div className="w-16 sm:w-20">
                      <StatBar value={car.handling} color="from-blue-500 to-cyan-500" />
                    </div>
                    <span className="text-white font-bold text-xs">{car.handling}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-black/20 rounded-lg p-2">
                    <span className="text-green-400 font-bold text-xs">SHIELD</span>
                    <div className="w-16 sm:w-20">
                      <StatBar value={car.shield} color="from-green-500 to-emerald-500" />
                    </div>
                    <span className="text-white font-bold text-xs">{car.shield}</span>
                  </div>
                </div>

                {car.unlocked && (
                  <motion.button
                    className={`mt-4 sm:mt-6 w-full py-2 sm:py-3 px-4 rounded-xl font-black transition-colors tracking-wide text-sm sm:text-base ${
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

      {/* Mobile-first Premium Car Payment Modal */}
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
              className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-pink-900/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-sm sm:max-w-md w-full border border-pink-400/50 shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {paymentStep === 'info' && (
                <div className="text-center">
                  <div className="mb-4 sm:mb-6 h-32 sm:h-40">
                    <Car3D car={selectedPremiumCar} size="large" animated={true} />
                  </div>
                  
                  <h3 className="text-lg sm:text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text mb-3 sm:mb-4">
                    {selectedPremiumCar.name}
                  </h3>
                  
                  <div className="bg-black/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                    <div className="text-yellow-400 text-2xl sm:text-3xl font-black mb-2">
                      {selectedPremiumCar.price?.toLocaleString()} VND
                    </div>
                    <div className="text-gray-300 text-xs sm:text-sm">
                      Mở khóa xe premium với thanh toán MoMo
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center">
                      <div className="text-pink-400 text-base sm:text-lg font-bold">{selectedPremiumCar.speed}</div>
                      <div className="text-xs text-gray-400">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 text-base sm:text-lg font-bold">{selectedPremiumCar.handling}</div>
                      <div className="text-xs text-gray-400">Handle</div>
                    </div>
                    <div className="text-center">
                      <div className="text-cyan-400 text-base sm:text-lg font-bold">{selectedPremiumCar.shield}</div>
                      <div className="text-xs text-gray-400">Shield</div>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-3 px-4 sm:px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    Thanh toán MoMo
                  </button>
                </div>
              )}

              {paymentStep === 'qr' && (
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">MoMo QR Payment</h3>
                  
                  {/* Mobile-first QR section */}
                  <div className="bg-white rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 mx-auto max-w-xs">
                    <div className="mb-4">
                      <Image
                        src="/momo-qr.png"
                        alt="MoMo QR Code"
                        width={250}
                        height={250}
                        className="w-full h-auto rounded-lg"
                        priority
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-pink-600 font-bold text-lg sm:text-xl mb-2">
                        {selectedPremiumCar.price?.toLocaleString()} VND
                      </div>
                      <div className="text-gray-600 text-sm">
                        Scan QR với MoMo
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile-optimized payment info */}
                  <div className="bg-black/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-800/50 rounded-lg gap-2">
                      <span className="text-gray-300 text-sm">MoMo:</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-mono text-sm">0933131760</span>
                        <button
                          onClick={() => copyToClipboard('0933131760')}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-800/50 rounded-lg gap-2">
                      <span className="text-gray-300 text-sm">Tên:</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white text-sm">Tran Hanh Duc</span>
                        <button
                          onClick={() => copyToClipboard('Tran Hanh Duc')}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-800/50 rounded-lg gap-2">
                      <span className="text-gray-300 text-sm">Nội dung:</span>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-white font-mono text-sm">NEON-{selectedPremiumCar.id.toUpperCase()}</span>
                        <button
                          onClick={() => copyToClipboard(`NEON-${selectedPremiumCar.id.toUpperCase()}`)}
                          className="text-cyan-400 hover:text-cyan-300 p-1"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile-friendly contact info */}
                  <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/30 rounded-xl p-4 mb-4 sm:mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-pink-400" />
                      <span className="text-pink-400 font-bold text-sm">Hỗ trợ thanh toán</span>
                    </div>
                    <a 
                      href="tel:0933131760" 
                      className="text-white hover:text-pink-300 transition-colors font-mono text-sm"
                    >
                      📞 0933 131 760
                    </a>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-400 mb-4 leading-relaxed">
                    Sau khi thanh toán, xe sẽ được mở khóa tự động trong garage của bạn
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setPaymentStep('info')}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-bold transition-colors text-sm"
                    >
                      ← Quay lại
                    </button>
                    <button
                      onClick={() => setPaymentStep('success')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition-colors text-sm"
                    >
                      ✅ Đã thanh toán
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="text-center">
                  <div className="mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Check className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-2">Thanh toán thành công!</h3>
                    <p className="text-gray-300 text-sm sm:text-base">Xe premium đã được mở khóa!</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowPaymentModal(false)
                      // In a real app, you would unlock the car here
                      // For demo purposes, we'll just close the modal
                    }}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white py-3 px-4 sm:px-6 rounded-xl font-bold transition-all text-sm sm:text-base"
                  >
                    🏁 Bắt đầu đua!
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
