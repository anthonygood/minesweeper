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

    const ballOriginX = CANVAS_WIDTH - percentX(50)
    const ballOriginY = CANVAS_HEIGHT - percentY(15)
    this.ball = new BallController(world, ballOriginX, ballOriginY)
    this.text = new TextController(world, bkgCanvas)
    this.mouseConstraint = addMouseInteractivity(canvas, engine, world)
    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)

    Events.on(engine, 'afterUpdate', () => this.tick())
  }

  tick() {
    const { ball, mouseConstraint } = this
    if (mouseConstraint.mouse.button === -1 && ball.readyToSling()) {
      ball.sling()
      setTimeout(() => ball.newBall(), NEW_BALL_DELAY)
    }
  }
}

export default GameController
