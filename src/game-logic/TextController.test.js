import { getBoundary } from './TextController'

describe('getBoundary', () => {
  const bodyBounds = [
    {
      min: {
        x: 80.5361328125,
        y: 121.203125
      },
      max: {
        x: 95.5830078125,
        y: 134
      }
    }
  ]

  const otherBodyBounds = [
    {
      min: {
        x: 100.8037109375,
        y: 124.490234375
      },
      max: {
        x: 113.5302734375,
        y: 134
      }
    },
    {
      min: {
        x: 118.4873046875,
        y: 121.203125
      },
      max: {
        x: 128.3837890625,
        y: 134
      }
    },
    {
      min: {
        x: 132.98046875,
        y: 122.1875
      },
      max: {
        x: 138.1572265625,
        y: 134.17578125
      }
    }
  ]

  it('returns correct bounds for array of bounds', () => {
    expect(
      getBoundary(bodyBounds)
    ).toMatchObject({
      min: {
        x: 80.5361328125,
        y: 121.203125
      },
      max: {
        x: 95.5830078125,
        y: 134
      }
    })

    expect(getBoundary(otherBodyBounds)).toMatchObject({
      min: {
        x: 100.8037109375,
        y: 121.203125,
      },
      max: {
        x: 138.1572265625,
        y: 134.17578125
      }
    })
  })

  it('works recursively for nested arrays', () => {
    expect(
      getBoundary([bodyBounds, otherBodyBounds])
    ).toMatchObject({
      min: {
        x: 80.5361328125,
        y: 121.203125
      },
      max: {
        x: 138.1572265625,
        y: 134.17578125
      }
    })
  })
})