import { Render } from 'matter-js'

const defaultRenderBodies = Render.bodies

const renderWithBodyPlugin = context => body =>
  body.plugin.render && body.plugin.render(body, context)

// Slightly inefficient since it iterates bodies again.
const renderBodiesWithPlugin = (_render, bodies, context) => {
  defaultRenderBodies(_render, bodies, context)
  bodies.forEach(renderWithBodyPlugin(context))
}

// Override Matter.Render.bodies
Render.bodies = renderBodiesWithPlugin
