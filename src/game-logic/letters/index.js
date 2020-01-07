import {
  Bodies,
  Constraint,
  Events,
  Vector,
  World
} from 'matter-js'
import decomp from 'poly-decomp'

import '../../pathseg'
import { renderBubble } from '../../util/renderTextBubble'
import { percentX, percentY } from '../../util/percentXY'
import {
  addMouseInteractivity,
  addWalls,
  cannonball,
  setup
} from '../../matter'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../canvas/sizes'
import getText from './getText'

const setupMatterJs = canvas => {
  window.decomp = decomp // Needed by matter.js
  const { engine, render, world } = setup(canvas)

  addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
  const mouseConstraint = addMouseInteractivity(canvas, engine, world)

  return { engine, render, world, mouseConstraint }
}

// has the player released the ball from the sling?
const haveSlung = (originX, originY) => ballConstraint => {
  const ball = ballConstraint.bodyB
  if (!ball) return false
  return ball.position.x > originX + 20 || ball.position.y < originY - 10
}

const newBall = (originX, originY, ballConstraint, world) => () => {
  const ball = cannonball(originX, originY)
  World.add(world, ball)
  ballConstraint.bodyB = ball
}

const createGame = async canvas => {
  const { engine, mouseConstraint, render, world } = setupMatterJs(canvas)

  // TODO:
  // Move ball-constraining logic somewhere else
  const ballOriginX = CANVAS_WIDTH - percentX(50)
  const ballOriginY = CANVAS_HEIGHT - percentY(15)
  const ball = cannonball(ballOriginX, ballOriginY)
  const _haveSlung = haveSlung(ballOriginX, ballOriginY)

  const ballConstraint = Constraint.create({
    pointA: Vector.clone(ball.position),
    bodyB: ball,
    stiffness: 0.1,
    length: 5,
    render: {
      visible: true,
      strokeStyle: 'black'
    }
  })
  // end ball-constraining logic

  const t = await getText()
  t.forEach(line => World.add(world, line))

  World.add(world, [ball, ballConstraint])

  // Event for slinging the emoji from the constraint
  Events.on(engine, 'afterUpdate', () => {
    if (mouseConstraint.mouse.button === -1 && _haveSlung(ballConstraint)) {
      ballConstraint.bodyB = Bodies.rectangle(
        ballOriginX,
        ballOriginY,
        10,
        20,
        { isSleeping: true }
      )

      setTimeout(
        newBall(
          ballOriginX,
          ballOriginY,
          ballConstraint,
          world
        ),
        3000
      )
    }
  })

  renderBubble(
    canvas.getContext('2d'),
    percentX(60),
    percentY(20),
    percentX(10),
    percentY(10)
  )

  // Events.on(render, 'afterRender', event => {
  //   console.assert(window.foo === true, 'after render!', event)
  //   window.foo = true
  //   renderBubble(
  //     canvas.getContext('2d'),
  //     percentX(60),
  //     percentY(20),
  //     percentX(10),
  //     percentY(10)
  //   )
  // })
}

export default createGame
