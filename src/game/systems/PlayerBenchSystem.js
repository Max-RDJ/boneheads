import BenchBase from './BenchBase'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { DEPTH } from '../config/depth'

const START_X = 200
const SLOT_SPACING = 100
const PLAYER_Y = 500

const BATTLE_ZONE = {
    x: 400,
    y: 300,
    width: 500,
    height: 220
}

const BATTLE_X = 400
const BATTLE_Y = 380

export default class PlayerBenchSystem extends BenchBase {

    constructor(scene) {
        super(scene)
        this.activeUnit = null
    }

    create(party) {

        const totalWidth = (party.length - 1) * SLOT_SPACING
        const startX = (800 - totalWidth) / 2

        party.forEach((unit, i) => {

            const data = BONEHEAD_DB[unit.typeId]

            const sprite = this.scene.add.image(
                startX + i * SLOT_SPACING,
                PLAYER_Y,
                data.textures.idleKey
            )

            sprite.setDisplaySize(64, 64)

            sprite.unit = unit
            sprite.setInteractive({ cursor: 'pointer' })
            this.scene.input.setDraggable(sprite)

            sprite.on('dragstart', () => {
                sprite.setDepth(DEPTH.dragging)
            })

            sprite.on('drag', (p, x, y) => {
                sprite.x = x
                sprite.y = y
            })

            sprite.on('dragend', () => {
                sprite.setDepth(DEPTH.player)

                const inside =
                    sprite.x > BATTLE_ZONE.x - BATTLE_ZONE.width / 2 &&
                    sprite.x < BATTLE_ZONE.x + BATTLE_ZONE.width / 2 &&
                    sprite.y > BATTLE_ZONE.y - BATTLE_ZONE.height / 2 &&
                    sprite.y < BATTLE_ZONE.y + BATTLE_ZONE.height / 2

                if (inside) {
                    this.moveToBattle(sprite)
                } else {
                    this.returnToBench(sprite)
                }

            })

            this.startBlinking(sprite, data)
            this.sprites.push(sprite)
        })
    }

    moveToBattle(sprite) {

        this.scene.tweens.add({
            targets: sprite,
            x: BATTLE_X,
            y: BATTLE_Y,
            duration: 250,
            ease: 'Power2'
        })

        this.activeUnit = sprite
    }

    returnToBench(sprite) {

        this.scene.tweens.add({
            targets: sprite,
            x: sprite.x,
            y: PLAYER_Y,
            duration: 250,
            ease: 'Power2'
        })
    }
}