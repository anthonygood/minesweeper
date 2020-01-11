import {
  Body,
  Bodies,
  Vertices
} from 'matter-js'
import { renderLetter } from './render'

const tryVerticesDirectly = 'abdegijopqA468!#&?"=±;:'
const whitelist = 'abdegjopqxy234580,.-_~\'|]})<>|~@$§*_'

// Uses Bodies.fromVertices which works with some letters generated from text paths.
// In some cases directly using Body.create with vertices works better.
// In others, fall back to bounding box.
const getBodyFromTextPath = path => {
  const boundingBox = path.getBoundingBox()
  const pathData = path.toPathData()
  const vertices = Vertices.fromPath(pathData)

  if (vertices.length < 1) return

  const options = {
    render: { visible: false },
    // angle: 1,
    isSleeping: true,
    restitution: 0.2,
    plugin: {
      render: renderLetter,
      char: path.char,
      size: path.size,
      path
    }
  }

  const { x1, x2, y1, y2 } = boundingBox
  const x = x1 + ((x2 - x1) / 2)
  const y = y1 + ((y2 - y1) / 2)

  if (tryVerticesDirectly.includes(path.char)) return Body.create({
    ...options,
    vertices,
    position: { x, y }
  })

  if (whitelist.includes(path.char)) return Bodies.fromVertices(
    x, y,
    vertices,
    options
  )

  return Bodies.rectangle(
    x, y,
    x2 - x1,
    y2 - y1,
    options
  )
}

const getBodiesFromTextPaths = paths =>
  paths.map(getBodyFromTextPath).filter(_ => _) // Whitespace returns undefined

export default getBodiesFromTextPaths
