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
            disabledBackgroundColor = 0x666666,
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
        this.disabledBackgroundColor = disabledBackgroundColor

        this.text = scene.add.text(
            0,
            0,
            label,
            textStyle
        ).setOrigin(0.5)

        this.enabled = true

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
            if (this.enabled) {
                this.drawBackground(
                    this.hoverBackgroundColor,
                    buttonHeight
                )
            }
        })

        this.on('pointerout', () => {
            if (this.enabled) {
                this.drawBackground(
                    this.backgroundColor,
                    buttonHeight
                )
            }
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

    setEnabled(enabled) {
        this.enabled = enabled

        if (enabled) {
            this.setInteractive()
            this.setAlpha(1)
            this.drawBackground(
                this.backgroundColor,
                this.buttonHeight
            )
        } else {
            this.disableInteractive()
            this.setAlpha(1)
            this.drawBackground(
                this.disabledBackgroundColor,
                this.buttonHeight
            )
        }
    }

}