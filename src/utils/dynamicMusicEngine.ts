class DynamicMusicEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private baseTrack: AudioBufferSourceNode | null = null
  private layerTracks: Map<string, AudioBufferSourceNode> = new Map()
  private currentIntensity = 0.5
  private targetIntensity = 0.5
  private isPlaying = false

  async initialize() {
    if (typeof window === 'undefined') return

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      
      // Load base tracks and layers
      await this.loadMusicLayers()
    } catch (error) {
      console.warn('Dynamic Music Engine failed to initialize:', error)
    }
  }

  private async loadMusicLayers() {
    // These would be your actual music files
    const layers = [
      { name: 'base', url: '/audio/music/base-track.mp3', intensity: 0.0 },
      { name: 'drums', url: '/audio/music/drums-layer.mp3', intensity: 0.3 },
      { name: 'synth', url: '/audio/music/synth-layer.mp3', intensity: 0.6 },
      { name: 'lead', url: '/audio/music/lead-layer.mp3', intensity: 0.8 },
    ]

    // For now, we'll simulate with Web Audio API generated tones
    this.createSyntheticLayers()
  }

  private createSyntheticLayers() {
    if (!this.audioContext) return

    // Create base rhythm
    this.createRhythmLayer('base', 80, 0.1) // Low intensity bass
    this.createRhythmLayer('drums', 120, 0.2) // Medium intensity drums
    this.createRhythmLayer('synth', 200, 0.3) // High intensity synth
    this.createRhythmLayer('lead', 300, 0.4) // Maximum intensity lead
  }

  private createRhythmLayer(name: string, frequency: number, baseVolume: number) {
    if (!this.audioContext || !this.masterGain) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    oscillator.type = name === 'base' ? 'sawtooth' : name === 'drums' ? 'square' : 'sine'
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(800, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    // Store for intensity control
    this.layerTracks.set(name, gainNode as any)
  }

  setIntensity(intensity: number) {
    this.targetIntensity = Math.max(0, Math.min(1, intensity))
    this.updateLayers()
  }

  private updateLayers() {
    if (!this.audioContext) return

    // Smooth intensity transition
    const smoothingFactor = 0.1
    this.currentIntensity += (this.targetIntensity - this.currentIntensity) * smoothingFactor

    // Update each layer based on intensity
    this.layerTracks.forEach((gainNode: any, layerName) => {
      const layerThresholds = {
        base: 0.0,
        drums: 0.25,
        synth: 0.5,
        lead: 0.75
      }

      const threshold = layerThresholds[layerName as keyof typeof layerThresholds] || 0
      const volume = Math.max(0, Math.min(1, (this.currentIntensity - threshold) * 2))
      
      if (gainNode.gain) {
        gainNode.gain.linearRampToValueAtTime(
          volume * 0.1, // Base volume multiplier
          this.audioContext!.currentTime + 0.1
        )
      }
    })
  }

  start() {
    if (!this.audioContext || this.isPlaying) return

    this.isPlaying = true
    
    // Start all oscillators
    this.layerTracks.forEach((node: any) => {
      if (node.start) {
        node.start()
      }
    })

    // Continuous intensity updates
    const updateLoop = () => {
      if (this.isPlaying) {
        this.updateLayers()
        requestAnimationFrame(updateLoop)
      }
    }
    updateLoop()
  }

  stop() {
    if (!this.audioContext || !this.isPlaying) return

    this.isPlaying = false
    
    this.layerTracks.forEach((node: any) => {
      if (node.stop) {
        node.stop()
      }
    })
    
    this.layerTracks.clear()
  }

  // Game event handlers
  onSpeedChange(speed: number) {
    // Speed 1-10 maps to intensity 0.2-1.0
    const intensity = 0.2 + (speed / 10) * 0.8
    this.setIntensity(intensity)
  }

  onComboStart() {
    // Boost intensity temporarily
    this.setIntensity(Math.min(1.0, this.targetIntensity + 0.2))
  }

  onComboEnd() {
    // Return to normal intensity
    this.setIntensity(Math.max(0.3, this.targetIntensity - 0.2))
  }

  onLevelUp() {
    // Dramatic intensity spike
    this.setIntensity(1.0)
    setTimeout(() => {
      this.setIntensity(0.6)
    }, 2000)
  }

  onGameOver() {
    // Fade out
    this.setIntensity(0.1)
    setTimeout(() => this.stop(), 2000)
  }
}

export const dynamicMusicEngine = new DynamicMusicEngine()
