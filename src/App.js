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
        <MessageBubble text={'I am a message!'}/>
        <MessageBubble text={'I too contain message'}/>
        <MessageBubble text={'I contain a long long long long long long long long message' }/>
        <MessageBubble text={'I contain an even even longer longer long long long long long long long long long message' }/>

        {/* <canvas id="app-canvas" height={677} width={window.innerWidth}></canvas> */}
      </div>
    );
  }

  componentDidMount() {
    const canvas = document.getElementById('app-canvas')

    // draw(canvas)
  }
}

export default App;
