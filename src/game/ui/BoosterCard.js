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

        this.createPriceText(booster)
        this.createImage(booster)

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
            -25,
            booster.textures.key
        )

        this.image.setScale(0.35)

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
            70,
            `¢${booster.price}`,
            UI_STYLES.bodySmall
        ).setOrigin(0.5)
        
        this.add(this.priceText)
    }
}