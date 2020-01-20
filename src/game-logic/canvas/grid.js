const toGrid = (cellSize, xOrY) => Math.floor(xOrY / cellSize)
const toPixel = (cellSize, index) => cellSize * index

export const translate = cellSize => ({
  toGrid:     xOrY  => toGrid(cellSize, xOrY),
  toPixel:    index => toPixel(cellSize, index),
  snapToGrid: xOrY  => toPixel(cellSize, toGrid(cellSize, xOrY))
})
