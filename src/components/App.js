import React, { Component } from 'react'
import GameController from '../game-logic/GameController'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game-logic/canvas/sizes'
import './App.css'

class Game extends Component {
  constructor(props) {
    super(props)
    this.game = new GameController()
  }

  render() {
    return (
      <div className="App">
        <canvas id="main-canvas" height={CANVAS_HEIGHT} width={CANVAS_WIDTH}></canvas>
        <canvas id="bkg-canvas" height={CANVAS_HEIGHT} width={CANVAS_WIDTH} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}></canvas>
      </div>
    )
  }

  componentDidMount() {
    this.game.start(
      document.getElementById('main-canvas'),
      document.getElementById('bkg-canvas')
    )
  }
}

export default Game
