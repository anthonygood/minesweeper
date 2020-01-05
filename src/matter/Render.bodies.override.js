import { Render } from 'matter-js'

const defaultRenderBodies = Render.bodies

// Slightly inefficient since it iterates bodies again.
const renderBodiesWithPlugin = (_render, bodies, context) => {
  defaultRenderBodies(_render, bodies, context)
  bodies.forEach(bod =>
    bod.plugin.render && bod.plugin.render(bod, context)
  )
}

// Override Matter.Render.bodies
Render.bodies = renderBodiesWithPlugin
