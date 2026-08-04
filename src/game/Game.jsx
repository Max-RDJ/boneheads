import { useEffect } from 'react'
import Phaser from 'phaser'

import PreloadScene from './scenes/PreloadScene'

import BoosterScene from './scenes/BoosterScene'
import CombatScene from './scenes/CombatScene'
import InventoryScene from './scenes/InventoryScene'
import ShopScene from './scenes/ShopScene'

import './Game.css'

function Game() {
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            transparent: true,
            scene: [
                PreloadScene,
                BoosterScene,
                CombatScene,
                InventoryScene,
                ShopScene,
            ]
        }

        const game = new Phaser.Game(config)

        return () => {
            game.destroy(true)
        }

    }, [])

    return (
        <div className="game-wrapper">
            <div id="game-container"></div>
        </div>
    )
}

export default Game