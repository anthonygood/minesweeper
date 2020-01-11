import { Events } from 'matter-js'
import decomp from 'poly-decomp'
import {
  addMouseInteractivity,
  addWalls,
  setup
} from '../matter'
import { percentX, percentY } from '../util/percentXY'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas/sizes'
import BallController from './BallController'
import TextController from './TextController'

const NEW_BALL_DELAY = 3000

class GameController {
  constructor(canvas, bkgCanvas) {
    // Set up matter's built-in renderer and runner
    window.decomp = decomp // Needed by matter.js
    const { engine, world } = setup(canvas)

    this.engine = engine
    this.world = world

    const ballOriginX = CANVAS_WIDTH - percentX(50)
    const ballOriginY = CANVAS_HEIGHT - percentY(15)
    this.ball = new BallController(world, ballOriginX, ballOriginY, NEW_BALL_DELAY)
    this.text = new TextController(world, bkgCanvas)
  }

  async load() {
    await this.text.load()
  }

  async start() {
    await this.load()

    const { canvas, engine, world } = this
    this.mouseConstraint = addMouseInteractivity(canvas, engine, world)
    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
    Events.on(engine, 'afterUpdate', () => this.tick())

    this.text.render({ lines: ['I am foo lord', 'I am king', 'I am gest', 'lol'], x: 50, y: 150, size: 24, lineheight: 36 })
  }

  tick() {
    const { ball, mouseConstraint, text } = this
    const mouseup = mouseConstraint.mouse.button === -1
    ball.tick(mouseup)
    text.tick()
  }
}

export default GameController
