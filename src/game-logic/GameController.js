import { Composite, Engine, Render } from 'matter-js'
import decomp from 'poly-decomp'
import { addWalls, setup } from '../matter'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas/sizes'
import BackgroundController from './BackgroundController'
import ParticleController from './ParticleController'
import SoundController from './SoundController'
import GameOfLife from './GameOfLife'

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
  constructor() {
    // Set up matter's built-in renderer
    window.decomp = decomp // Needed by matter.js
    window.controller = this
    this.paused = false
    this.sound = new SoundController()
  }

  async start(canvas, bkgCanvas) {
    const { engine, world } = setup(canvas)
    this.canvas = canvas
    this.bkgCanvas = bkgCanvas
    this.engine = engine
    this.world = world
    this.background = new BackgroundController(bkgCanvas, 0,0,0, 255, 231)
    // this.background = new BackgroundController(bkgCanvas, 255, 255, 231)

    this.particles = new ParticleController(world, canvas, bkgCanvas)
    this.seeds = new GameOfLife(canvas, 32)

    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
    this.registerEvents()
    this.tick()

    return this
  }

  registerEvents() {
    const { canvas } = this

    // Keyboard events
    document.addEventListener('keydown', event => this.onKeyDown(event))

    // Mouse events
    canvas.addEventListener('click', event => this.onClick(event))
    canvas.addEventListener('mouseenter', event => this.onMouseEnter(event))
    canvas.addEventListener('mousemove', event => this.onMouseMove(event))
    canvas.addEventListener('mouseleave', event => this.onMouseLeave(event))

    // Touch events
    canvas.addEventListener('touchstart', event => this.onMouseEnter(event))
    canvas.addEventListener('touchmove', event => this.onMouseMove(event))
    canvas.addEventListener('touchend', event => this.onMouseLeave(event))
  }

  tick() {
    const {
      paused,
      background,
      particles,
      seeds
    } = this

    if (!paused) {
      this.updateEngine()

      background.tick()
      particles.tick()
      seeds.tick()

      this.render()
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
    const { canvas, background, mouse, seeds, particles } = this
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    background.render()
    // particles.render()

    seeds.render(mouse)
  }

  onKeyDown({ code }) {
    if (code === 'Enter') this.seeds.start()
    if (code === 'KeyQ')  this.seeds.random()
    return code === 'Space' && this.togglePause()
  }

  onClick(e) {
    const { x, y } = e
    this.seeds.toggle(x, y)
  }

  ifNotPaused(event, fn) {
    event.preventDefault()
    if (!this.paused) fn(event)
  }

  onMouseMove(event) {
    this.ifNotPaused(event, () => {
      const { x, y } = event
      this.mouse = { x, y }
      this.sound.tune(x, y)
    })
  }

  onMouseEnter(event) {
    this.ifNotPaused(event, () => {
      const { x, y } = event
      this.sound.play(x, y)
    })
  }

  onMouseLeave() {
    this.sound.stop()
  }

  togglePause() {
    this.paused = !this.paused
    this.sound.stop()
    this.lastTick = Date.now()
  }
}

export default GameController
