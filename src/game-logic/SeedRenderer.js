import withContext from './canvas/withContext'
import ParticleRenderer from './ParticleRenderer'
import { getColour, newOpacity, randomOpacity, randomSize } from './canvas/shimmery'
import between from '../util/between'

const newSize = size => size
// Math.max(
//   Math.min(sample(size, size, size, size, size, size,size, size, size, size, size, size, size, size, size, size, size, size,size, size, size, size, size, size, upDown(size)), 52),
//   48
// )

class SeedRenderer extends ParticleRenderer {
  constructor(x, y, size, isAlive) {
    super({})
    this.x = x
    this.y = y
    this.size = size
    this.isAlive = isAlive
    this.opacity = randomOpacity(3, 8)
    this._tick = 0
    this.pulse = [0] // alive/dead across ticks
  }

  toggle() {
    const toggled = !this.isAlive
    this.isAlive = toggled
    this.pulse[this._tick] = Number(toggled)
  }

  tick(value) {
    this._tick++
    this.pulse.push(value)
    this.isAlive = !!value
  }

  mutate() {
    const { isAlive, size } = this
    const [lowerOpacity, upperOpacity] = isAlive ? [4, 8] : [3, 7]
    this.opacity = newOpacity(this.opacity, lowerOpacity, upperOpacity)
    this.size = newSize(size)
  }

  renderRect(ctx) {
    const { isAlive, size, x, y } = this
    const draw = isAlive ? 'fillRect' : 'strokeRect'
    // ctx.strokeRect(x, y, size, size)
    ctx.fillRect(x, y, size, size)
  }

  renderCircle(ctx) {
    const { isAlive, size, x, y } = this

    ctx.beginPath()
    const half = size / 2

    ctx.arc(x + half, y + half, 12,  0, 2 * Math.PI)
    ctx.fill()
  }
}

export default SeedRenderer
