import { Bodies } from 'matter-js'

const RADIUS = 12

const cannonball = (x, y, isSleeping = false) => {
  return Bodies.circle(
    x,
    y,
    RADIUS,
    {
      density: 1,
      friction: 0.01,
      frictionAir: 0.0001,
      restitution: 0.8,
      isSleeping: false,
      render: {
        sprite: {
          texture: 'rofl.png',
          xScale: .225,
          yScale: .225
        }
      }
    }
  )
}

export default cannonball
