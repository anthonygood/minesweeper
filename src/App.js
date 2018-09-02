import React, { Component } from 'react'
import draw from './letters'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <canvas id="app-canvas" height={677} width={window.innerWidth}></canvas>
      </div>
    );
  }

  componentDidMount() {
    const canvas = document.getElementById('app-canvas')
    // canvas.height = 400
    // canvas.width = 800

    draw(canvas)

    // setInterval(
    //   draw.bind(null, canvas),
    //   6000
    // )
  }
}

export default App;
