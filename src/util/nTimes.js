const nTimes = n => ({ do: fn => Array.from({ length: n }).forEach(fn) })

export default nTimes
