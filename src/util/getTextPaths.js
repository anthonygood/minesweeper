import * as opentype from 'opentype.js'

const DEFAULT_FONT = '../Roboto/Roboto-Regular.ttf'
const DEFAULT_STRING = 'Firstly, we have to calculate a scale by which we'
const SECOND_STRING = 'will multiple all paths\' points, to get the actual'
const THIRD_STRING = 'point in space for the given font size.'
export const DEFAULT_SIZE = 24

let gameFont

export const getFont = () => gameFont = gameFont || new Promise((resolve, reject) => {
  opentype.load(DEFAULT_FONT, (err, font) => {
    if (err) return reject(err)
    resolve(font)
  })
})

const toPaths = (string, size, x = 80, y = 110) => font =>
  font.getPaths(string, x, y, size)

const annotateWithLetter = string => paths =>
  paths.map((path, i) => {
    path.char = string[i]
    return path
  })

const line = (string, y) =>
  getFont()
    .then(toPaths(string, DEFAULT_SIZE, 80, y))
    .then(annotateWithLetter(string))

const getTextPaths = (
  string = DEFAULT_STRING,
  size = DEFAULT_SIZE,
  font = DEFAULT_FONT
) => [
  line(DEFAULT_STRING, 110),
  line(SECOND_STRING, 132),
  line(THIRD_STRING, 154)
]

export default getTextPaths
