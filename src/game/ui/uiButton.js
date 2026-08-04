import Phaser from 'phaser'

export class UIButton extends Phaser.GameObjects.Container {

    constructor(scene, x, y, label, style, onClick, overrides = {}) {

        super(scene, x, y)

        scene.add.existing(this)

        const {
            width = 250,
            height,
            radius = 12,
            borderColor = 0x475569,
            borderWidth = 3,
            backgroundColor = 0x1e293b,
            ...textStyle
        } = {
            ...style,
            ...overrides
        }

        this.buttonWidth = width

        this.text = scene.add.text(
            0,
            0,
            label,
            textStyle
        ).setOrigin(0.5)

        const buttonHeight = height ?? this.text.height + 20

        this.background = scene.add.graphics()

        this.background.fillStyle(backgroundColor)
        this.background.lineStyle(borderWidth, borderColor)

        this.background.fillRoundedRect(
            -width / 2,
            -buttonHeight / 2,
            width,
            buttonHeight,
            radius
        )

        this.background.strokeRoundedRect(
            -width / 2,
            -buttonHeight / 2,
            width,
            buttonHeight,
            radius
        )

        this.add([
            this.background,
            this.text
        ])

        this.setSize(width, buttonHeight)

        this.setInteractive({
            useHandCursor: true
        })

        this.on('pointerdown', onClick)

        this.on('pointerover', () => {
            this.setScale(1.05)
        })

        this.on('pointerout', () => {
            this.setScale(1)
        })
    }

    setText(text) {
        this.text.setText(text)
        return this
    }
}