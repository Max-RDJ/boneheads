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
            backgroundColor = 0x329745,
            hoverBackgroundColor = backgroundColor,
            ...textStyle
        } = {
            ...style,
            ...overrides
        }

        this.buttonWidth = width
        this.buttonHeight = height
        this.radius = radius
        this.borderColor = borderColor
        this.borderWidth = borderWidth
        this.backgroundColor = backgroundColor
        this.hoverBackgroundColor = hoverBackgroundColor

        this.text = scene.add.text(
            0,
            0,
            label,
            textStyle
        ).setOrigin(0.5)

        const buttonHeight = height ?? this.text.height + 20

        this.background = scene.add.graphics()

        this.drawBackground(this.backgroundColor, buttonHeight)

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
            this.drawBackground(this.hoverBackgroundColor, buttonHeight)
        })

        this.on('pointerout', () => {
            this.drawBackground(this.backgroundColor, buttonHeight)
        })
    }

    drawBackground(color, height) {

        this.background.clear()

        this.background.fillStyle(color)
        this.background.lineStyle(
            this.borderWidth,
            this.borderColor
        )

        this.background.fillRoundedRect(
            -this.buttonWidth / 2,
            -height / 2,
            this.buttonWidth,
            height,
            this.radius
        )

        this.background.strokeRoundedRect(
            -this.buttonWidth / 2,
            -height / 2,
            this.buttonWidth,
            height,
            this.radius
        )
    }

    setText(text) {
        this.text.setText(text)
        return this
    }
}