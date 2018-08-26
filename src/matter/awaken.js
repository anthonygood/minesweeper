import { Composite } from 'matter-js'

const awaken = engine => {
    const bodies = Composite.allBodies(engine.world)

    bodies.forEach(bod => {
        if (bod.isStatic) return

        bod.isSleeping = false
    })
}

export default awaken
