import {
    MouseConstraint,
    World
} from 'matter-js'

const addMouseInteractivity = (canvas, engine, world) => {
    const mouseConstraint = MouseConstraint.create(engine, {
        element: canvas,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: true
            }
        }
    })

    World.add(world, mouseConstraint)

    return mouseConstraint
}

export default addMouseInteractivity
