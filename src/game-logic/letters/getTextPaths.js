import * as opentype from 'opentype.js'
const DEFAULT_FONT = '../Roboto/Roboto-Regular.ttf'

let gameFont
export let gameFontSync

export const getFont = () => gameFont = gameFont || new Promise((resolve, reject) => {
  opentype.load(DEFAULT_FONT, (err, font) => {
    if (err) return reject(err)
    gameFontSync = font
    resolve(font)
  })
})

const annotateWithLetterAndSize = (string, size) => (path, i) => {
  path.char = string[i]
  path.size = size
  return path
}

const getFontPaths = (font, string, size, x, y) =>
  font.getPaths(string, x, y, size)
    .map(annotateWithLetterAndSize(string, size))

export const lineSync = (string, size, x, y) => {
  if (!gameFontSync) throw new Error('Cannot call lineSync without loading game font first.')
  return getFontPaths(gameFontSync, string, size, x, y)
}
