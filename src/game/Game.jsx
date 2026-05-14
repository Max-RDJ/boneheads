import { useEffect } from 'react'
import Phaser from 'phaser'
import CombatScene from './scenes/CombatScene'
import './Game.css'

function Game() {

    useEffect(() => {

        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            transparent: true,
            scene: [CombatScene]
        }

        const game = new Phaser.Game(config)

        return () => {
            game.destroy(true)
        }

    }, [])

    return (
        <div id="game-container"></div>
    )
}

export default Game