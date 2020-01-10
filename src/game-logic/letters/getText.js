import getTextPaths, { getTextPathsSync, lineSync } from './getTextPaths'
import getBodiesFromTextPaths from './getBodiesFromTextPaths'

// TODO: delete
const getText = async () => {
  const paths = await Promise.all(getTextPaths())
  return paths.map(getBodiesFromTextPaths)
}

export const getTextSync = (lines, x, y, size, lineheight) =>
  lines
    .map((line, index) => lineSync(line, size, x, y + lineheight * index))
    .map(getBodiesFromTextPaths)

export default getText
