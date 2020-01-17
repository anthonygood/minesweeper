import { tick } from 'game-of-life'
import SeedRenderer from './SeedRenderer'
import sample from '../util/sample'

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

export const blankBitmap = (gridSize, width, height) => {
  const [i, j] = translateXY(gridSize)(width, height)
  return Array.from({ length: j + 1 })
    .fill(null)
    .map(() => Array.from({ length: i + 1 }).fill(0))
}

const seedFactory = (translate, gridSize, width, height) =>
  blankBitmap(gridSize, width, height).map((row, y) =>
    row.map((cell, x) => new SeedRenderer(...translate(x, y), gridSize, cell))
  )

// Class for controlling interactive canvas to seed/play game of life
class GameOfLife {
  constructor(canvas, gridSize = 30) {
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
    tick(
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

  render() {
    const { canvas, seeds } = this
    const ctx = canvas.getContext('2d')
    seeds.forEach(row => row.forEach(seed => seed.render(ctx)))
  }
}

export default GameOfLife
