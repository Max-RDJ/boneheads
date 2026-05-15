import BenchBase from './BenchBase'
import { BONEHEAD_DB } from '../data/boneheadDB'
import Phaser from 'phaser'

const START_X = 200
const SLOT_SPACING = 100
const ENEMY_Y = 120
const ENEMY_BATTLE_X = 400
const ENEMY_BATTLE_Y = 220

export default class EnemyBenchSystem extends BenchBase {

    constructor(scene) {
        super(scene)
        this.slots = []
        this.slotPositions = []
    }

    create(party) {
        const count = party.length
        const totalWidth = (count - 1) * SLOT_SPACING
        const startX = (800 - totalWidth) / 2

        for (let i = 0; i < count; i++) {
            this.slots[i] = null

            this.slotPositions[i] = {
                x: startX + i * SLOT_SPACING,
                y: ENEMY_Y
            }
        }

        let availableSlots = [...Array(count).keys()]

        party.forEach((unit, i) => {
            const data = BONEHEAD_DB[unit.typeId]
            const randomIndex = Phaser.Utils.Array.GetRandom(availableSlots)

            Phaser.Utils.Array.Remove(availableSlots, randomIndex)

            const pos = this.slotPositions[randomIndex]

            const sprite = this.scene.add.image(
                startX,
                -100,
                data.textures.idleKey
            )

            sprite.unit = unit
            sprite.setDisplaySize(64, 64)

            this.scene.tweens.add({
                targets: sprite,
                x: pos.x,
                y: pos.y,
                delay: i * 200,
                duration: 500,
                ease: 'Power2'
            })

            this.slots[randomIndex] = sprite
            this.sprites.push(sprite)

            this.startBlinking(sprite, data)
        })
    }

    getActiveUnits() {
        return this.sprites.filter(s => !s.isDead)
    }

    selectRandomFighter() {
        const alive = this.sprites.filter(s => !s.isDead)

        if (!alive.length) {
            return null
        }

        const fighter =
            Phaser.Utils.Array.GetRandom(alive)

        this.moveToBattle(fighter)

        return fighter
    }

    moveToBattle(sprite) {
        this.scene.tweens.add({
            targets: sprite,
            x: ENEMY_BATTLE_X,
            y: ENEMY_BATTLE_Y,
            duration: 300,
            ease: 'Power2'
        })

        this.activeUnit = sprite
    }

    getActiveUnits() {
        return this.sprites.filter(s => !s.isDead)
    }
}