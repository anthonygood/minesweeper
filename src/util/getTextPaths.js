import * as opentype from 'opentype.js'

const DEFAULT_FONT = '../Roboto/Roboto-Regular.ttf'
const DEFAULT_STRING = 'looooool ;))'
export const DEFAULT_SIZE = 42

export let gameFont

const getFont = () => new Promise((resolve, reject) => {
    opentype.load(DEFAULT_FONT, (err, font) => {
        if (err) return reject(err)
        gameFont = font
        resolve(font)
    })
})

const toPaths = (string, size) => font =>
    font.getPaths(string, 50, 150, size)

const annotateWithLetter = string => paths =>
    paths.map((path, i) => {
        path.char = string[i]
        return path
    })

const getTextPaths = (
    string = DEFAULT_STRING,
    size = DEFAULT_SIZE,
    font = DEFAULT_FONT
) =>
    getFont(font)
        .then(toPaths(string, size))
        .then(annotateWithLetter(string))

export default getTextPaths
