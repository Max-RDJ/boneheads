import Phaser from 'phaser'

import { COLOURS } from './ColourMap'
import { UI_STYLES } from './styles'

export class BoosterCard extends Phaser.GameObjects.Container {

    constructor(scene, x, y, booster, onBuy, tooltip) {

        super(scene, x, y)

        this.scene = scene
        this.booster = booster
        this.tooltip = tooltip
        this.onBuy = onBuy

        scene.add.existing(this)

        this.createImage(booster)
        this.createPriceText(booster)

        const priceGap = 10

        this.priceText.y =
            this.image.displayHeight / 2 +
            priceGap +
            this.priceText.height / 2

        this.setSize(
            180,
            this.image.displayHeight + this.priceText.height + priceGap
        )

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
                this.booster.name,
                this.booster.description,
                COLOURS[this.booster.colour]
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
                this.booster.name,
                this.booster.description,
                COLOURS[this.booster.colour]
            )

        })

        this.image.on('pointerout', () => {
            this.tooltip.hide()
        })
    }

    createImage(booster) {

        this.image = this.scene.add.image(
            0,
            0,
            booster.textures.key
        )

        const width = 80
        const scale = width / this.image.width

        this.image.setScale(scale)

        this.image.setInteractive({
            useHandCursor: true
        })

        this.image.on('pointerdown', () => {
            this.onBuy(booster)
        })

        this.add(this.image)
    }

    createPriceText(booster) {

        this.priceText = this.scene.add.text(
            0,
            0,
            `¢${booster.price}`,
            UI_STYLES.bodySmall
        ).setOrigin(0.5)
        
        this.add(this.priceText)
    }
}