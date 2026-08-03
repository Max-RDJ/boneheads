import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'

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
    }

    create() {
        this.scene.start('ShopScene')
    }
}