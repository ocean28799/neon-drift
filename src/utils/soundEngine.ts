'use client'

class SoundEngine {
  private audioContext: AudioContext | null = null
  private sounds: { [key: string]: AudioBuffer } = {}
  private enabled: boolean = true
  private musicGainNode: GainNode | null = null
  private currentMusic: AudioBufferSourceNode | null = null
  private musicVolume: number = 0.3

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        this.audioContext = new AudioContextClass()
        if (this.audioContext) {
          this.musicGainNode = this.audioContext.createGain()
          this.musicGainNode.connect(this.audioContext.destination)
          this.musicGainNode.gain.value = this.musicVolume
        }
      } catch {
        console.warn('Web Audio API not supported')
      }
    }
  }

  async enable() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  // Generate synthetic sounds
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const length = sampleRate * duration
    const buffer = this.audioContext.createBuffer(1, length, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      let value = 0

      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t)
          break
        case 'square':
          value = Math.sign(Math.sin(2 * Math.PI * frequency * t))
          break
        case 'sawtooth':
          value = 2 * (frequency * t - Math.floor(frequency * t + 0.5))
          break
        case 'triangle':
          value = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1
          break
      }

      // Apply envelope (fade in/out)
      const envelope = Math.min(
        t * 10, // fade in
        1,
        (duration - t) * 10 // fade out
      )
      data[i] = value * envelope * 0.1 // reduce volume
    }

    return buffer
  }

  // Generate synthetic music sequences
  private createMusicBuffer(pattern: number[], duration: number, baseFreq: number = 220): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    const totalLength = sampleRate * duration
    const buffer = this.audioContext.createBuffer(2, totalLength, sampleRate) // Stereo
    const leftData = buffer.getChannelData(0)
    const rightData = buffer.getChannelData(1)

    const beatDuration = duration / pattern.length
    const beatSamples = sampleRate * beatDuration

    for (let beat = 0; beat < pattern.length; beat++) {
      const note = pattern[beat]
      if (note === 0) continue // Rest

      const frequency = baseFreq * Math.pow(2, note / 12) // Chromatic scale
      const startSample = beat * beatSamples
      const endSample = Math.min(startSample + beatSamples, totalLength)

      for (let i = startSample; i < endSample; i++) {
        const t = i / sampleRate
        const beatTime = (i - startSample) / beatSamples
        
        // Gaming-style envelope: punchy attack, sustain, quick release
        let envelope = 1
        if (beatTime < 0.05) envelope = beatTime / 0.05 // Sharp attack
        else if (beatTime > 0.7) envelope = (1 - beatTime) / 0.3 // Quick release
        
        // Gaming synthesizer with multiple waveforms
        const fundamental = Math.sin(2 * Math.PI * frequency * t) * 0.5 // Main tone
        const harmonic = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.2 // Octave
        const subBass = Math.sin(2 * Math.PI * frequency * 0.5 * t) * 0.3 // Sub bass
        
        // Add some digital distortion for gaming feel
        const square = Math.sign(Math.sin(2 * Math.PI * frequency * t)) * 0.1
        
        const sample = (fundamental + harmonic + subBass + square) * envelope * 0.25
        
        leftData[i] = sample
        rightData[i] = sample * 0.9 + Math.sin(2 * Math.PI * frequency * 1.5 * t) * envelope * 0.05 // Slight stereo width
      }
    }

    return buffer
  }

  // Create background music tracks
  private generateBackgroundMusic() {
    if (!this.audioContext) return

    // Gaming menu theme - retro chiptune style
    const menuPattern = [
      5, 0, 5, 0, 7, 0, 5, 0,   // Main melody
      3, 0, 3, 0, 5, 0, 3, 0,   // Variation
      7, 0, 7, 0, 9, 0, 7, 0,   // Higher
      5, 0, 7, 0, 5, 0, 3, 0    // Resolution
    ]
    this.sounds.menuMusic = this.createMusicBuffer(menuPattern, 8, 220) || new AudioBuffer({ length: 1, sampleRate: 44100 })

    // High-energy gaming theme - driving electronic beat
    const gamePattern = [
      7, 7, 0, 7, 12, 0, 7, 0,  // Punchy rhythm
      5, 5, 0, 5, 10, 0, 5, 0,  // Lower
      9, 9, 0, 9, 14, 0, 9, 0,  // Higher energy
      7, 0, 12, 0, 7, 0, 15, 0  // Build-up
    ]
    this.sounds.gameMusic = this.createMusicBuffer(gamePattern, 6, 174) || new AudioBuffer({ length: 1, sampleRate: 44100 })

    // Intense boss battle theme - fast aggressive pattern
    const intensivePattern = [
      12, 12, 0, 15, 12, 0, 17, 0, // Fast aggressive
      10, 10, 0, 13, 10, 0, 15, 0, // Variation
      14, 14, 0, 17, 14, 0, 19, 0, // Peak intensity
      12, 0, 17, 0, 19, 0, 22, 0   // Climax
    ]
    this.sounds.intensiveMusic = this.createMusicBuffer(intensivePattern, 4, 261) || new AudioBuffer({ length: 1, sampleRate: 44100 })
  }

  // Create advanced gaming sound effects
  private createGamingSound(type: string): AudioBuffer | null {
    if (!this.audioContext) return null

    const sampleRate = this.audioContext.sampleRate
    let duration = 0.2
    let buffer: AudioBuffer

    switch (type) {
      case 'coin':
        // Coin collect - ascending arpeggio
        duration = 0.3
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const coinData = buffer.getChannelData(0)
        const coinFreqs = [523, 659, 784, 1047] // C5, E5, G5, C6
        
        for (let i = 0; i < coinData.length; i++) {
          const t = i / sampleRate
          const noteIndex = Math.floor(t / (duration / 4))
          const freq = coinFreqs[Math.min(noteIndex, 3)]
          const envelope = Math.exp(-t * 8) // Quick decay
          coinData[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3
        }
        return buffer

      case 'powerup':
        // Power-up - sweeping filter effect
        duration = 0.4
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const powerData = buffer.getChannelData(0)
        
        for (let i = 0; i < powerData.length; i++) {
          const t = i / sampleRate
          const freq = 200 + (t / duration) * 800 // Sweep from 200Hz to 1000Hz
          const envelope = Math.sin(Math.PI * t / duration) // Bell curve
          const noise = (Math.random() - 0.5) * 0.1 // Add some texture
          powerData[i] = (Math.sin(2 * Math.PI * freq * t) + noise) * envelope * 0.4
        }
        return buffer

      case 'crash':
        // Crash - explosive burst with noise
        duration = 0.6
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const crashData = buffer.getChannelData(0)
        
        for (let i = 0; i < crashData.length; i++) {
          const t = i / sampleRate
          const envelope = Math.exp(-t * 5) // Fast decay
          const noise = (Math.random() - 0.5) * 2 // Strong noise component
          const lowFreq = Math.sin(2 * Math.PI * 80 * t) * 0.5 // Low rumble
          crashData[i] = (noise + lowFreq) * envelope * 0.5
        }
        return buffer

      case 'shield':
        // Shield - metallic clang with reverb
        duration = 0.25
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const shieldData = buffer.getChannelData(0)
        
        for (let i = 0; i < shieldData.length; i++) {
          const t = i / sampleRate
          const envelope = Math.exp(-t * 12) // Quick metallic decay
          const freq1 = Math.sin(2 * Math.PI * 400 * t)
          const freq2 = Math.sin(2 * Math.PI * 800 * t) * 0.5
          const freq3 = Math.sin(2 * Math.PI * 1200 * t) * 0.25
          shieldData[i] = (freq1 + freq2 + freq3) * envelope * 0.4
        }
        return buffer

      case 'countdown':
        // Countdown - retro beep
        duration = 0.15
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const countData = buffer.getChannelData(0)
        
        for (let i = 0; i < countData.length; i++) {
          const t = i / sampleRate
          const envelope = Math.sin(Math.PI * t / duration) // Bell envelope
          countData[i] = Math.sin(2 * Math.PI * 1000 * t) * envelope * 0.5
        }
        return buffer

      case 'start':
        // Start - triumphant chord
        duration = 0.5
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const startData = buffer.getChannelData(0)
        const chordFreqs = [261, 329, 392, 523] // C major chord
        
        for (let i = 0; i < startData.length; i++) {
          const t = i / sampleRate
          const envelope = Math.sin(Math.PI * t / duration) * Math.exp(-t * 2)
          let sample = 0
          chordFreqs.forEach(freq => {
            sample += Math.sin(2 * Math.PI * freq * t) * 0.25
          })
          startData[i] = sample * envelope * 0.6
        }
        return buffer

      case 'engine':
        // Engine - continuous rumble
        duration = 1.0
        buffer = this.audioContext.createBuffer(1, sampleRate * duration, sampleRate)
        const engineData = buffer.getChannelData(0)
        
        for (let i = 0; i < engineData.length; i++) {
          const t = i / sampleRate
          const noise = (Math.random() - 0.5) * 0.3
          const rumble1 = Math.sin(2 * Math.PI * 60 * t) * 0.4
          const rumble2 = Math.sin(2 * Math.PI * 120 * t) * 0.2
          engineData[i] = (noise + rumble1 + rumble2) * 0.3
        }
        return buffer

      default:
        return this.createTone(440, 0.2, 'sine')
    }
  }

  // Initialize game sounds
  initSounds() {
    if (!this.audioContext) return

    // Generate music tracks
    this.generateBackgroundMusic()

    // Create enhanced gaming sounds
    this.sounds.coin = this.createGamingSound('coin') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    this.sounds.powerup = this.createGamingSound('powerup') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    this.sounds.crash = this.createGamingSound('crash') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    this.sounds.shield = this.createGamingSound('shield') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    this.sounds.countdown = this.createGamingSound('countdown') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    this.sounds.start = this.createGamingSound('start') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    this.sounds.engine = this.createGamingSound('engine') || new AudioBuffer({ length: 1, sampleRate: 44100 })
  }

  play(soundName: string, volume: number = 0.5) {
    if (!this.enabled || !this.audioContext || !this.sounds[soundName]) return

    try {
      const source = this.audioContext.createBufferSource()
      const gainNode = this.audioContext.createGain()
      
      source.buffer = this.sounds[soundName]
      gainNode.gain.value = volume
      
      source.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      source.start(0)
    } catch {
      console.warn('Failed to play sound')
    }
  }

  // Background music controls
  playMusic(trackName: string, loop: boolean = true) {
    if (!this.enabled || !this.audioContext || !this.musicGainNode || !this.sounds[trackName]) return

    // Stop current music
    this.stopMusic()

    try {
      this.currentMusic = this.audioContext.createBufferSource()
      this.currentMusic.buffer = this.sounds[trackName]
      this.currentMusic.loop = loop
      
      this.currentMusic.connect(this.musicGainNode)
      this.currentMusic.start(0)
    } catch {
      console.warn('Failed to play music')
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      try {
        this.currentMusic.stop()
      } catch {
        // Ignore errors when stopping
      }
      this.currentMusic = null
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume))
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.musicVolume
    }
  }

  // Background engine sound
  startEngineLoop() {
    if (!this.enabled || !this.audioContext) return

    const playEngineLoop = () => {
      this.play('engine', 0.1)
      setTimeout(playEngineLoop, 500)
    }
    
    // Create a subtle engine sound
    this.sounds.engine = this.createTone(80, 0.6, 'sawtooth') || new AudioBuffer({ length: 1, sampleRate: 44100 })
    playEngineLoop()
  }
}

export const soundEngine = new SoundEngine()
