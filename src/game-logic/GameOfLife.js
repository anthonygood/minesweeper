import { Grid, GameOfLife as GoL } from 'grid-games'
import SeedRenderer from './SeedRenderer'
import sample from '../util/sample'
import withContext from './canvas/withContext'
import { translate } from './canvas/grid'
import { getColour } from './canvas/shimmery'

export const toggle = (grid, [i, j]) => {
  const value = grid[i][j]
  grid[i][j] = Number(!value)
}

const seedFactory = (translate, gridSize, width, height) => {
  const blank = Grid.blank(
    translate.toGrid(width),
    translate.toGrid(height),
  )

  return Grid.map(
    blank,
    (cell, [i,j]) => new SeedRenderer(
      translate.toPixel(j),
      translate.toPixel(i),
      gridSize,
      cell
    )
  )
}

const CELL_COLOUR = `rgba(255,255,255,0.4)`

// Class for controlling interactive canvas to seed/play game of life
class GameOfLife {
  constructor(canvas, gridSize = 10) {
    this.canvas = canvas
    this.gridSize = gridSize
    this.translate = translate(gridSize)
    this.seeds = seedFactory(this.translate, gridSize, canvas.width, canvas.height)
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
    const i = this.translate.toGrid(y)
    const j = this.translate.toGrid(x)
    this.seeds[i][j].toggle()
  }

  random() {
    this.seeds.forEach(_ =>
      _.forEach(cell => sample(0,0,1) && cell.toggle())
    )
  }

  render(mouse = {}) {
    const { x, y } = mouse
    const { canvas, seeds, translate } = this

    withContext(canvas.getContext('2d'), ctx => {
      ctx.fillStyle = CELL_COLOUR
      ctx.strokeStyle = CELL_COLOUR
      ctx.lineWidth = 1

      if (x && y) {
        ctx.fillRect(
          translate.snapToGrid(x),
          translate.snapToGrid(y),
          32, 32
        )
      }

      seeds.forEach(row => row
        .filter(cell => cell.isAlive)
        .forEach(seed => seed.renderCircle(ctx))
      )
    })
  }
}

export default GameOfLife
