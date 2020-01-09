import { Events, World } from 'matter-js'
import decomp from 'poly-decomp'

import '../../pathseg'
import { renderBubble } from '../../util/renderTextBubble'
import { percentX, percentY } from '../../util/percentXY'
import {
  addMouseInteractivity,
  addWalls,
  setup
} from '../../matter'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../canvas/sizes'
import getText from './getText'
import BallController from '../BallController'

const setupMatterJs = canvas => {
  window.decomp = decomp // Needed by matter.js
  const { engine, render, world } = setup(canvas)

  addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
  const mouseConstraint = addMouseInteractivity(canvas, engine, world)

  return { engine, render, world, mouseConstraint }
}

const createGame = async canvas => {
  const { engine, mouseConstraint, world } = setupMatterJs(canvas)

  const t = await getText()
  t.forEach(line => World.add(world, line))

  const ballOriginX = CANVAS_WIDTH - percentX(50)
  const ballOriginY = CANVAS_HEIGHT - percentY(15)
  const ball = new BallController(world, ballOriginX, ballOriginY)

  // Event for slinging the emoji from the constraint
  Events.on(engine, 'afterUpdate', () => {
    if (mouseConstraint.mouse.button === -1 && ball.readyToSling()) {
      ball.sling()
      setTimeout(() => ball.newBall(), 3000)
    }
  })

  renderBubble(
    canvas.getContext('2d'),
    percentX(60),
    percentY(20),
    percentX(10),
    percentY(10)
  )
}

export default createGame
