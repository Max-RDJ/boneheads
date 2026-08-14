import Phaser from 'phaser'

import { COLOURS } from './ColourMap'
import { UI_STYLES } from './styles'
import { BONEHEAD_COLOURS } from '../data/boneheadColours'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { getBoneheadStats } from '../helpers/getBoneheadStats'


export class BoneheadCard extends Phaser.GameObjects.Container {

    constructor(
        scene,
        x,
        y,
        bonehead,
        onBuy,
        tooltip,
        paintTooltip,
        options = {}
    ) {

        super(scene, x, y)

        this.scene = scene
        this.bonehead = bonehead
        this.tooltip = tooltip
        this.paintTooltip = paintTooltip
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
    }

    setupHover() {
        const stats = getBoneheadStats(this.bonehead)
        const data = BONEHEAD_DB[this.bonehead.typeId]

        this.image.on('pointermove', pointer => {

            this.tooltip.show(
                pointer,
                data.name,
                `Attack: ${stats.attack}\nHP: ${stats.hp}`,
                COLOURS[this.bonehead.colour]
            )

            const paint =
                BONEHEAD_COLOURS[this.bonehead.colour]

            if (paint?.title && paint?.description) {
                this.paintTooltip.showNextTo(
                    this.tooltip,
                    paint.title,
                    paint.description,
                    COLOURS[this.bonehead.colour]
                )
            } else {
                this.paintTooltip.hide()
            }
        })

        this.image.on('pointerout', () => {
            this.tooltip.hide()
            this.paintTooltip.hide()
        })
    }

    createImage(bonehead) {

        const textureKey =
            `${bonehead.typeId}_idle_${bonehead.colour}`

        this.image = this.scene.add.image(
            0,
            -25,
            textureKey
        )

        this.image.setDisplaySize(60, 60)

        this.image.setInteractive({
            useHandCursor: true
        })

        this.image.on('pointerdown', () => {
            if (this.onBuy) {
                this.onBuy(bonehead)
            }
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