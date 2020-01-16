class SoundController {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = this.ctx = new AudioContext()

    const gain = this.gain = ctx.createGain()
    gain.gain.value = 0
    this.volume = 0.5

    const oscillator = this.oscillator = ctx.createOscillator()
    oscillator.frequency.setValueAtTime(440, ctx.currentTime)

    oscillator
      .connect(gain)
      .connect(ctx.destination)

    oscillator.start()
  }

  play(x, y) {
    const { ctx } = this
    if (ctx.state === 'suspended') ctx.resume()
    this.gain.gain.value = this.volume
    this.tune(x, y)
  }

  stop() {
    this.gain.gain.value = 0
  }

  getWave() {
    return this.oscillator.type
  }

  setWave(type) {
    this.oscillator.type = type
  }

  setVolume(value) {
    if (this.gain.gain.value) this.gain.gain.value = value
    this.volume = value
  }

  getVolume() {
    return this.gain.value
  }

  tune(x, y) {
    const { ctx, oscillator } = this
    oscillator.frequency.setValueAtTime(x + y, ctx.currentTime)
  }
}

export default SoundController
