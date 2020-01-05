export const messageBubble = (
  bubbleWidth = 200,
  bubbleHeight = 100,
  canvasWidth = window.innerWidth,
  canvasHeight = window.innerHeight
) =>
`<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}">
<foreignObject width="100%" height="100%">
  <div class="MessageBubble" xmlns="http://www.w3.org/1999/xhtml">
  </div>
  <style>
    .MessageBubble {
      margin: 0;
      padding: 10px;
      background-color: rgb(151, 255, 232);
      border: 3px dotted rgb(101, 221, 195);
      border-radius: 25px;
      position: absolute;
      top: 0;
      left: 0;
      height: ${bubbleHeight}px;
      width: ${bubbleWidth}px;
    }
    .MessageBubble::after {
      content: '';
      height: 20px;
      width: 20px;
      position: absolute;
      bottom: -13px;
      left: 30px;
      background-color: rgb(151, 255, 232);
      border: 3px dotted rgb(101, 221, 195);
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
