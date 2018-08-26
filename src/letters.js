import {
    Bodies,
    Body,
    Composite,
    Common,
    Engine,
    MouseConstraint,
    Svg,
    Render,
    Runner,
    Vertices,
    World
} from 'matter-js'

import './pathseg'
import getTextPaths from './util/getTextPaths'
import _addWalls from './matter/addWalls'
import setup from './matter/setup'
import addMouseInteractivity from './matter/mouse'
import awaken from './matter/awaken'
import shakeScene from './matter/shakeScene'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600

const addWalls = _addWalls(
    CANVAS_WIDTH,
    CANVAS_HEIGHT
)

const setupMatterJs = canvas => {
    const { engine, world } = setup(canvas)

    addWalls(world)
    addMouseInteractivity(canvas, engine, world)

    return { engine, world }
}

const getBodiesFromTextPaths = paths =>
    paths.map(path => {
        const { x1, x2, y1, y2 } = path.getBoundingBox()
        const pathData = path.toPathData()
        const vertices = Vertices.fromPath(pathData)

        const body = vertices[0] && Body.create({
            vertices,
            isSleeping: true,
            position: {
                x: x1 + ((x2 - x1) / 2),
                y: y1 + ((y2 - y1) / 2)
            }
        })

        return body
    }).filter(_ => _) // Whitespace returns undefined

const text = async () => {
    const paths = await getTextPaths()
    return getBodiesFromTextPaths(paths)
}

const cannonBall = () => {
    return Bodies.circle(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - 30,
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

const draw = async canvas => {
    const { engine, world } = setupMatterJs(canvas)

    World.add(
        world,
        await text()
    )

    World.add(
        world,
        cannonBall()
    )

    // setTimeout(
    //     shakeScene.bind(null, engine),
    //     2000
    // )

    setTimeout(
        awaken.bind(null, engine),
        2000
    )
}

export default draw
