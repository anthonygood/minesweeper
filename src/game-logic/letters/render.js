import { getFont } from './getTextPaths'
import { DEFAULT_TEXT_SIZE } from '../canvas/sizes'
import withContext from '../../util/withContext'

const getWidthHeight = ({ min, max }) => ({
  width: max.x - min.x,
  height: max.y - min.y
})

const getOrigin = ({ min, max }) => {
  const { width, height } = getWidthHeight({ min, max })

  return {
    x: width / 2,
    y: height / 2
  }
}

export const renderLetter = async (body, context) => {
  const {
    angle,
    plugin: {
      char,
      // boundingBox,
      size = DEFAULT_TEXT_SIZE
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
  // const xyBounds = { x: (boundingBox.x2 - boundingBox.x1) / 2, y: (boundingBox.y2 - boundingBox.y1) / 2 }
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
      size
    )
  })
}

export default { renderLetter }
