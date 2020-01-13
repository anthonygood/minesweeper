import { Body } from 'matter-js'
import { gameFontSync } from './getTextPaths'
import { DEFAULT_TEXT_SIZE } from '../canvas/sizes'
import withContext from '../canvas/withContext'
import renderRegions from '../canvas/renderRegions'

const unrotatedBounds = (body) => {
  const { angle, vertices, position } = body
  const clone = Body.create({ vertices, position })
  Body.rotate(clone, -angle)
  return { min: clone.bounds.min, max: clone.bounds.max, clone }
}

export const renderLetter = async (body, context) => {
  const {
    angle,
    position: { x, y },
    plugin: {
      char,
      path,
      size = DEFAULT_TEXT_SIZE
    }
  } = body

  if (!char) return
  const { min, max } = unrotatedBounds(body)

  renderRegions(body, context)

  // Bit of a hack:
  // If the text is sleeping, assume it's in initialised position
  // and draw from text bounding box. Otherwise, assume it's in motion
  // and use the physics model's bounds (which aren't as neatly aligned for prose).
  withContext(context, ctx => {
    // NB. any movement while sleeping won't be rendered
    // if (body.isSleeping) return path.draw(ctx)

    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.translate(-x, -y)
    gameFontSync.draw(
      context,
      char,
      min.x,
      max.y,
      size
    )
  })
}

export default { renderLetter }
