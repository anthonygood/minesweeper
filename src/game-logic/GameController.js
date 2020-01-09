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

const setupCanvasAndMatterJs = canvas => {
  window.decomp = decomp // Needed by matter.js
  const { engine, render, world } = setup(canvas)

  addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
  const mouseConstraint = addMouseInteractivity(canvas, engine, world)

  return { engine, world, mouseConstraint }
}

class GameController {
  constructor(canvas, bkgCanvas) {
    // This includes setting up matter's built-in renderer and runner
    const { engine, world, mouseConstraint } = setupCanvasAndMatterJs(canvas)

    this.mouseConstraint = mouseConstraint
    const ballOriginX = CANVAS_WIDTH - percentX(50)
    const ballOriginY = CANVAS_HEIGHT - percentY(15)
    this.ball = new BallController(world, ballOriginX, ballOriginY)
    this.text = new TextController(world, bkgCanvas)

    Events.on(engine, 'afterUpdate', () => this.tick())
  }

  tick() {
    if (this.mouseConstraint.mouse.button === -1 && this.ball.readyToSling()) {
      this.ball.sling()
      setTimeout(() => this.ball.newBall(), 3000)
    }
  }
}

export default GameController
