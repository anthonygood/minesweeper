import { Grid, Minesweeper } from 'grid-games'
import { translate } from './canvas/grid'
import withContext from './canvas/withContext'

class MinesweeperController {
  constructor(canvas, cellSize = 50) {
    this.canvas = canvas
    this.cellSize = cellSize
    this.translate = translate(cellSize)
    this.newGame()
  }

  move(x, y, restartIfDead = true) {
    const { flags, struckMines, game, translate } = this
    if (restartIfDead && struckMines.length) return this.newGame()

    const i = translate.toGrid(y)
    const j = translate.toGrid(x)

    if (i >= flags.length || flags[i][j]) return
    if (!game.move(i, j)) this.struckMines.push([translate.snapToGrid(x), translate.snapToGrid(y)])
  }

  clearRadius(x, y) {
    const { flags, translate } = this
    const i = translate.toGrid(y)
    const j = translate.toGrid(x)
    Grid.forEveryNeighbour([i, j], flags, (isFlagged, i, j) => {
      if (isFlagged) return
      this.move(
        translate.toPixel(j),
        translate.toPixel(i),
        false
      )
    })
  }

  toggleFlag({ x, y }) {
    const { game, flags, struckMines, translate } = this
    if (!flags.length || struckMines.length) return

    const i = translate.toGrid(y)
    const j = translate.toGrid(x)

    if (i >= flags.length || game.state[i][j] !== -1) return
    this.flags[i][j] = !flags[i][j]
  }

  newGame() {
    const { canvas, translate } = this
    const { width, height } = canvas
    const gWidth = translate.toGrid(width)
    const gHeight = translate.toGrid(height)
    this.struckMines = []
    this.game = new Minesweeper(gWidth, gHeight, 45)
    this.flags = Grid.blank(gWidth, gHeight, false)
  }

  render(mouse) {
    const { game, canvas } = this
    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'white'
    ctx.fillStyle = 'rgba(255,255,255,0.1)'
    ctx.font = 'bold 56px sans-serif'

    if (!game.board) {
      this.renderBlank(ctx)
    } else {
      this.renderCells(ctx)
      ctx.fillStyle = 'black'
      this.renderFog(ctx)
      ctx.fillStyle = 'blue'
      this.renderFlags(ctx)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
    }

    this.renderMouse(ctx, mouse)
    this.renderDead(ctx)
  }

  renderBlank(ctx) {
    // no-op
  }

  renderCells(ctx) {
    const { cellSize, flags, game, translate } = this
    // TODO add forEach to Grid for better semantics
    Grid.map(game.state, (value, [i,j]) => {
      const x = translate.toPixel(j)
      const y = translate.toPixel(i)

      // ctx.strokeRect(x, y, cellSize, cellSize)
      if (value > -1) ctx.fillRect(x, y, cellSize, cellSize)

      for (let i = 0; i < value; i++) {
        ctx.fillText(value, x, y + cellSize, cellSize)
      }
    })
  }

  renderFlags(ctx) {
    const { cellSize, flags, translate } = this
    Grid.map(flags, (isFlagged, [i,j]) => {
      if (!isFlagged) return

      ctx.fillRect(
        translate.toPixel(j),
        translate.toPixel(i),
        cellSize, cellSize
      )
    })
  }

  renderFog(ctx) {
    const { cellSize, game, translate } = this
    Grid.map(game.state, (value, [i,j]) => {
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

  renderDead(_ctx) {
    const { canvas, cellSize, struckMines } = this
    if (!struckMines.length) return

    withContext(canvas.getContext('2d'), ctx => {
      ctx.fillStyle = 'red'
      struckMines.forEach(([x, y]) => ctx.fillRect(x, y, cellSize, cellSize))
    })
  }
}

export default MinesweeperController
