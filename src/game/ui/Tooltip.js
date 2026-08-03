import Phaser from 'phaser'
import { UI_STYLES } from './styles'

export class Tooltip extends Phaser.GameObjects.Container {

    constructor(scene) {

        super(scene, 0, 0)

        scene.add.existing(this)

        this.background = scene.add.rectangle(
            120,
            50,
            240,
            100,
            0x222222
        )
        .setStrokeStyle(2, 0xffffff)

        this.text = scene.add.text(
            10,
            10,
            '',
            {
                ...UI_STYLES.bodySmall,
                wordWrap: {
                    width: 220
                }
            }
        )

        this.add([
            this.background,
            this.text
        ])

        this.setDepth(10000)
        this.setVisible(false)
    }

    show(pointer, content) {

        this.text.setText(content)

        const offsetX = 15
        const offsetY = 15

        let x = pointer.worldX + offsetX
        let y = pointer.worldY + offsetY

        x = Phaser.Math.Clamp(
            x,
            this.width / 2,
            this.scene.scale.width - this.width / 2
        )

        y = Phaser.Math.Clamp(
            y,
            this.height / 2,
            this.scene.scale.height - this.height / 2
        )

        this.setPosition(x, y)

        this.setVisible(true)
    }

    hide() {
        this.setVisible(false)
    }
}