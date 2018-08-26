import * as opentype from 'opentype.js'

const DEFAULT_FONT = '../Roboto/Roboto-Bold.ttf'
const DEFAULT_STRING = 'abcdefghijklmnopqrstuvwxyz'
const DEFAULT_SIZE = 48

const getFont = font => new Promise((resolve, reject) => {
    opentype.load(font, (err, font) => {
        if (err) return reject(err)
        resolve(font)
    })
})

const toPaths = (string, size) => font =>
    font.getPaths(string, 50, 150, size)

const getTextPaths = (
    string = DEFAULT_STRING,
    size = DEFAULT_SIZE,
    font = DEFAULT_FONT
) =>
    getFont(font)
        .then(toPaths(string, size))

export default getTextPaths
