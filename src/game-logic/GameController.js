import { Engine, Render } from 'matter-js'
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

const messages = [
  ['u ok hun??', 'lolololol jk'],
  ['wtf no way thatsnot true'],
  ['wtf srsly m88 ... wtf lol????'],
]

class GameController {
  constructor(canvas, bkgCanvas) {
    // Set up matter's built-in renderer
    window.decomp = decomp // Needed by matter.js
    const { engine, render, world } = setup(canvas)

    this.canvas = canvas
    this.engine = engine
    this.render = render
    this.world = world

    const ballOriginX = CANVAS_WIDTH - percentX(50)
    const ballOriginY = CANVAS_HEIGHT - percentY(15)
    this.ball = new BallController(world, ballOriginX, ballOriginY, NEW_BALL_DELAY)
    this.text = new TextController(world, bkgCanvas, messages)
    this.paused = false
    window.controller = this
  }

  async load() {
    await this.text.load()
  }

  async start() {
    await this.load()

    const { canvas, engine, world } = this
    this.mouseConstraint = addMouseInteractivity(canvas, engine, world)
    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)

    document.addEventListener('keydown', event => this.onKeyDown(event))

    this.tick()
  }

  tick() {
    const {
      ball,
      mouseConstraint,
      paused,
      render,
      text
    } = this

    if (!paused) {
      this.updateEngine()

      const mouseup = mouseConstraint.mouse.button === -1
      ball.tick(mouseup)
      text.tick()

      Render.world(render)
    }

    requestAnimationFrame(() => this.tick())
  }

  updateEngine() {
    const {
      engine,
      lastTick = Date.now()
    } = this
    const thisTick = Date.now()
    const delta = thisTick - lastTick
    this.lastTick = thisTick
    Engine.update(engine, delta)
  }

  onKeyDown({ code }) {
    return code === 'Space' && this.togglePause()
  }

  togglePause() {
    this.paused = !this.paused
    this.lastTick = Date.now()
  }
}

export default GameController
