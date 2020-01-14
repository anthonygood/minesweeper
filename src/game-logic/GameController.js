import { Composite, Engine, Render } from 'matter-js'
import decomp from 'poly-decomp'
import { addWalls, setup } from '../matter'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas/sizes'
import BackgroundController from './BackgroundController'
import ParticleController from './ParticleController'

const applyGravityWithScale = (scale = 0.001) => body => {
  const {
    isStatic,
    isSleeping,
    plugin: { gravity: bodyOptions = {} }
  } = body

  const { scale: bodyGravityScale = 1 } = bodyOptions

  if (isStatic || isSleeping) return

  body.force.y += body.mass * (scale * bodyGravityScale)
}

const scaleGravity = (world, scale) => () =>
  Composite.allBodies(world).forEach(applyGravityWithScale(scale))

class GameController {
  constructor(canvas, bkgCanvas) {
    // Set up matter's built-in renderer
    window.decomp = decomp // Needed by matter.js
    const { engine, world } = setup(canvas)

    this.canvas = canvas
    this.bkgCanvas = bkgCanvas
    this.engine = engine
    this.world = world

    this.background = new BackgroundController(bkgCanvas, 0, 255, 231)
    this.particles = new ParticleController(world, canvas, bkgCanvas)
    this.paused = false
    window.controller = this
  }

  async start() {
    const { canvas, world } = this
    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)

    document.addEventListener('keydown', event => this.onKeyDown(event))
    canvas.addEventListener('mousemove', event => this.onMouseMove(event))

    this.tick()
  }

  tick() {
    const {
      paused,
      canvas,
      background,
      particles
    } = this

    if (!paused) {
      this.updateEngine()

      background.tick()
      particles.tick()

      this.render()

      // Render.world(render)
    }

    // setTimeout(
    //   () => this.tick(),
    //   1000 / 12
    // )

    requestAnimationFrame(() => this.tick())
  }

  updateEngine() {
    const {
      engine,
      lastTick = Date.now()
    } = this
    const thisTick = Date.now()
    const delta = Math.min(thisTick - lastTick, 1000)
    this.lastTick = thisTick
    Engine.update(engine, delta)
  }

  render() {
    const { canvas, background, particles } = this
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    background.render()
    particles.render()
  }

  onKeyDown({ code }) {
    return code === 'Space' && this.togglePause()
  }

  onMouseMove({ x, y }) {
    if (!this.paused) {
      this.particles.add(x, y)
    }
  }

  togglePause() {
    this.paused = !this.paused
    this.lastTick = Date.now()
  }
}

export default GameController
