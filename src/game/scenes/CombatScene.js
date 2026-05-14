import Phaser from 'phaser'
import { playerBoneheads } from '../state/boneheads.js'

export default class CombatScene extends Phaser.Scene {
    constructor() {
        super('CombatScene')
    }

    preload() {
        playerBoneheads.forEach((bonehead) => {
            this.load.image(
                `${bonehead.id}-idle`,
                bonehead.textures.idle
            )

            this.load.image(
                `${bonehead.id}-blink`,
                bonehead.textures.blink
            )
        })
    }

    create() {
        this.boneheadSprites = []

        playerBoneheads.forEach((bonehead, index) => {

            const sprite = this.add.image(
                400,
                300 + index * 150,
                `${bonehead.id}-idle`
            )

            this.boneheadSprites.push({
                bonehead,
                sprite
            })

            this.startBlinking(sprite, bonehead)
        })
    }

    startBlinking(sprite, bonehead) {

        const blink = () => {

            sprite.setTexture(`${bonehead.id}-blink`)

            this.time.delayedCall(120, () => {
                sprite.setTexture(`${bonehead.id}-idle`)
            })

            const nextBlink = Phaser.Math.Between(2000, 5000)

            this.time.delayedCall(nextBlink, blink)
        }

        blink()
    }
}