import { newOpacity, randomOpacity } from './canvas/shimmery'

class CellRenderer {
  constructor(x, y, size, isOn) {
    this.x = x
    this.y = y
    this.size = size
    this.isOn = isOn
    this.opacity = randomOpacity(3, 8)
    this._tick = 0
    this.pulse = [0] // alive/dead across ticks
  }

  toggle() {
    const toggled = !this.isOn
    this.isOn = toggled
    this.pulse[this._tick] = Number(toggled)
  }

  tick(value) {
    this._tick++
    this.pulse.push(value)
    this.isOn = !!value
  }

  mutate() {
    const { isAlive, size } = this
    const [lowerOpacity, upperOpacity] = isAlive ? [4, 8] : [3, 7]
    this.opacity = newOpacity(this.opacity, lowerOpacity, upperOpacity)
    this.size = newSize(size)
  }

  renderRect(ctx) {
    const { size, x, y } = this
    ctx.fillRect(x, y, size, size)
  }

  renderCircle(ctx) {
    const { size, x, y } = this

    ctx.beginPath()
    const half = size / 2

    ctx.arc(x + half, y + half, 12,  0, 2 * Math.PI)
    ctx.fill()
  }
}

export default CellRenderer
