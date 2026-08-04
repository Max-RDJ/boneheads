import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { BOOSTER_DB } from '../data/boosterDB'

export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super('PreloadScene')
    }

    preload() {

        Object.values(BONEHEAD_DB).forEach((bonehead) => {

            this.load.image(
                bonehead.textures.idleKey,
                bonehead.textures.idleUrl
            )

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

        this.load.image(
            'bag',
            '/assets/bag.png'
        )
    }

    create() {
        this.scene.start('ShopScene')
    }
}