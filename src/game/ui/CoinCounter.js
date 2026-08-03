import Phaser from 'phaser'
import { playerData } from '../state/playerData'
import { UI_STYLES } from './styles'

export class CoinCounter extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {

        super(scene, x, y)

        scene.add.existing(this)

        this.background = scene.add.graphics()

        this.text = scene.add.text(
            60,
            20,
            `¢${playerData.coins}`,
            UI_STYLES.coinCounter
        ).setOrigin(0.5)

        this.add([
            this.background,
            this.text
        ])
    }

    setAmount(amount) {
        this.text.setText(`¢${amount}`)
    }
}