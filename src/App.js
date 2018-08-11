import React, { Component } from 'react';
import draw from './letters'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <canvas id="app-canvas">
        </canvas>
      </div>
    );
  }

  componentDidMount() {
    const canvas = document.getElementById('app-canvas')
    canvas.height = 400
    canvas.width = 800

    draw(canvas)

    setInterval(
      draw.bind(null, canvas),
      5000
    )
  }
}

export default App;
