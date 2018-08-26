import { Bodies } from 'matter-js'

const cannonball = (x, y) => {
    return Bodies.circle(
        x,
        y,
        25,
        {
            density: 0.9,
            friction: 0.01,
            frictionAir: 0.0001,
            restitution: 0.8,
            isSleeping: true,
            render: {
                fillStyle: 'black',
                strokeStyle: 'black',
                lineWidth: 1
            }
        }
    )
}

export default cannonball
