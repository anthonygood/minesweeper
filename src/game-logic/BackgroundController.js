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
    const { red, green, blue } = this.update()
    this.canvas.style.backgroundColor = rgb(red, green, blue)
  }

  update() {
    this.red = upDown(this.red)
    this.green = upDown(this.green)
    this.blue = upDown(this.blue)
    return this
  }
}

export default BackgroundController
