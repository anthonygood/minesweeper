const between = (x, y) => {
  const upper = y - x + 1
  const rand = x + Math.random() * upper
  return Math.floor(rand)
}

export default between
