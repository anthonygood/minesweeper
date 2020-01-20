import { Grid, GameOfLife as GoL } from 'grid-games'
import SeedRenderer from './SeedRenderer'
import sample from '../util/sample'
import withContext from './canvas/withContext'
import { getColour } from './canvas/shimmery'

export const toggle = (bitmap, [i, j]) => {
  const copy = [].concat(bitmap)
  const value = bitmap[i][j]
  copy[i][j] = Number(!value)
  return copy
}

export const translateXY = size => (x, y) => [
  Math.floor(x / size),
  Math.floor(y / size)
]

export const translateGrid = size => (i, j) => [
  i * size,
  j * size
]

const seedFactory = (translate, gridSize, width, height) =>
  Grid.map(
    Grid.blank(...translateXY(gridSize)(width, height)),
    (cell, [i,j]) => new SeedRenderer(...translate(j, i), gridSize, cell)
  )

const CELL_COLOUR = `rgba(255,255,255,0.4)`
// Class for controlling interactive canvas to seed/play game of life
class GameOfLife {
  constructor(canvas, gridSize = 10) {
    this.canvas = canvas
    this.gridSize = gridSize
    this.translateXY = translateXY(gridSize)
    this.translateGrid = translateGrid(gridSize)
    this.seeds = seedFactory(this.translateGrid, gridSize, canvas.width, canvas.height)
    this.inProgress = false
  }

  start() {
    this.inProgress = true
  }

  tick() {
    const { inProgress, seeds } = this
    if (inProgress) this.update()
    seeds.forEach(row => row.forEach(seed => seed.mutate()))

    // TODO: case where grid reaches stasis (ie. some survivors)
    if (inProgress && !seeds.some(row => row.some(cell => cell.isAlive))) {
      this.inProgress = false
    }
  }

  update() {
    const { seeds } = this
    GoL.tick(
      seeds.map(row => row.map(cell => Number(cell.isAlive)))
    ).forEach((row, i) => row.forEach((cell, j) => {
      seeds[i][j].tick(cell)
    }))
  }

  toggle(x, y) {
    const [j, i] = this.translateXY(x, y)
    this.seeds[i][j].toggle()
  }

  random() {
    this.seeds.forEach(_ =>
      _.forEach(cell => sample(0,0,1) && cell.toggle())
    )
  }

  render(mouse = {}) {
    const { x, y } = mouse
    const { canvas, seeds } = this

    withContext(canvas.getContext('2d'), ctx => {
      ctx.fillStyle = CELL_COLOUR
      ctx.strokeStyle = CELL_COLOUR
      ctx.lineWidth = 1

      if (x && y) {
        const [j, i] = this.translateXY(x, y)
        ctx.fillRect(...this.translateGrid(j, i), 32, 32)
      }

      seeds.forEach(row => row
        .filter(cell => cell.isAlive)
        .forEach(seed => seed.renderCircle(ctx))
      )
    })
  }
}

export default GameOfLife
