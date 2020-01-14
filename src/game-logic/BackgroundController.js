const sample = (...vals) =>
  vals[Math.floor(Math.random() * vals.length)]

const upDown = val => val + sample(1, -1)

const rgb = (r, g, b) => `rgb(${r},${g},${b})`

class BackgroundController {
  constructor(canvas, r, g, b) {
    this.canvas = canvas
    this.red = r
    this.green = g
    this.blue = b
  }

  tick() {
    this.red = upDown(this.red)
    this.green = upDown(this.green)
    this.blue = upDown(this.blue)
    return this
  }

  render() {
    const { canvas, red, green, blue } = this
    canvas.style.backgroundColor = rgb(red, green, blue)
  }
}

export default BackgroundController
