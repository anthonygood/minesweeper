import { gameFont, DEFAULT_SIZE } from './getTextPaths'

const renderLetter = (body, context) => {
    const { plugin:
        {
            char,
            boundingBox,
            size
        }
    } = body

    if (!char) return

    // Bit of a hack:
    // If the text is sleeping, assume it's in initialised position
    // and draw from text bounding box. Otherwise, assume it's in motion
    // and use the physics model's bounds (which aren't as neatly aligned for prose).
    const x = body.isSleeping ? boundingBox.x1 : body.bounds.min.x
    const y = body.isSleeping ? boundingBox.y2 : body.bounds.max.y

    gameFont.draw(
        context,
        char,
        x,
        y,
        size || DEFAULT_SIZE
    )
}

export default renderLetter
