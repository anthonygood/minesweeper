import { Bodies } from 'matter-js'

import { renderEmoji } from '../util/render'

const RADIUS = 25

const cannonball = (x, y) => {
    return Bodies.circle(
        x,
        y,
        RADIUS,
        {
            density: 0.9,
            friction: 0.01,
            frictionAir: 0.0001,
            restitution: 0.8,
            isSleeping: true,
            render: {
                visible: false,
                // fillStyle: 'black',
                // strokeStyle: 'black',
                // lineWidth: 1
            },
            plugin: {
                render: renderEmoji,
                emoji: '🤣', // rofl
                size: RADIUS * 2
            }
        }
    )
}

export default cannonball
