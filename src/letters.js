import {
    Body,
    Bodies,
    Constraint,
    Events,
    Vector,
    Vertices,
    World
} from 'matter-js'
import decomp from 'poly-decomp'

import './pathseg'
import getTextPaths from './util/getTextPaths'
import { renderLetter } from './util/render'
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
    const mouseConstraint = addMouseInteractivity(canvas, engine, world)

    return { engine, world, mouseConstraint }
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

        const options = {
            // render: { visible: false },
            isSleeping: true,
            restitution: 0.2,
            plugin: {
                render: renderLetter,
                char: path.char,
                boundingBox
            }
        }

        if (tryVerticesDirectly.includes(path.char)) return Body.create(Object.assign(
            {},
            options,
            {
                vertices,
                position: {
                    x: x1 + ((x2 - x1) / 2),
                    y: y1 + ((y2 - y1) / 2)
                }
            }
        ))

        if (whitelist.includes(path.char)) return Bodies.fromVertices(
            x1 + ((x2 - x1) / 2),
            y1 + ((y2 - y1) / 2),
            vertices,
            options
        )

        return Bodies.rectangle(
            x1 + (x2 - x1) / 2,
            y1 + (y2 - y1) / 2,
            x2 - x1,
            y2 - y1,
            options
        )
    }).filter(_ => _) // Whitespace returns undefined

const text = async () => {
    const paths = await getTextPaths()
    return getBodiesFromTextPaths(paths)
}

// has the player released the ball from the sling?
const haveSlung = (originX, originY) => ballConstraint => {
    const ball = ballConstraint.bodyB
    if (!ball) return false
    return ball.position.x > originX + 20 || ball.position.y < originY - 10
}

const newBalls = (originX, originY, ballConstraint, world) => () => {
    const newBall = cannonball(
        originX,
        originY
    )
    World.add(world, newBall)
    ballConstraint.bodyB = newBall
}

const createGame = async canvas => {
    const { engine, mouseConstraint, world } = setupMatterJs(canvas)

    // TODO:
    // Move ball-constraining logic somewhere else
    const ballOriginX = CANVAS_WIDTH / 2
    const ballOriginY = CANVAS_HEIGHT - 150
    const ball = cannonball(
        ballOriginX,
        ballOriginY
    )
    const ballConstraint = Constraint.create({
        pointA: Vector.clone(ball.position),
        bodyB: ball,
        stiffness: 0.1,
        length: 5,
        render: {
            visible: true,
            strokeStyle: 'black'
        }
    })
    const _haveSlung = haveSlung(
        ballOriginX,
        ballOriginY
    )
    // end ball-constraining logic

    World.add(
        world,
        await text()
    )

    World.add(
        world,
        [
            ball,
            ballConstraint
        ]
    )

    // Event for slinging the emoji from the constraint
    Events.on(engine, 'afterUpdate', () => {
        if (mouseConstraint.mouse.button === -1 && _haveSlung(ballConstraint)) {
            ballConstraint.bodyB = Bodies.rectangle(
                ballOriginX,
                ballOriginY,
                10,
                20,
                {
                    isSleeping: true
                }
            )

            setTimeout(
                newBalls(
                    ballOriginX,
                    ballOriginY,
                    ballConstraint,
                    world
                ),
                3000
            )
        }
    })

    // setTimeout(
    //     shakeScene.bind(null, engine),
    //     2000
    // )

    // setTimeout(
    //     awaken.bind(null, engine),
    //     2000
    // )
}

export default createGame
