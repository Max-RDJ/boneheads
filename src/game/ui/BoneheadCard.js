import Phaser from 'phaser'
import { UI_STYLES } from './styles'

export class BoneheadCard extends Phaser.GameObjects.Container {

    constructor(scene, x, y, bonehead, onBuy, tooltip, options = {}) {

        super(scene, x, y)

        this.scene = scene
        this.bonehead = bonehead
        this.tooltip = tooltip
        this.onBuy = onBuy

        scene.add.existing(this)

        if (options.showPrice !== false) {
            this.createPriceText(bonehead)
        }

        this.createImage(bonehead)

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
                `${this.bonehead.name}
                Accuracy: ${this.bonehead.stats.accuracy}
                Defence: ${this.bonehead.stats.defence}`
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
                `${this.bonehead.name}
                Accuracy: ${this.bonehead.stats.accuracy}
                Defence: ${this.bonehead.stats.defence}`
            )

        })

        this.image.on('pointerout', () => {
            this.tooltip.hide()
        })
    }

    createImage(bonehead) {

        this.image = this.scene.add.image(
            0,
            -25,
            bonehead.textures.idleKey
        )

        this.image.setDisplaySize(60, 60)

        this.image.setInteractive({
            useHandCursor: true
        })

        this.image.on('pointerdown', () => {
            this.onBuy(bonehead)
        })

        this.add(this.image)
    }

    createPriceText(bonehead) {

        this.priceText = this.scene.add.text(
            0,
            30,
            `¢${bonehead.price}`,
            UI_STYLES.bodySmall
        ).setOrigin(0.5)
        
        this.add(this.priceText)
    }
}