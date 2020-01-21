import { Grid, Minesweeper } from 'grid-games'
import { translate } from './canvas/grid'

class Class {
  constructor(x, y) {
    this.x = x,
    this.y = y
  }
}

class MinesweeperController {
  constructor(canvas, cellSize = 50) {
    this.canvas = canvas
    this.cellSize = cellSize
    const { toGrid } = this.translate = translate(cellSize)

    const { width, height } = canvas
    const gWidth = toGrid(width)
    const gHeight = toGrid(height)
    // TODO: mine count logic
    //  width * height * 0.15
    this.game = new Minesweeper(gWidth, gHeight, 45)
    this.blank = Grid.blank(gWidth, gHeight)
  }

  move(x, y) {
    const i = this.translate.toGrid(y)
    const j = this.translate.toGrid(x)

    if (i >= this.blank.length) return
    this.game.move(i, j)
  }

  render(mouse) {
    const { game, canvas } = this
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'white'
    // ctx.fillStyle = 'white'
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = 'bold 56px sans-serif'

    if (!game.board) {
      this.renderBlank(ctx)
    } else {
      this.renderCells(ctx)
      ctx.fillStyle = 'black'
      this.renderFog(ctx)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
    }

    this.renderMouse(ctx, mouse)
  }

  renderBlank(ctx) {
    const { cellSize, blank, translate } = this

    // blank.forEach(
    //   (row, i) => row.forEach(
    //     (_cell, j) => ctx.strokeRect(
    //       translate.toPixel(j),
    //       translate.toPixel(i),
    //       cellSize,
    //       cellSize
    //     )
    //   )
    // )
  }

  renderCells(ctx) {
    const { cellSize, game, translate } = this
    // TODO add forEach to Grid for better semantics
    Grid.map(game.state, (value, [i,j], row, grid) => {
      const x = translate.toPixel(j)
      const y = translate.toPixel(i)

      // ctx.strokeRect(x, y, cellSize, cellSize)
      if (value > -1) ctx.fillRect(x, y, cellSize, cellSize)

      for (let i = 0; i < value; i++) {
        ctx.fillText(value, x, y + cellSize, cellSize)
      }
    })
  }

  renderFog(ctx) {
    const { cellSize, game, translate } = this
    Grid.map(game.state, (value, [i,j], row, grid) => {
      const x = translate.toPixel(j)
      const y = translate.toPixel(i)

      // ctx.strokeRect(x, y, cellSize, cellSize)
      if (value === -1) ctx.fillRect(x, y, cellSize, cellSize)
    })
  }

  renderMouse(ctx, { x, y } = {}) {
    const { cellSize, translate } = this
    if (x && y) {
      ctx.fillRect(
        translate.snapToGrid(x),
        translate.snapToGrid(y),
        cellSize, cellSize
      )
    }
  }
}

export default MinesweeperController
