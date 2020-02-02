import { Grid, Minesweeper } from 'grid-games'
import { translate } from './canvas/grid'
import nTimes from '../util/nTimes'
import withContext from './canvas/withContext'
import { Body, Bodies, Vector, World } from 'matter-js'

const COLOUR = 'cyan'
const FLAG = 'rgb(255,100,200)'
const DANGER = 'white'

const font = cellSize => `bold ${cellSize * 1.12}px sans-serif`

class MinesweeperController {
  constructor(mainCanvas, world, noise, cellSize = 50) {
    this.bodies = []
    this.canvas = mainCanvas
    this.cellSize = cellSize
    this.noise = noise
    this.world = world
    this.translate = translate(cellSize)
    this.increment = 0
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
    if (this.isComplete()) console.log('finissed') // TODO
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
    const gWidth = translate.toGrid(width) + 1
    const gHeight = translate.toGrid(height) + 1
    this.struckMines = []
    const defaultMines = Math.floor((gWidth * gHeight) / 5)
    this.game = new Minesweeper(gWidth, gHeight, defaultMines)
    this.flags = Grid.blank(gWidth, gHeight, false)
    bodies.forEach(body => World.remove(world, body))
  }

  isDead() {
    return !!this.struckMines.length
  }

  render(mouse, dt) {
    const { cellSize, game, canvas } = this

    withContext(canvas.getContext('2d'), ctx => {
      ctx.strokeStyle = COLOUR
      ctx.fillStyle = COLOUR
      ctx.font = font(cellSize)

      if (!game.board) {
        this.renderBlank(ctx)
      } else {
        this.renderCells(ctx, dt)
        this.renderCounts(ctx)
        this.isDead() ? this.renderMines(ctx) : this.renderFog(ctx)

        this.renderFlags(ctx)
      }

      ctx.globalAlpha = 0.5

      this.renderMouse(ctx, mouse)
      this.renderDead(ctx)
    })
  }

  renderBlank(ctx) {
    const { canvas: { height, width } } = this
    withContext(ctx, ctx => {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
    })
  }

  renderCells(ctx, dt) {
    this.increment += dt / 1000
    const { cellSize, game, increment, noise, translate } = this
    const board = this.isDead() ? game.board : game.state
    Grid.forEach(board, (value, [i,j]) => {
      const x = translate.toPixel(j)
      const y = translate.toPixel(i)
      const n = noise.noise3D(x, y, increment)
      const between0and1 = (n + 1) / 2
      const opacity = 0.725 + (between0and1 * .15)
      ctx.globalAlpha = opacity

      if (value > -1) {
        ctx.fillRect(x, y, cellSize, cellSize)
        ctx.strokeRect(x, y, cellSize, cellSize)
      }
    })
  }

  renderCounts(ctx) {
    const { cellSize, game, translate } = this
    const board = this.isDead() ? game.board : game.state
    withContext(ctx, ctx => {
      ctx.fillStyle = 'white'
      ctx.globalAlpha = 0.3

      Grid.forEach(board, (value, [i,j]) => {
        if (value === -1) return
        const x = translate.toPixel(j)
        const y = translate.toPixel(i)

        nTimes(value).do(
          () => ctx.fillText(value, x, y + cellSize, cellSize)
        )
      })
    })
  }

  renderFlags(ctx) {
    const { cellSize, flags, translate } = this
    withContext(ctx, ctx => {
      ctx.fillStyle = FLAG
      ctx.globalAlpha = 0.9
      Grid.map(flags, (isFlagged, [i,j]) => {
        if (!isFlagged) return

        ctx.fillRect(
          translate.toPixel(j),
          translate.toPixel(i),
          cellSize, cellSize
        )
      })
    })
  }

  renderMines(ctx) {
    const { cellSize, game, translate } = this
    withContext(ctx, ctx => {
      ctx.globalAlpha = 1
      ctx.strokeStyle = DANGER
      Grid.forEach(game.board, (value, [i,j]) => {
        if (value !== 'x') return
        const x = translate.toPixel(j)
        const y = translate.toPixel(i)
        ctx.fillRect(x, y, cellSize, cellSize)
      })
    })
  }

  renderFog(ctx) {
    const { cellSize, game, translate } = this
    withContext(ctx, ctx => {
      ctx.fillStyle = 'white'
      ctx.globalAlpha = 1
      Grid.map(game.state, (value, [i,j]) => {
        if (value !== -1) return
        const x = translate.toPixel(j)
        const y = translate.toPixel(i)

        ctx.fillRect(x, y, cellSize, cellSize)
      })
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

    ctx.globalAlpha = 1
    ctx.fillStyle = DANGER
    struckMines.forEach(([x, y]) => ctx.fillRect(x, y, cellSize, cellSize))
  }

  explode(deadX, deadY) {
    const { cellSize, game, translate, world } = this
    const bodies = []

    const inBlastzone = (i, j, i2, j2) => (blastRadius = 4) =>
      (i2 > i - blastRadius && i2 < i + blastRadius) &&
      (j2 > j - blastRadius && j2 < j + blastRadius)

    Grid.forEach(game.state, (cell, [i,j]) => {
      if (cell !== -1) return

      const struckMineI = translate.toGrid(deadY)
      const struckMineJ = translate.toGrid(deadX)

      if (i === struckMineI && j === struckMineJ) return

      const x = translate.toPixel(j)
      const y = translate.toPixel(i)

      const body = Bodies.rectangle(x + cellSize / 2, y + cellSize / 2, cellSize, cellSize, {
        render: { fillStyle: 'white' },
      })

      bodies.push(body)

      const blastzone = inBlastzone(struckMineI, struckMineJ, i, j)

      if (blastzone(6)) {
        const deltaV  = Vector.sub({ x: deadX, y: deadY }, body.position)
        const normalV = Vector.normalise(deltaV)
        const suck    = Vector.div(normalV, 15)
        const blow    = Vector.mult(Vector.neg(suck), 3)

        if (blastzone(4)) {
          Body.applyForce(body, { x: deadX, y: deadY }, suck)
          setTimeout(
            () => Body.applyForce(body, { x: deadX, y: deadY }, blow),
            150
          )
        }

        setTimeout(
          () => Body.applyForce(body, { x: deadX, y: deadY }, blow),
          1500
        )
      }
    })

    World.add(world, bodies)
    this.bodies = bodies // for garbage collection
  }
}

export default MinesweeperController
