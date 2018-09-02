import {
    Body,
    Bodies,
    Vertices,
    World
} from 'matter-js'
import decomp from 'poly-decomp'

import './pathseg'
import getTextPaths from './util/getTextPaths'
import renderLetter from './util/render'
import {
    addMouseInteractivity,
    addWalls,
    awaken,
    cannonball,
    setup,
    shakeScene
} from './matter'

window.decomp = decomp // Needed by matter.js

const CANVAS_WIDTH = window.innerWidth // 800
const CANVAS_HEIGHT = window.innerHeight // 600

const setupMatterJs = canvas => {
    const { engine, world } = setup(canvas)

    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
    addMouseInteractivity(canvas, engine, world)

    return { engine, world }
}

const tryVerticesDirectly = 'abdegijopqA468!#&?"=±;:'
const whitelist = 'abdefgjopqstxy234580,.-_~\'|]})<>|~@$§*_'

// Uses Bodies.fromVertices which works with most letters generated from text paths.
// In some cases directly using Body.create with vertices works better.
// In others, fall back to bounding box.
const getBodiesFromTextPaths = paths =>
    paths.map(path => {
        const boundingBox = path.getBoundingBox()
        const { x1, x2, y1, y2 } = boundingBox
        const pathData = path.toPathData()
        const vertices = Vertices.fromPath(pathData)

        if (vertices.length < 1) return

        if (tryVerticesDirectly.includes(path.char)) return Body.create({
            vertices,
            isSleeping: true,
            restitution: 0.2,
            position: {
                x: x1 + ((x2 - x1) / 2),
                y: y1 + ((y2 - y1) / 2)
            },
            plugin: {
                render: renderLetter,
                char: path.char,
                boundingBox
            }
        })

        if (whitelist.includes(path.char)) return Bodies.fromVertices(
            x1 + ((x2 - x1) / 2),
            y1 + ((y2 - y1) / 2),
            vertices,
            {
                isSleeping: true,
                restitution: 0.2,
                plugin: {
                    render: renderLetter,
                    char: path.char,
                    boundingBox
                }
            }
        )

        return Bodies.rectangle(
            x1 + (x2 - x1) / 2,
            y1 + (y2 - y1) / 2,
            x2 - x1,
            y2 - y1,
            {
                isSleeping: true,
                restitution: 0.2,
                plugin: {
                    render: renderLetter,
                    char: path.char,
                    boundingBox
                }
            }
        )
    }).filter(_ => _) // Whitespace returns undefined

const text = async () => {
    const paths = await getTextPaths()
    return getBodiesFromTextPaths(paths)
}

const draw = async canvas => {
    const { engine, world } = setupMatterJs(canvas)

    World.add(
        world,
        await text()
    )

    World.add(
        world,
        cannonball(
            CANVAS_WIDTH / 2,
            CANVAS_HEIGHT - 30
        )
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
