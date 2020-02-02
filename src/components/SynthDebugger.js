import React, { Component } from 'react'

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
          <input
            onChange={({ target }) => controller.biquadFilter.frequency.value = target.value}
            defaultValue={controller.biquadFilter.frequency.value}
            type="range"
            name="volume"
            min="0" max="1000" step="10"
          />
          <label htmlFor="volume">Biquad Filter Frequency</label>
        </div>

        <div>
          <input
            onChange={({ target }) => console.log('setDist', target.value) || controller.setDistortion(target.value)}
            defaultValue={controller.distortion.value}
            type="range"
            name="volume"
            min="0" max="1000" step="100"
          />
          <label htmlFor="volume">Distortion</label>
        </div>
      </form>
    )
  }
}

export default SynthDebugger
