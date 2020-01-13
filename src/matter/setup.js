import {
  Engine,
  Render,
  World
} from 'matter-js'

import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game-logic/canvas/sizes'

// Returns object with engine and world properties.
const setupMatterJs = canvas => {
  const ctx = canvas.getContext('2d')
  const world = World.create({
    // gravity: { scale: 0 }
  })
  const engine = Engine.create({
    timing: { timeScale: 0.75 },
    enableSleeping: true,
    world,
  })

  // Override Render.bodies to allow bodies to specify render func
  require('./Render.bodies.override')

  const render = Render.create({
    engine: engine,
    context: ctx,
    canvas,
    options: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      background: 'transparent',
      showAngleIndicator: false,
      showAxes: false,
      showCollisions: false,
      showConvexHulls: false,
      wireframes: false
    }
  })

  return { engine, render, world }
}

export default setupMatterJs
