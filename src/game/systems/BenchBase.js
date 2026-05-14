import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'

export default class BenchBase {
    constructor(scene) {
        this.scene = scene
        this.sprites = []
    }

    preload(party) {
        party.forEach(unit => {
            const data = BONEHEAD_DB[unit.typeId]

            this.scene.load.image(data.textures.idleKey, data.textures.idleUrl)
            this.scene.load.image(data.textures.blinkKey, data.textures.blinkUrl)
        })
    }

    startBlinking(sprite, data) {
        const blink = () => {

            sprite.setTexture(data.textures.blinkKey)

            this.scene.time.delayedCall(120, () => {
                sprite.setTexture(data.textures.idleKey)
            })

            this.scene.time.delayedCall(
                Phaser.Math.Between(2000, 5000),
                blink
            )
        }

        blink()
    }
}