const percent = size => percent =>
  Math.round(percent / 100 * size)

// TODO fixme
export const percentX = percent(window.innerWidth)
export const percentY = percent(window.innerHeight)
