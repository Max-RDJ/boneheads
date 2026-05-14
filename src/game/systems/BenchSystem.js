import Phaser from 'phaser'

export default class BenchSystem {

    constructor(scene) {
        this.scene = scene
        this.playerBench = []
        this.opponentBench = []
    }

    preload(boneheads) {
        boneheads.forEach(b => {
            this.scene.load.image(b.textures.idleKey, b.textures.idleUrl)
            this.scene.load.image(b.textures.blinkKey, b.textures.blinkUrl)
        })
    }

    create(boneheads) {
        boneheads.forEach((b, i) => {
            const x = 200 + i * 120

            const sprite = this.scene.add.image(x, 500, b.textures.idleKey)
            sprite.setDisplaySize(64, 64)
            this.playerBench.push(sprite)

            this.startBlinking(sprite, b)
        })
    }

    startBlinking(sprite, bonehead) {
        const blink = () => {

            sprite.setTexture(bonehead.textures.blinkKey)

            this.scene.time.delayedCall(120, () => {
                sprite.setTexture(bonehead.textures.idleKey)
            })

            this.scene.time.delayedCall(
                Phaser.Math.Between(2000, 5000),
                blink
            )
        }

        blink()
    }
}