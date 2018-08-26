import {
    Bodies,
    World
} from 'matter-js'

const addWalls = (canvasWidth, canvasHeight) => world => {
    const options = {
        isStatic: true,
        // render: { visible: false }
    }

    const wallWidth = 50

    // const [ width, height ] = [ 50, height ]

    const left = Bodies.rectangle(
        0,
        canvasHeight / 2,
        wallWidth,
        canvasHeight,
        options
    )
    const right = Bodies.rectangle(
        canvasWidth,
        canvasHeight / 2,
        wallWidth,
        canvasHeight,
        options
    )
    const top = Bodies.rectangle(
        canvasWidth / 2,
        0,
        canvasWidth,
        wallWidth,
        options
    )
    const bot = Bodies.rectangle(
        canvasWidth / 2,
        canvasHeight,
        canvasWidth,
        wallWidth,
        options
    )

    World.add(world, left)
    World.add(world, right)
    World.add(world, top)
    World.add(world, bot)
}

export default addWalls
