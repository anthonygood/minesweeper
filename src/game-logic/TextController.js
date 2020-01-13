import { World, Body, Composite } from 'matter-js'
import { getFont } from './letters/getTextPaths'
import getText from './letters/getText'
import { renderBubble } from './canvas/renderTextBubble'
import {
  CANVAS_WIDTH,
  DEFAULT_TEXT_SIZE,
  DEFAULT_LINE_HEIGHT,
  MESSAGE_BUBBLE_WIDTH
} from './canvas/sizes'

// NB frame-rate bound?
const crawl = body => Body.translate(body, { x: 0, y: 1 })

export const getOuterBounds = bounds => bounds.reduce(
  (acc, item) => {
    const { min: minA, max: maxA } = acc
    const { min: minB, max: maxB } = Array.isArray(item) ? getOuterBounds(item) : item
    return {
      min: { x: MESSAGE_BUBBLE_WIDTH, y: Math.min(minA.y, minB.y) },
      max: { x: CANVAS_WIDTH - 50,    y: Math.max(maxA.y, maxB.y) },
    }
  },
  {
    min: { x: Infinity, y: Infinity },
    max: { x: -Infinity, y: -Infinity }
  }
)

class TextController {
  constructor(world, canvas, messages) {
    this.loaded = false
    this.canvas = canvas
    this.world = world
    this.messages = messages
    this.currentMessage = null
    this.bodies = []
  }

  async load() {
    await getFont()
    this.loaded = true
  }

  tick() {
    const { canvas } = this
    const { min } = this.getTextBounds()

    const crawledBottom = min.y > canvas.height
    if (!this.currentMessage || crawledBottom) return this.nextMessage()
    this.crawl()
  }

  // Text itself is rendered via homebrew matterjs plugin,
  // Text bubble is rendered onto (background) canvas once separately.
  nextMessage({ x = 50, y = 50, size = DEFAULT_TEXT_SIZE, lineheight = DEFAULT_LINE_HEIGHT } = {}) {
    const { canvas, world } = this
    this.currentMessage = this.messages.pop()

    if (!this.currentMessage) return false

    // TODO: collect garbage
    this.bodies.forEach(body => World.remove(world, body))
    this.bodies = []

    getText(this.currentMessage, x, y, size, lineheight)
      .forEach(line => {
        line.forEach(body => this.bodies.push(body))
        World.add(world, line)
      })

    renderBubble(
      canvas.getContext('2d'),
      this.getTextBounds()
    )

    return true
  }

  crawl() {
    const { canvas, world } = this
    this.bodies.forEach(crawl)

    // ensure broadphase regions are updated despite text being asleep
    Composite.setModified(world, true)

    const ctx = canvas.getContext('2d')

    renderBubble(
      ctx,
      this.getTextBounds(),
      () => ctx.clearRect(0, 0, canvas.width, canvas.height)
    )
  }

  getTextBounds() {
    return getOuterBounds(
      this.bodies
        .filter(_ => _.isSleeping)
        .map(_ => _.bounds)
    )
  }
}

export default TextController
