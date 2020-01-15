import { Bodies, World } from 'matter-js'
import between from '../util/between'
import ParticleRenderer from './ParticleRenderer'

const RADIUS = 5

const outOfBounds = (height, width, body) => {
  const { bounds: { min, max } } = body
  return Math.min(min.x, max.x, min.y, max.y) < 0 ||
    Math.max(min.x, max.x) > width ||
    Math.max(min.y, max.y) > height
}

const nTimes = n => ({ do: fn => Array.from({ length: n }).forEach(fn) })

class ParticleController {
  constructor(world, canvas, bkgCanvas, { count = 50 } = {}) {
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
    this.gc()
    this.spawn()
    this.particles.forEach(particle => particle.mutate())
  }

  render() {
    const { canvas, particles } = this
    const context = canvas.getContext('2d')
    particles.forEach(particle => particle.render(context))
  }

  gc() {
    const {
      height,
      width,
      particles,
      world
    } = this

    this.particles = particles.filter(({ particle }) => {
      if (outOfBounds(height, width, particle)) {
        World.remove(world, particle)
        return false
      }
      return true
    })
  }

  spawn() {
    const { count, particles } = this
    nTimes(count - particles.length).do(() => this.add())
  }

  add(
    x = between(0, this.width),
    y = between(0, this.height),
    radius = RADIUS
  ) {
    const { particles, world } = this
    const particle = this.particle(x, y, radius)
    const renderer = new ParticleRenderer(particle)
    particles.push(renderer)
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
      }
    )
  }
}

export default ParticleController
