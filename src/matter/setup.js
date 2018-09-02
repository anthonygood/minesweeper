import {
    Engine,
    Render,
    Runner
} from 'matter-js'

// Returns object with engine and world properties.
const setupMatterJs = canvas => {
    const ctx = canvas.getContext('2d')
    const engine = Engine.create()
    const world = engine.world

    // Override Render.bodies to allow bodies to specify render func
    require('./Render.bodies.override')

    const renderOptions = Render.create({
        engine: engine,
        context: ctx,
        canvas,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            background: 'white',
            showAngleIndicator: true,
            showAxes: true,
            showCollisions: true,
            showConvexHulls: true,
            wireframes: false
        }
    })
    Render.run(renderOptions)

    const runner = Runner.create()
    Runner.run(runner, engine)

    // const render = _render.bind(null, world, canvas, ctx)

    // world.gravity.y = 0.25

    return { engine, world }
}

export default setupMatterJs
