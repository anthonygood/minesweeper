import getTextPaths from './getTextPaths'
import getBodiesFromTextPaths from './getBodiesFromTextPaths'

const getText = async () => {
  const paths = await Promise.all(getTextPaths())
  return paths.map(getBodiesFromTextPaths)
}

export default getText
