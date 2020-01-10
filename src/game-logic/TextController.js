import { World } from 'matter-js'
import getText from './letters/getText'
import { renderBubble } from './canvas/renderTextBubble'

export const getBoundary = bounds => bounds.reduce(
  (acc, item) => {
    const { min: minA, max: maxA } = acc
    const { min: minB, max: maxB } = Array.isArray(item) ? getBoundary(item) : item
    return {
      min: { x: Math.min(minA.x, minB.x), y: Math.min(minA.y, minB.y) },
      max: { x: Math.max(maxA.x, maxB.x), y: Math.max(maxA.y, maxB.y) },
    }
  },
  {
    min: { x: Infinity, y: Infinity },
    max: { x: 0, y: 0 }
  }
)

class TextController {
  constructor(world, canvas) {
    this.text = getText()
    this.text.then(text => {
      text.forEach(line => World.add(world, line))

      const allBounds = text.map(line => line.map(_ => _.bounds))
      const textBounds = getBoundary(allBounds)

      renderBubble(
        canvas.getContext('2d'),
        textBounds
      )
    })
  }
}

export default TextController
