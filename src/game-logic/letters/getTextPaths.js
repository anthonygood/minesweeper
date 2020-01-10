import * as opentype from 'opentype.js'
import { DEFAULT_LINE_HEIGHT, DEFAULT_TEXT_SIZE } from '../canvas/sizes'

const DEFAULT_FONT = '../Roboto/Roboto-Regular.ttf'
const DEFAULT_STRING = 'O!M!G! OMG LMAO!!!!1'
const SECOND_STRING = 'W w T t t  Ff f ????'

let gameFont
export let gameFontSync

export const getFont = () => gameFont = gameFont || new Promise((resolve, reject) => {
  opentype.load(DEFAULT_FONT, (err, font) => {
    if (err) return reject(err)
    gameFontSync = font
    resolve(font)
  })
})

const annotateWithLetter = string => (path, i) => {
  path.char = string[i]
  return path
}

const getFontPaths = (font, string, size, x, y) =>
  font.getPaths(string, x, y, size)
    .map(annotateWithLetter(string))

const line = async (string, size, x, y) =>
  getFontPaths(await getFont(), string, size, x, y)

export const lineSync = (string, size, x, y) => {
  if (!gameFontSync) throw new Error('Cannot call lineSync without loading game font first.')
  return getFontPaths(gameFontSync, string, size, x, y)
}

// TODO: delete?
const getTextPaths = lineFn => (
  lines = [DEFAULT_STRING, SECOND_STRING],
  x = 80,
  y = 110,
  size = DEFAULT_TEXT_SIZE,
  lineheight = DEFAULT_LINE_HEIGHT
) => lines.map((text, index) => lineFn(text, size, x, y + lineheight * index))

export default getTextPaths(line)
export const getTextPathsSync = getTextPaths(lineSync)
