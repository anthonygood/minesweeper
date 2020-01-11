import { gameFontSync } from './getTextPaths'
import { DEFAULT_TEXT_SIZE } from '../canvas/sizes'
import withContext from '../../util/withContext'

const getWidthHeight = ({ min, max }) => ({
  width: max.x - min.x,
  height: max.y - min.y
})

let count = 0

export const renderLetter = async (body, context) => {
  const {
    bounds: { min, max },
    angle,
    position: { x, y },
    plugin: {
      char,
      path,
      size = DEFAULT_TEXT_SIZE
    }
  } = body

  if (!char) return

  count++
  // Bit of a hack:
  // If the text is sleeping, assume it's in initialised position
  // and draw from text bounding box. Otherwise, assume it's in motion
  // and use the physics model's bounds (which aren't as neatly aligned for prose).
  // const { x, y } = getOrigin({ min, max })
  const { width, height } = getWidthHeight({ min, max })
  const xx = width / 2
  const yy = height / 2
  console.assert(count > 1, x, y, min.x+xx, min.y+yy)

  withContext(context, ctx => {
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
    // ctx.strokeRect(min.x, min.y, width, height)
    // ctx.strokeRect(0 - x, 0 - y, width, height)
    // ctx.strokeRect(x, y, 2, 2)
  })
}

export default { renderLetter }
