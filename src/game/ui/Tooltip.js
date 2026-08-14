import Phaser from 'phaser'

import { UI_STYLES } from './styles'


export class Tooltip extends Phaser.GameObjects.Container {

    constructor(scene) {

        super(scene, 0, 0)

        scene.add.existing(this)

        this.tooltipWidth = 240
        this.tooltipHeight = 0

        this.background = scene.add.rectangle(
            this.tooltipWidth / 2,
            this.tooltipHeight / 2,
            this.tooltipWidth,
            this.tooltipHeight,
            0x222222,
            0.75
        )
            .setStrokeStyle(2, 0xffffff)

        this.titleText = scene.add.text(
            10,
            8,
            '',
            {
                ...UI_STYLES.bodySmall,
                stroke: '#111111',
                strokeThickness: 1
            }
        )

        this.descriptionText = scene.add.text(
            10,
            35,
            '',
            {
                ...UI_STYLES.bodySmall,
                wordWrap: {
                    width: this.tooltipWidth - 20
                }
            }
        )

        this.add([
            this.background,
            this.titleText,
            this.descriptionText
        ])

        this.setSize(
            this.tooltipWidth,
            this.tooltipHeight
        )

        this.setDepth(10000)
        this.setVisible(false)
    }

    show(pointer, title, description, titleColour = 0xffffff) {

        this.titleText.setText(title)
        this.descriptionText.setText(description)

        this.titleText.setColor(
            Phaser.Display.Color.IntegerToColor(titleColour).rgba
        )

        const padding = 10
        const gap = 5

        this.tooltipHeight =
        this.titleText.height +
        gap +
        this.descriptionText.height +
        padding * 2

        this.background.setSize(
            this.tooltipWidth,
            this.tooltipHeight
        )

        this.background.setPosition(
            this.tooltipWidth / 2,
            this.tooltipHeight / 2
        )

        this.setSize(
            this.tooltipWidth,
            this.tooltipHeight
        )

        const offset = 15

        let x = pointer.x + offset
        let y = pointer.y + offset

        const screenWidth = this.scene.scale.width
        const screenHeight = this.scene.scale.height

        if (x + this.tooltipWidth > screenWidth) {
            x = pointer.worldX - this.tooltipWidth - offset
        }

        if (y + this.tooltipHeight > screenHeight) {
            y = pointer.worldY - this.tooltipHeight - offset
        }

        x = Phaser.Math.Clamp(
            x,
            0,
            screenWidth - this.tooltipWidth
        )

        y = Phaser.Math.Clamp(
            y,
            0,
            screenHeight - this.tooltipHeight
        )

        this.setPosition(x, y)
        this.setVisible(true)
    }

    hide() {
        this.setVisible(false)
    }

    showNextTo(tooltip, title, description, titleColour = 0xffffff) {
        this.titleText.setText(title)
        this.descriptionText.setText(description)

        this.titleText.setColor(
            Phaser.Display.Color.IntegerToColor(titleColour).rgba
        )

        const padding = 10
        const gap = 5

        this.tooltipHeight =
            this.titleText.height +
            gap +
            this.descriptionText.height +
            padding * 2

        this.background.setSize(
            this.tooltipWidth,
            this.tooltipHeight
        )

        this.background.setPosition(
            this.tooltipWidth / 2,
            this.tooltipHeight / 2
        )

        this.setSize(
            this.tooltipWidth,
            this.tooltipHeight
        )

        const offset = 10

        let x =
            tooltip.x +
            tooltip.tooltipWidth +
            offset

        let y = tooltip.y

        const screenWidth = this.scene.scale.width
        const screenHeight = this.scene.scale.height

        if (x + this.tooltipWidth > screenWidth) {
            x =
                tooltip.x -
                this.tooltipWidth -
                offset
        }

        y = Phaser.Math.Clamp(
            y,
            0,
            screenHeight - this.tooltipHeight
        )

        this.setPosition(x, y)
        this.setVisible(true)
    }
}