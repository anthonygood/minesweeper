import React, { Component } from 'react'
import draw from './letters'
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

        <canvas id="main-canvas" height={window.innerHeight} width={window.innerWidth}></canvas>
        <canvas id="bkg-canvas" height={window.innerHeight} width={window.innerWidth} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}></canvas>
      </div>
    );
  }

  componentDidMount() {
    draw(
      document.getElementById('main-canvas'),
      document.getElementById('bkg-canvas')
    )
  }
}

export default App;
