import { Grid, Minesweeper } from 'grid-games'
import { translate } from './canvas/grid'
import withContext from './canvas/withContext'
import { Body, Bodies, World } from 'matter-js'

class MinesweeperController {
  constructor(mainCanvas, world, cellSize = 50) {
    this.bodies = []
    this.canvas = mainCanvas
    this.cellSize = cellSize
    this.world = world
    this.translate = translate(cellSize)
    this.newGame()
  }

  isComplete() {
    const { game } = this
    const { state, mineCount } = game
    const unswept = Grid
      .flatten(state)
      .filter(value => value === -1)
      .reduce((a, b) => a + b)

    return -mineCount === unswept
  }

  move(x, y, restartIfDead = true) {
    const { flags, struckMines, game, translate } = this
    if (restartIfDead && struckMines.length) return this.newGame()

    const i = translate.toGrid(y)
    const j = translate.toGrid(x)

    if (i >= flags.length || flags[i][j]) return
    if (!game.move(i, j)) return this.killPlayer(x, y)
    if (this.isComplete()) console.log('finissed')
  }

  killPlayer(x, y) {
    const { translate } = this
    this.struckMines.push([translate.snapToGrid(x), translate.snapToGrid(y)])
    this.explode(x, y)
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
    if (!game.board || struckMines.length) return

    const i = translate.toGrid(y)
    const j = translate.toGrid(x)

    if (i >= flags.length || game.state[i][j] !== -1) return
    this.flags[i][j] = !flags[i][j]
  }

  newGame() {
    const { bodies, canvas, translate, world } = this
    const { width, height } = canvas
    const gWidth = translate.toGrid(width)
    const gHeight = translate.toGrid(height)
    this.struckMines = []
    this.game = new Minesweeper(gWidth, gHeight, 45)
    this.flags = Grid.blank(gWidth, gHeight, false)
    World.remove(world, bodies)
  }

  isDead() {
    return !!this.struckMines.length
  }

  render(mouse) {
    const { game, canvas } = this
    withContext(canvas.getContext('2d'), ctx => {
      ctx.strokeStyle = 'white'
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.font = 'bold 56px sans-serif'

      if (!game.board) {
        this.renderBlank(ctx)
      } else {
        // TODO: render board once on background?
        this.renderCells(ctx)
        ctx.fillStyle = 'black'
        this.isDead() ? this.renderMines(ctx) : this.renderFog(ctx)

        this.renderFlags(ctx)
        ctx.fillStyle = 'rgba(255,255,255,0.2)'
      }

      this.renderMouse(ctx, mouse)
      this.renderDead(ctx)
    })
  }

  renderBlank(ctx) {
    // no-op
  }

  renderCells(ctx) {
    const { cellSize, flags, game, translate } = this
    // const board = this.isDead() ? game.board : game.state
    Grid.forEach(game.board, (value, [i,j]) => {
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
    ctx.fillStyle = 'blue'
    Grid.map(flags, (isFlagged, [i,j]) => {
      if (!isFlagged) return

      ctx.fillRect(
        translate.toPixel(j),
        translate.toPixel(i),
        cellSize, cellSize
      )
    })
  }

  renderMines(ctx) {
    const { cellSize, game, translate } = this
    ctx.strokeStyle = 'red'
    Grid.forEach(game.board, (value, [i,j]) => {
      if (value !== 'x') return
      const x = translate.toPixel(j)
      const y = translate.toPixel(i)
      ctx.strokeRect(x, y, cellSize, cellSize)
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

  renderDead(ctx) {
    const { cellSize, struckMines } = this
    if (!struckMines.length) return

    ctx.fillStyle = 'red'
    struckMines.forEach(([x, y]) => ctx.fillRect(x, y, cellSize, cellSize))
  }

  explode(deadX, deadY) {
    const { canvas, cellSize, game, translate, world } = this
    const { width, height } = canvas

    const group = Body.nextGroup(true)
    const bodies = []
    withContext(canvas.getContext('2d'), ctx => {
      Grid.forEach(game.state, (cell, [i,j]) => {
        if (cell !== -1) return

        const x = translate.toPixel(j)
        const y = translate.toPixel(i)

        const body = Bodies.rectangle(x, y, cellSize, cellSize, {
          // collisionFilter: { group },
          render: { fillStyle: 'black' }
        })

        const ratioX = x / width
        const ratioY = y / height
        Body.applyForce(body, { x: deadX, y: deadY }, { x: ratioX / 10, y: ratioY / 10 })

        bodies.push(body)
      })
    })

    World.add(world, bodies)
    this.bodies = bodies // for garbage collection
  }
}

export default MinesweeperController
