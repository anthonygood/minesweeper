import { World, Body } from 'matter-js'
import { getFont } from './letters/getTextPaths'
import getText from './letters/getText'
import { renderBubble } from './canvas/renderTextBubble'
import { DEFAULT_TEXT_SIZE, DEFAULT_LINE_HEIGHT, CANVAS_WIDTH } from './canvas/sizes'

const scroll = body => Body.translate(body, { x: 0, y: 1 })

export const getOuterBounds = bounds => bounds.reduce(
  (acc, item) => {
    const { min: minA, max: maxA } = acc
    const { min: minB, max: maxB } = Array.isArray(item) ? getOuterBounds(item) : item
    return {
      min: { x: 40, y: Math.min(minA.y, minB.y) },
      max: { x: CANVAS_WIDTH - 50, y: Math.max(maxA.y, maxB.y) },
    }
  },
  {
    min: { x: Infinity, y: Infinity },
    max: { x: -Infinity, y: -Infinity }
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
    this.bodies.filter(_ => _.isSleeping).forEach(scroll)

    const bodyBounds = this.bodies.filter(_ => _.isSleeping).map(_ => _.bounds)

    const { canvas } = this
    const ctx = canvas.getContext('2d')

    renderBubble(
      ctx,
      getOuterBounds(bodyBounds),
      () => ctx.clearRect(0, 0, canvas.width, canvas.height)
    )
  }

  // Text itself is rendered via homebrew matterjs plugin,
  // Text bubble is rendered onto (background) canvas once separately.
  start({ lines, x, y, size = DEFAULT_TEXT_SIZE, lineheight = DEFAULT_LINE_HEIGHT }) {
    const { canvas, world } = this

    const text = getText(lines, x, y, size, lineheight)
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
