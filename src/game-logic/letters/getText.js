import { lineSync } from './getTextPaths'
import getBodiesFromTextPaths from './getBodiesFromTextPaths'

const getTextSync = (lines, x, y, size, lineheight) =>
  lines
    .map((line, index) => lineSync(line, size, x, y + lineheight * index))
    .map(getBodiesFromTextPaths)

export default getTextSync
