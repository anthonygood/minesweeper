import {
    Body,
    Common,
    Composite
} from 'matter-js'

// Copied from Matter.js examples
const shakeScene = engine => {
    const bodies = Composite.allBodies(engine.world)

    for (var i = 0; i < bodies.length; i++) {
        const body = bodies[i]

        if (!body.isStatic) {
            const forceMagnitude = 0.02 * body.mass

            body.isSleeping = false
            body.torque = 0.25

            Body.applyForce(body, body.position, {
                x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                y: -forceMagnitude + Common.random() * -forceMagnitude,
                torque: 0.2
            })
        }
    }
}

export default shakeScene
