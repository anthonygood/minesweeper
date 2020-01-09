import { CANVAS_HEIGHT, CANVAS_WIDTH } from './sizes'

const CALLOUT_SIZE = 20
const BORDER_WIDTH = 3
const border = `${BORDER_WIDTH}px solid #03988a`

export const messageBubble = (
  width = 200,
  height = 100,
  canvasWidth = width + BORDER_WIDTH * 2,
  canvasHeight = height + CALLOUT_SIZE + BORDER_WIDTH * 2
) =>
`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
<foreignObject width="100%" height="100%">
  <div class="MessageBubble" xmlns="http://www.w3.org/1999/xhtml"></div>
  <style>
    .MessageBubble {
      margin: 0;
      background-color: white;
      border: ${border};
      border-radius: 15px;
      position: absolute;
      top: 0;
      left: 0;
      height: ${height}px;
      width: ${width}px;
    }
    .MessageBubble::after {
      content: '';
      height: ${CALLOUT_SIZE}px;
      width: ${CALLOUT_SIZE}px;
      position: absolute;
      bottom: -13px;
      left: 30px;
      background-color: white;
      border: ${border};
      border-top: none;
      border-left: none;
      transform: rotate(45deg);
    }
  </style>
</foreignObject>
</svg>
`

export const renderBubble = (
  ctx,
  width,
  height,
  x = 0,
  y = 0
) => {
  const bubble = messageBubble(width, height)
  const encodedBubble = encodeURIComponent(bubble)

  const img = new Image()
  img.onload = () => ctx.drawImage(img, x, y)
  img.src = `data:image/svg+xml,${encodedBubble}`
}
