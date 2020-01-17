import withContext from '../game-logic/canvas/withContext'
import upDown from '../util/upDown'
import sample from '../util/sample'
import {
  getColour,
  newOpacity,
  randomSize,
  randomOpacity
} from './canvas/shimmery'

// NB. this is the engine default but can be changed.
const BUCKET_SIZE = 48

const growOrShrink = size => upDown(size)

class ParticleRenderer {
  constructor(particle) {
    this.particle = particle
    this.size = randomSize()
    this.opacity = randomOpacity()
    this.draw = sample('fillRect')
  }

  mutate(_delta) {
    this.opacity = Math.max(
      Math.min(0.1, newOpacity(this.opacity)),
      0.025
    )
    this.size = growOrShrink(this.size)
    return this
  }

  render(context) {
    const { particle, size, opacity } = this
    if (!particle || !particle.region) return

    const {
      startCol,
      startRow,
    } = particle.region

    const offset = size - BUCKET_SIZE

    withContext(context, ctx => {
      const colour = getColour(opacity)
      ctx.fillStyle = colour
      ctx.strokeStyle = colour // `4px solid ${colour}`

      ctx[this.draw](
        (BUCKET_SIZE * startCol) - (BUCKET_SIZE - size),
        (BUCKET_SIZE * startRow) - (BUCKET_SIZE - size),
        size, size
      )
    })
  }
}

export default ParticleRenderer
