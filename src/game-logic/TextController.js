import { World } from 'matter-js'
import getText from './letters/getText'
import { renderBubble } from './canvas/renderTextBubble'

class TextController {
  constructor(world, canvas) {
    this.text = getText()
    this.text.then(text => text.forEach(line => World.add(world, line)))

    renderBubble(
      canvas.getContext('2d'),
      // TODO: calculate width, height, X, Y
      250, 100,
      50, 75
    )
  }
}

export default TextController
