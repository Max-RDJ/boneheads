import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { BOOSTER_DB } from '../data/boosterDB'
import { PAINT_DB } from '../data/paintDB'

export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene')
    }

    preload() {

        const colours = ['blue', 'green', 'red', 'magenta']

        Object.values(BONEHEAD_DB).forEach((bonehead) => {
            colours.forEach((colour) => {
                this.load.image(
                    `${bonehead.id}_idle_${colour}`,
                    `/assets/bonehead_entities/${bonehead.id}/${bonehead.id}_idle_${colour}.png`
                )

                this.load.image(
                    `${bonehead.id}_blink_${colour}`,
                    `/assets/bonehead_entities/${bonehead.id}/${bonehead.id}_blink_${colour}.png`
                )
            })
        })

        this.load.font(
            'Luckiest Guy',
            '../fonts/LuckiestGuy.ttf'
        )

        Object.values(BOOSTER_DB).forEach((booster) => {
            this.load.image(
                booster.textures.key,
                booster.textures.url
            )
        })

        Object.values(PAINT_DB).forEach((paint) => {
            this.load.image(
                paint.textures.key,
                paint.textures.url
            )
        })

        this.load.image(
            'paint_brush_red',
            '/assets/ui/paint_brush_red.png'
        )

        this.load.image(
            'paint_brush_blue',
            '/assets/ui/paint_brush_blue.png'
        )

        this.load.image(
            'paint_brush_green',
            '/assets/ui/paint_brush_green.png'
        )

        this.load.image(
            'paint_brush_magenta',
            '/assets/ui/paint_brush_magenta.png'
        )

        this.load.image(
            'bag',
            '/assets/ui/bag.png'
        )

    }

    create() {
        this.scene.start('ShopScene')
    }
}