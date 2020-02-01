import { Engine, Render } from 'matter-js'
import decomp from 'poly-decomp'
import SimplexNoise from 'simplex-noise'
import { addWalls, setup } from '../matter'
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './canvas/sizes'
import BackgroundController from './BackgroundController'
import SoundController from './SoundController'
import Minesweeper from './Minesweeper'

class GameController {
  constructor() {
    // Set up matter's built-in renderer
    window.decomp = decomp // Needed by matter.js
    window.controller = this
    this.paused = false
    this.sound = new SoundController()
    this.noise = new SimplexNoise()
  }

  async start(canvas, bkgCanvas) {
    const { world } = this.matter = setup(canvas)
    this.canvas = canvas
    this.bkgCanvas = bkgCanvas
    this.background = new BackgroundController(bkgCanvas, 0,0,0, 255, 231)
    this.minesweeper = new Minesweeper(bkgCanvas, world, this.noise)

    addWalls(CANVAS_WIDTH, CANVAS_HEIGHT, world)
    this.registerEvents()

    requestAnimationFrame(dt => this.tick(dt))

    return this
  }

  registerEvents() {
    const { canvas } = this

    // Keyboard events
    document.addEventListener('keydown', event => this.onKeyDown(event))

    // Mouse events
    canvas.addEventListener('click', event => this.onClick(event))
    canvas.addEventListener('dblclick', event => this.onDblClick(event))

    canvas.addEventListener('mouseenter', event => this.onMouseEnter(event))
    canvas.addEventListener('mousemove', event => this.onMouseMove(event))
    canvas.addEventListener('mouseleave', event => this.onMouseLeave(event))

    // Touch events
    canvas.addEventListener('touchstart', event => this.onMouseEnter(event))
    canvas.addEventListener('touchmove', event => this.onMouseMove(event))
    canvas.addEventListener('touchend', event => this.onMouseLeave(event))
  }

  tick(dt) {
    const {
      paused,
      matter: { engine },
      lastTick = Date.now()
    } = this

    if (!paused) {
      const delta = Math.min(dt - lastTick, 1000)
      this.lastTick = dt
      Engine.update(engine, delta)
      this.render(delta)
    }
    requestAnimationFrame(dt => this.tick(dt))
  }

  render(dt) {
    const {
      bkgCanvas,
      canvas,
      background,
      lastTick,
      minesweeper,
      mouse,
      matter: { render }
    } = this

    bkgCanvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    Render.world(render)

    const ctx = bkgCanvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    background.render()
    minesweeper.render(mouse, dt, lastTick)
  }

  onKeyDown({ code }) {
    if (code === 'Enter') this.seeds.start()
    if (code === 'KeyQ')  this.seeds.random()
    if (code === 'ShiftLeft' || code === 'ShiftRight') this.minesweeper.toggleFlag(this.mouse)
    return code === 'Space' && this.togglePause()
  }

  onClick({ x, y }) {
    this.minesweeper.move(x, y)
  }

  onDblClick({ x, y }) {
    this.minesweeper.clearRadius(x, y)
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
