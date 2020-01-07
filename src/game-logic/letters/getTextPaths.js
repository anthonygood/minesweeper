import * as opentype from 'opentype.js'
import { DEFAULT_LINE_HEIGHT, DEFAULT_TEXT_SIZE } from '../canvas/sizes'

const DEFAULT_FONT = '../Roboto/Roboto-Regular.ttf'
const DEFAULT_STRING = 'O!M!G! OMG LMAO!!!!1'
const SECOND_STRING = 'W w T t t  Ff f ????'

let gameFont

export const getFont = () => gameFont = gameFont || new Promise((resolve, reject) => {
  opentype.load(DEFAULT_FONT, (err, font) => err ? reject(err) : resolve(font))
})

const toPaths = (string, size, x = 80, y = 110) => font =>
  font.getPaths(string, x, y, size)

const annotateWithLetter = string => paths =>
  paths.map((path, i) => {
    path.char = string[i]
    return path
  })

const line = (string, size, y) =>
  getFont()
    .then(toPaths(string, size, 80, y))
    .then(annotateWithLetter(string))

const getTextPaths = (
  lines = [DEFAULT_STRING, SECOND_STRING],
  size = DEFAULT_TEXT_SIZE,
  y = 110,
  lineheight = DEFAULT_LINE_HEIGHT
) => lines.map((text, index) => line(text, size, y + lineheight * index))

export default getTextPaths
