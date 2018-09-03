import { gameFont, DEFAULT_SIZE } from './getTextPaths'
import withContext from './withContext'

export const renderLetter = (body, context) => {
    const {
        angle,
        plugin: {
            char,
            boundingBox,
            size
    } } = body

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

    withContext(context, ctx => {
        ctx.translate(
            min.x + x,
            max.y - y
        )
        ctx.rotate(angle)
        gameFont.draw(
            context,
            char,
            0 - width / 2,
            0 + height / 2,
            size || DEFAULT_SIZE
        )
    })
}

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

export default { renderLetter }
