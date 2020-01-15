import withContext from '../game-logic/canvas/withContext'
import between from '../util/between'
import upDown from '../util/upDown'
import sample from '../util/sample'

// NB. this is the engine default but can be changed.
const BUCKET_SIZE = 48
const REGION_COLOUR = 'rgba(255,255,255,0.25)'

const randomSize = () => between(48, 56)
const randomOpacity = () => between(0, 1) / 10

const getColour = (opacity = randomOpacity()) =>
  `rgba(255,255,255,${opacity})`

const newOpacity = opacity => {
  const val = upDown(opacity * 100) / 100

  return Math.min(
    Math.max(val, 0.025),
    0.3
  )
}

const growOrShrink = size => upDown(size)

class ParticleRenderer {
  constructor(particle) {
    this.particle = particle
    this.size = randomSize()
    this.opacity = randomOpacity()
    this.draw = sample('fillRect')
  }

  mutate(_delta) {
    this.opacity = newOpacity(this.opacity)
    this.size = growOrShrink(this.size)
    return this
  }

  render(context) {
    const { particle, size, opacity } = this
    if (!particle || !particle.region) return

    const {
      startCol,
      endCol,
      startRow,
      endRow
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
