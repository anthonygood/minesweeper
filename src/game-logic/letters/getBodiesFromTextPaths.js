import {
  Body,
  Bodies,
  Vertices
} from 'matter-js'
import { renderLetter } from '../../util/render'

const tryVerticesDirectly = 'abdegijopqA468!#&?"=±;:'
const whitelist = 'abdefgjopqtxy234580,.-_~\'|]})<>|~@$§*_'

// Uses Bodies.fromVertices which works with most letters generated from text paths.
// In some cases directly using Body.create with vertices works better.
// In others, fall back to bounding box.
const getBodyFromTextPath = path => {
  const boundingBox = path.getBoundingBox()
  const pathData = path.toPathData()
  const vertices = Vertices.fromPath(pathData)

  if (vertices.length < 1) return

  const options = {
    render: { visible: false },
    isSleeping: true,
    restitution: 0.2,
    plugin: {
      render: renderLetter,
      char: path.char,
      boundingBox
    }
  }

  const { x1, x2, y1, y2 } = boundingBox

  if (tryVerticesDirectly.includes(path.char)) return Body.create(Object.assign(
    {},
    options,
    {
      vertices,
      position: {
        x: x1 + ((x2 - x1) / 2),
        y: y1 + ((y2 - y1) / 2)
      }
    }
  ))

  if (whitelist.includes(path.char)) return Bodies.fromVertices(
    x1 + ((x2 - x1) / 2),
    y1 + ((y2 - y1) / 2),
    vertices,
    options
  )

  return Bodies.rectangle(
    x1 + (x2 - x1) / 2,
    y1 + (y2 - y1) / 2,
    x2 - x1,
    y2 - y1,
    options
  )
}

const getBodiesFromTextPaths = paths =>
  paths.map(getBodyFromTextPath).filter(_ => _) // Whitespace returns undefined

export default getBodiesFromTextPaths
