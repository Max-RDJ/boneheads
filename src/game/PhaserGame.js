import Phaser from 'phaser'
import CombatScene from './scenes/CombatScene'

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    transparent: true,
    scene: [CombatScene]
}

const game = new Phaser.Game(config)

export default game