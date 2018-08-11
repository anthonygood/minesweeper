import * as opentype from 'opentype.js'
import {
    Composite,
    Common,
    Engine,
    Render,
    Runner,
    Vertices,
    World,
    Body
} from 'matter-js'

import './pathseg'

// Returns World object
const setupMatterJs = canvas => {
    const ctx = canvas.getContext('2d')
    const engine = Engine.create()
    const world = engine.world

    const render = Render.create({
        engine: engine,
        context: ctx,
        canvas,
        options: {
            width: 800,
            height: 600,
            background: 'white',
            showAxes: true,
            showCollisions: true,
            showConvexHulls: true,
            wireframes: false
        }
    })

    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)

    return { engine, world }
}

const getBodiesFromTextPaths = paths =>
    paths.map((path, i) => {
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

// Copied from Matter.js examples
var shakeScene = function(engine) {
    var bodies = Composite.allBodies(engine.world);

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i]

        if (!body.isStatic) {
            var forceMagnitude = 0.02 * body.mass

            body.isSleeping = false
            body.torque = 0.25

            Body.applyForce(body, body.position, {
                x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                y: -forceMagnitude + Common.random() * -forceMagnitude,
                torque: 0.2
            });
        }
    }
};

const draw = canvas => {
    const { engine, world } = setupMatterJs(canvas)

    opentype.load('../Roboto/Roboto-Regular.ttf', (err, font) => {
        if (err) return console.error('Font could not be loaded: ' + err);

        // Construct a Path object containing the letter shapes of the given text.
        // The other parameters are x, y and fontSize.
        // Note that y is the position of the baseline.
        const str = 'Hello, World'
        const paths = font.getPaths(str, 100, 250, 24)
        const bodies = getBodiesFromTextPaths(paths)

        World.add(
            world,
            bodies
        )
    })

    setTimeout(
        shakeScene.bind(null, engine),
        2000
    )
}

export default draw
