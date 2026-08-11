import Phaser from 'phaser'
import { UI_STYLES } from './styles'

export class ErrorOverlay extends Phaser.GameObjects.Container {

    constructor(
        scene,
        x,
        y,
        width,
        height,
        options = {}
    ) {

        super(scene, x, y)

        const {
            radius = 12
        } = options

        this.background = scene.add.graphics()

        this.background.fillStyle(
            UI_STYLES.errorOverlay.backgroundColor,
            UI_STYLES.errorOverlay.alpha
        )

        this.background.fillRoundedRect(
            0,
            0,
            width,
            height,
            radius
        )

        this.add(this.background)

        this.message = scene.add.text(
            width / 2,
            height / 2,
            'Error!',
            UI_STYLES.title
        ).setOrigin(0.5)

        this.add(this.message)

        this.setVisible(false)
    }

    showMessage(message) {
        this.message.setText(message)
        this.setVisible(true)

        this.scene.time.delayedCall(1500, () => {
            this.hideMessage()
        })
    }

    hideMessage() {
        this.setVisible(false)
    }
}