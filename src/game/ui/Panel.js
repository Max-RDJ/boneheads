import Phaser from 'phaser'
import { ErrorOverlay } from './ErrorOverlay'

export class Panel extends Phaser.GameObjects.Container {

    constructor(
        scene,
        x,
        y,
        width,
        height,
        options = {}
    ) {

        super(scene, x, y)

        scene.add.existing(this)

        const {
            fill = 0x1e293b,
            border = 0x475569,
            borderWidth = 5,
            radius = 12,
            title = null,
            errorOverlay = false
        } = options

        this.background = scene.add.graphics()

        this.background.fillStyle(fill)
        this.background.lineStyle(borderWidth, border)

        this.background.fillRoundedRect(
            0,
            0,
            width,
            height,
            radius
        )

        this.background.strokeRoundedRect(
            0,
            0,
            width,
            height,
            radius
        )

        this.add(this.background)


        this.content = scene.add.container(0, 0)

        this.add(this.content)


        if (errorOverlay) {
            this.errorOverlay = new ErrorOverlay(
                scene,
                0,
                0,
                width,
                height
            )

            this.add(this.errorOverlay)
        }


        if (title) {
            this.createTitle(
                scene,
                title,
                border,
                fill
            )
        }

        this.setSize(width, height)
    }


    addContent(child) {
        this.content.add(child)
    }


    createTitle(scene, title, border, fill) {

        this.titleText = scene.add.text(
            35,
            -12,
            title,
            {
                fontFamily: 'Luckiest Guy',
                fontSize: '26px',
                color: '#ffe066'
            }
        )

        const paddingX = 15
        const paddingY = 8

        const titleWidth =
            this.titleText.width + paddingX * 2

        const titleHeight =
            this.titleText.height + paddingY * 2

        this.titleBackground = scene.add.graphics()

        this.titleBackground.fillStyle(border)
        this.titleBackground.lineStyle(5, border)

        this.titleBackground.fillRoundedRect(
            20,
            -titleHeight / 2,
            titleWidth,
            titleHeight,
            10
        )

        this.titleBackground.strokeRoundedRect(
            20,
            -titleHeight / 2,
            titleWidth,
            titleHeight,
            10
        )

        this.add(this.titleBackground)
        this.add(this.titleText)
    }
}