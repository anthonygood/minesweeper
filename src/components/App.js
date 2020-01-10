import React, { Component } from 'react'
import GameController from '../game-logic/GameController'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game-logic/canvas/sizes'
import './App.css'

class MessageBubble extends Component {
  render() {
    return (
      <div className="MessageBubble">
        {this.props.text}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        {/* <MessageBubble text={'I am a message!'}/>
        <MessageBubble text={'I too contain message'}/>
        <MessageBubble text={'I contain a long long long long long long long long message' }/>
        <MessageBubble text={'I contain an even even longer longer long long long long long long long long long message' }/> */}

        <div id="canvas-container">
          <canvas id="main-canvas" height={CANVAS_HEIGHT} width={CANVAS_WIDTH}></canvas>
          <canvas id="bkg-canvas" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}></canvas>
        </div>
      </div>
    )
  }

  componentDidMount() {
    new GameController(
      document.getElementById('main-canvas'),
      document.getElementById('bkg-canvas')
    ).start()
  }
}

export default App
