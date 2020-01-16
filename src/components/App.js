import React, { Component } from 'react'
import GameController from '../game-logic/GameController'
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../game-logic/canvas/sizes'
import './App.css'

class SynthDebugger extends Component {
  render() {
    const {
      controller
    } = this.props
    return (
      <form className="SynthDebugger">
        <p>Audio settings:</p>
        <div>
          <select
            onChange={({ target }) => controller.setWave(target.value)}
            name="wave-form"
            defaultValue={controller.getWave()}
          >
            <option value="sine">Sine</option>
            <option value="square">Square</option>
            <option value="sawtooth">Sawtooth</option>
            <option value="triangle">Triangle</option>
          </select>
          <label htmlFor="wave-form">Wave Type</label>
        </div>
        <div>
          <input
            onChange={({ target }) => controller.setVolume(target.value)}
            defaultValue={controller.volume}
            type="range"
            name="volume"
            min="0" max="1" step="0.1"
          />
          <label htmlFor="volume">Volume</label>
        </div>

        <div>
          <input onChange={({ target }) => console.log(target.value)}type="range" name="cowbell" min="0" max="100" step="10" />
          <label htmlFor="cowbell">Cowbell</label>
        </div>
      </form>
    )
  }
}



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
        <SynthDebugger controller={this.game.sound} />
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

const Splash = ({ onClick }) => <div className="Splash" onClick={onClick}><button>Play</button></div>

class App extends Component {
  state = { play: false }

  render() {
    const { play } = this
    return this.state.play ? <Game /> : <Splash onClick={() => play()} />
  }

  play = () => {
    this.setState({ play: true })
  }
}

export default App
