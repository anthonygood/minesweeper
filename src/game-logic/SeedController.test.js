import {
  toggle,
  translateXY,
  translateGrid,
  blankBitmap
} from './SeedController'

describe('toggle', () => {
  it('switches cell on or off', () => {
    expect(
      toggle(
        [[0,0],[0,0]],
        [0,1]
      )
    ).toMatchObject([
      [0,1],
      [0,0]
    ])

    expect(
      toggle(
        [[0,0],[1,1]],
        [1,0]
      )
    ).toMatchObject([
      [0,0],
      [0,1]
    ])
  })
})

describe('translateXY', () => {
  const translate = translateXY(50)
  it('translates canvas XY to bitmap indices', () => {
    expect(
      translate(0, 0)
    ).toMatchObject([0, 0])

    expect(
      translate(25, 70)
    ).toMatchObject([0, 1])

    expect(
      translate(150, 400)
    ).toMatchObject([3, 8])
  })
})

describe('translateGrid', () => {
  const translate = translateGrid(50)
  it('translates bitmap indices to canvas XY', () => {
    expect(
      translate(0, 0)
    ).toMatchObject([0, 0])

    expect(
      translate(0, 1)
    ).toMatchObject([0, 50])

    expect(
      translate(3, 8)
    ).toMatchObject([150, 400])
  })
})

describe('blankBitmap', () => {
  it('generates 2D array of zeros for width and height', () => {
    const gridsize = 50

    expect(
      blankBitmap(gridsize, 50, 50)
    ).toMatchObject([
      [0]
    ])

    expect(
      blankBitmap(gridsize, 150, 200)
    ).toMatchObject([
      [0,0,0],
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ])

    expect(
      blankBitmap(gridsize, 400, 500)
    ).toMatchObject([
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ])
  })
})
