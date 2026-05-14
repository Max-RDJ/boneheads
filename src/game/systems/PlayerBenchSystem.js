import BenchBase from './BenchBase'
import { BONEHEAD_DB } from '../data/boneheadDB'

const START_X = 200
const SLOT_SPACING = 100
const ENEMY_Y = 100

export default class EnemyBenchSystem extends BenchBase {

    create(party) {

        const totalWidth = (party.length - 1) * SLOT_SPACING
        const startX = (800 - totalWidth) / 2

        party.forEach((unit, i) => {

            const data = BONEHEAD_DB[unit.typeId]

            const sprite = this.scene.add.image(
                startX + i * SLOT_SPACING,
                ENEMY_Y,
                data.textures.idleKey
            )

            sprite.setDisplaySize(64, 64)
            sprite.unit = unit

            this.startBlinking(sprite, data)
            this.sprites.push(sprite)
        })
    }
}