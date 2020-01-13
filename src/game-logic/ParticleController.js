import { Bodies, World } from 'matter-js'
import renderRegions from './canvas/renderRegions'

const RADIUS = 5

const sample = arr =>
  arr[Math.floor(Math.random() * arr.length)]

const between = (x, y) => {
  const upper = y - x + 1
  const rand = x + Math.random() * upper
  return Math.floor(rand)
}

const outOfBounds = (height, width, body) => {
  const { bounds: { min, max } } = body
  return Math.min(min.x, max.x, min.y, max.y) < 0 ||
    Math.max(min.x, max.x) > width ||
    Math.max(min.y, max.y) > height
}

const nTimes = n => ({ do: fn => Array.from({ length: n }).forEach(fn) })

class ParticleController {
  constructor(world, canvas, bkgCanvas, { count = 150 } = {}) {
    this.world = world

    // Assumes background canvas is same height/width
    this.canvas = canvas
    this.height = canvas.height
    this.width = canvas.width
    this.bkgCanvas = bkgCanvas

    this.particles = []
    this.count = count
  }

  tick() {
    const { count, particles } = this
    this.gc()
    if (particles.length < count) this.add()
  }

  gc() {
    const {
      height,
      width,
      particles,
      world
    } = this

    this.particles = particles.filter((particle) => {
      if (outOfBounds(height, width, particle)) {
        World.remove(world, particle)
        return false
      }
      return true
    })
  }

  spawn() {
    const {
      count,
      world,
      width,
      height
    } = this

    this.particles.forEach(particle => {
      World.remove(world, particle)
    })
    this.particles = []

    nTimes(count).do(() => {
      const particle = this.particle(
        between(0, width),
        between(0, height)
      )

      this.particles.push(particle)
      World.add(world, particle)
    })
  }

  add(
    x = between(0, this.width),
    y = between(0, this.height),
    radius = RADIUS
  ) {
    const { particles, world } = this
    const particle = this.particle(x, y, radius)
    particles.push(particle)
    World.add(world, particle)
  }

  particle(x, y, radius = RADIUS) {
    return Bodies.circle(
      x,
      y,
      radius,
      {
        density: 1,
        friction: 0.01,
        frictionAir: 0.1,
        restitution: 0.8,
        render: {
          visible: false,
        },
        plugin: {
          render: renderRegions
        }
      }
    )
  }
}

export default ParticleController
