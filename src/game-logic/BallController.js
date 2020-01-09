import { Constraint, Vector, World } from 'matter-js'
import { cannonball } from '../matter'

class BallController {
  constructor(world, originX, originY) {
    this.world = world
    this.x = originX
    this.y = originY
    this.newBall()
  }

  readyToSling() {
    const { constraint, x, y } = this
    if (!constraint) return false

    const { position } = constraint.bodyB
    return position.x > x + 20 || position.y < y - 10
  }

  newBall() {
    const { world, x, y } = this
    this.clear()

    this.ball = cannonball(x, y)

    this.constraint = Constraint.create({
      pointA: Vector.clone(this.ball.position),
      bodyB: this.ball,
      stiffness: 0.1,
      length: 5,
      render: {
        visible: true,
        strokeStyle: 'black'
      }
    })

    World.add(world, [this.ball, this.constraint])
  }

  clear() {
    const { ball, constraint, world } = this
    if (ball)       World.remove(world, ball)       && delete this.ball
    if (constraint) World.remove(world, constraint) && delete this.constraint
  }

  sling() {
    const { constraint, world } = this
    World.remove(world, constraint)
    delete this.constraint
  }
}

export default BallController
