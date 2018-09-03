import { Bodies } from 'matter-js'

const RADIUS = 25

const cannonball = (x, y) => {
    return Bodies.circle(
        x,
        y,
        RADIUS,
        {
            density: 0.9,
            friction: 0.01,
            frictionAir: 0.0001,
            restitution: 0.8,
            isSleeping: true,
            render: {
                sprite: {
                    texture: 'rofl.png',
                    xScale: .35,
                    yScale: .35
                }
            }
        }
    )
}

export default cannonball
