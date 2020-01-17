import between from '../../util/between'
import upDown from '../../util/upDown'

export const randomSize = (lower = 48, upper = 56) => between(lower, upper)
export const randomOpacity = (lower = 0, upper = 10) => between(lower, upper) / 10

export const getColour = (opacity = randomOpacity()) =>
  `rgba(255,255,255,${opacity})`

export const newOpacity = (opacity, min = 0.25, max = 3) => {
  const val = upDown(opacity * 100) / 100

  return Math.min(
    Math.max(val, min / 10),
    max / 10
  )
}
