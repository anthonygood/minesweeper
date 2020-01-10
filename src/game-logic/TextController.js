import { World } from 'matter-js'
import { getFont, gameFontSync } from './letters/getTextPaths'
import { getTextPathsSync } from './letters/getTextPaths'
import { getTextSync } from './letters/getText'
import { renderBubble } from './canvas/renderTextBubble'
import { DEFAULT_TEXT_SIZE, DEFAULT_LINE_HEIGHT } from './canvas/sizes'

export const getOuterBounds = bounds => bounds.reduce(
  (acc, item) => {
    const { min: minA, max: maxA } = acc
    const { min: minB, max: maxB } = Array.isArray(item) ? getOuterBounds(item) : item
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
  constructor(world, canvas, strings) {
    this.loaded = false
    this.canvas = canvas
    this.world = world
    this.strings = strings
    this.bodies = []
  }

  async load() {
    await getFont()
    this.loaded = true
  }

  tick() {
    if (!this.text) return
  }

  // Text itself is rendered via homebrew matterjs plugin,
  // Text bubble is rendered onto (background) canvas once separately.
  render({ lines, x, y, size = DEFAULT_TEXT_SIZE, lineheight = DEFAULT_LINE_HEIGHT }) {
    const { canvas, world } = this

    const text = getTextSync(lines, x, y, size, lineheight)

    text.forEach(line => {
      line.forEach(body => this.bodies.push(body))
      World.add(world, line)
    })

    const allBounds = text.map(line => line.map(_ => _.bounds))

    renderBubble(
      canvas.getContext('2d'),
      getOuterBounds(allBounds)
    )
  }
}

export default TextController
