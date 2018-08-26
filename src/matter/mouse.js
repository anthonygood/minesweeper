import {
    MouseConstraint,
    World
} from 'matter-js'

const addMouseInteractivity = (canvas, engine, world) => {
    const mouseConstraint = MouseConstraint.create(engine, {
        element: canvas,
        constraint: {
            stiffness: 0.9,
            render: {
                visible: true
            }
        }
    })

    World.add(world, mouseConstraint)
}

export default addMouseInteractivity
