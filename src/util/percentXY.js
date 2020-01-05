import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game-logic/canvas/sizes'

const percent = size => percent =>
  Math.round(percent / 100 * size)

export const percentX = percent(CANVAS_WIDTH)
export const percentY = percent(CANVAS_HEIGHT)
