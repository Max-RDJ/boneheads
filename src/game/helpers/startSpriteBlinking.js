import Phaser from 'phaser'

export function startSpriteBlinking(scene, sprite) {

    const unit = sprite.unit

    const typeId = unit.typeId || unit.id
    const colour = unit.colour

    const idleKey =
        `${typeId}_idle_${colour}`

    const blinkKey =
        `${typeId}_blink_${colour}`

    const blink = () => {

        if (!sprite.active) {
            return
        }

        sprite.setTexture(blinkKey)

        scene.time.delayedCall(120, () => {

            if (sprite.active) {
                sprite.setTexture(idleKey)
            }

        })

        scene.time.delayedCall(
            Phaser.Math.Between(2000, 5000),
            blink
        )
    }

    blink()
}