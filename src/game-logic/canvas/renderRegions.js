import withContext from './withContext'

// NB. this is the engine default but can be changed.
const BUCKET_SIZE = 48
const REGION_COLOUR = 'rgba(255,255,255,0.25)'

const renderRegions = (body, context) => {
  if (!body.region) return

  const {
    startCol,
    endCol,
    startRow,
    endRow
  } = body.region

  withContext(context, ctx => {
    ctx.fillStyle = REGION_COLOUR
    ctx.fillRect(
      BUCKET_SIZE * startCol,
      BUCKET_SIZE * startRow,
      BUCKET_SIZE + BUCKET_SIZE * (endCol - startCol),
      BUCKET_SIZE + BUCKET_SIZE * (endRow - startRow)
    )
  })
}

export default renderRegions