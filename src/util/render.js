import { getFont, DEFAULT_SIZE } from './getTextPaths'
import withContext from './withContext'

const getOrigin = ({ min, max }) => {
  const { width, height } = getWidthHeight({ min, max })

  return {
    x: width / 2,
    y: height / 2
  }
}

const getWidthHeight = ({ min, max }) => ({
  width: max.x - min.x,
  height: max.y - min.y
})

export const renderLetter = async (body, context) => {
  const {
    angle,
    plugin: {
      char,
      boundingBox,
      size
    }
  } = body

  if (!char) return

  const { min, max } = body.bounds

  // Bit of a hack:
  // If the text is sleeping, assume it's in initialised position
  // and draw from text bounding box. Otherwise, assume it's in motion
  // and use the physics model's bounds (which aren't as neatly aligned for prose).
  // const x = body.isSleeping ? boundingBox.x1 : min.x
  // const y = body.isSleeping ? boundingBox.y2 : max.y

  const { x, y } = getOrigin({ min, max })
  const { width, height } = getWidthHeight({ min, max })

  const font = await getFont()

  withContext(context, ctx => {
    ctx.translate(
      min.x + x,
      min.y + y
    )
    ctx.rotate(angle)
    font.draw(
      context,
      char,
      0 - width / 2,
      0 + height / 2,
      // 0,
      size || DEFAULT_SIZE
    )
  })
}

export default { renderLetter }
