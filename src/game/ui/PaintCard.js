import Phaser from 'phaser'

import { COLOURS } from './ColourMap'
import { UI_STYLES } from './styles'

export class PaintCard extends Phaser.GameObjects.Container {

    constructor(scene, x, y, paint, onBuy, tooltip, options = {}) {

        super(scene, x, y)

        this.scene = scene
        this.paint = paint
        this.tooltip = tooltip
        this.onBuy = onBuy

        scene.add.existing(this)

        if (options.showPrice !== false) {
            this.createPriceText(paint)
        }

        this.createImage(paint)

        this.setSize(180, 120)
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                -30,
                -55,
                60,
                60
            ),
            Phaser.Geom.Rectangle.Contains
        )

        this.setupHover()

        this.image.on('pointermove', pointer => {

            this.tooltip.show(
                pointer,
                this.paint.name,
                this.paint.description,
                COLOURS[this.paint.colour]
            )
        })

        this.image.on('pointerout', () => {
            this.tooltip.hide()
        })
    }

    setupHover() {

        this.image.on('pointermove', pointer => {

            this.tooltip.show(
                pointer,
                this.paint.name,
                this.paint.description,
                COLOURS[this.paint.colour]
            )

        })

        this.image.on('pointerout', () => {
            this.tooltip.hide()
        })
    }

    createImage(paint) {

        this.image = this.scene.add.image(
            0,
            -25,
            paint.textures.key
        )

        this.image.setDisplaySize(60, 60)

        this.image.setInteractive({
            useHandCursor: true
        })

        this.image.on('pointerdown', () => {
            if (this.onBuy) {
                this.onBuy(paint)
            }
        })

        this.add(this.image)
    }

    createPriceText(paint) {

        this.priceText = this.scene.add.text(
            0,
            20,
            `¢${paint.price}`,
            UI_STYLES.bodySmall
        ).setOrigin(0.5)
        
        this.add(this.priceText)
    }
}