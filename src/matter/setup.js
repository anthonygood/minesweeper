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

    world.gravity.y = 0.05

    return { engine, world }
}

export default setupMatterJs
