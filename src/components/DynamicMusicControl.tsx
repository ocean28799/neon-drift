import React, { useEffect, useState } from 'react'
import { Volume2, VolumeX, Music } from 'lucide-react'
import { dynamicMusicEngine } from '@/utils/dynamicMusicEngine'

interface DynamicMusicControlProps {
  gameSpeed: number
  isComboActive: boolean
  onLevelUp?: boolean
}

export default function DynamicMusicControl({ 
  gameSpeed, 
  isComboActive, 
  onLevelUp 
}: DynamicMusicControlProps) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [currentIntensity, setCurrentIntensity] = useState(0.5)

  useEffect(() => {
    dynamicMusicEngine.initialize()
    
    if (isEnabled) {
      dynamicMusicEngine.start()
    }
    
    return () => {
      dynamicMusicEngine.stop()
    }
  }, [isEnabled])

  useEffect(() => {
    if (isEnabled) {
      dynamicMusicEngine.onSpeedChange(gameSpeed)
      setCurrentIntensity(0.2 + (gameSpeed / 10) * 0.8)
    }
  }, [gameSpeed, isEnabled])

  useEffect(() => {
    if (isEnabled) {
      if (isComboActive) {
        dynamicMusicEngine.onComboStart()
      } else {
        dynamicMusicEngine.onComboEnd()
      }
    }
  }, [isComboActive, isEnabled])

  useEffect(() => {
    if (isEnabled && onLevelUp) {
      dynamicMusicEngine.onLevelUp()
    }
  }, [onLevelUp, isEnabled])

  const toggleMusic = () => {
    setIsEnabled(!isEnabled)
    if (!isEnabled) {
      dynamicMusicEngine.start()
    } else {
      dynamicMusicEngine.stop()
    }
  }

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="bg-black/70 backdrop-blur-lg rounded-xl p-3 border border-purple-400/30">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className="text-white hover:text-purple-400 transition-colors"
          >
            {isEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-purple-400" />
            <div className="w-20 bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${currentIntensity * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mt-1 text-center">
          Dynamic Music {isEnabled ? 'ON' : 'OFF'}
        </div>
      </div>
    </div>
  )
}
