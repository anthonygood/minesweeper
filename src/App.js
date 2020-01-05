import React, { Component } from 'react'
import createGame from './game-logic/letters'
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

        <canvas id="main-canvas" width={375}></canvas>
        <canvas id="bkg-canvas"style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}></canvas>
      </div>
    );
  }

  componentDidMount() {
    createGame(
      document.getElementById('main-canvas'),
      document.getElementById('bkg-canvas')
    )
  }
}

export default App
