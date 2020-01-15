class SoundController {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    const ctx = this.ctx = new AudioContext()

    const gain = this.gain = ctx.createGain()
    // gain.gain.value = 0

    const oscillator = this.oscillator = ctx.createOscillator()
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(440, ctx.currentTime)

    oscillator
      .connect(gain)
      .connect(ctx.destination)

    oscillator.start()
  }

  play(x, y) {
    const { ctx, gain } = this
    const { state } = ctx
    if (state === 'suspended') ctx.resume()
    gain.gain.value = 1
    this.tune(x, y)
  }

  tune(x, y) {
    const { ctx, oscillator } = this
    oscillator.frequency.setValueAtTime(x + y, ctx.currentTime)
  }

  stop() {
    console.log('stop!')
    this.gain.gain.value = 0
  }
}

export default SoundController
