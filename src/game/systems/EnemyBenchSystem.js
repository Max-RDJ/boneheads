import Phaser from 'phaser'

import { BONEHEAD_DB } from '../data/boneheadDB'
import { BONEHEAD_COLOURS } from '../data/boneheadColours'
import { startSpriteBlinking } from '../helpers/startSpriteBlinking'


const SLOT_SPACING = 100
const ENEMY_Y = 100

const BATTLE_X = 400
const BATTLE_Y = 220

export default class EnemyBenchSystem {

    constructor(scene) {
        this.scene = scene
        this.slots = []
        this.slotPositions = []
        this.battleUnits = []
        this.sprites = []
    }

    create(count = 3) {
        this.sprites = []
        this.slots = []
        this.slotPositions = []
        this.battleUnits = []

        const enemyBoneheads = this.generateEnemies(count)

        const slotCount = enemyBoneheads.length

        const totalWidth =
            (slotCount - 1) * SLOT_SPACING

        const startX =
            (800 - totalWidth) / 2

        for (let i = 0; i < slotCount; i++) {
            this.slotPositions[i] = {
                x: startX + i * SLOT_SPACING,
                y: ENEMY_Y
            }

            this.slots[i] = null
        }

        enemyBoneheads.forEach((unit, index) => {
            this.createBonehead(unit, index)
        })
    }

    generateEnemies(count) {
        const types = Object.keys(BONEHEAD_DB)

        return Array.from({ length: count }, (_, index) => {

            const typeId =
                Phaser.Utils.Array.GetRandom(types)

            const colour =
                this.getRandomColour()

            return {
                instanceId: `enemy_${index}`,
                typeId,
                colour
            }
        })
    }

    getRandomColour() {
        const colours = Object.entries(BONEHEAD_COLOURS)

        const totalWeight = colours.reduce(
            (total, [, data]) => total + data.weight,
            0
        )

        let random = Math.random() * totalWeight

        for (const [colour, data] of colours) {
            random -= data.weight

            if (random <= 0) {
                return colour
            }
        }

        return colours[0][0]
    }

    createBonehead(unit, index) {
        
        const position =
            this.slotPositions[index]

        const textureKey =
            `${unit.typeId}_idle_${unit.colour}`

        const sprite = this.scene.add.image(
            position.x,
            position.y,
            textureKey
        )

        sprite.unit = unit
        sprite.slotIndex = index
        sprite.location = 'bench'
        sprite.isDead = false

        sprite.setDisplaySize(64, 64)
        sprite.setInteractive({
            cursor: 'pointer'
        })

        sprite.on('pointerdown', () => {
            const attacker =
                this.scene.combatSystem.selectedAttacker

            if (!attacker) {
                return
            }

            this.scene.combatSystem.attack(
                attacker,
                sprite
            )
        })

        this.slots[index] = sprite
        this.sprites.push(sprite)

        startSpriteBlinking(this.scene, sprite)
    }

    getLivingUnits() {
        return this.sprites.filter(
            sprite => !sprite.isDead
        )
    }

    deployRandomUnits(count = 3) {
        const available =
            Phaser.Utils.Array.Shuffle(
                this.getLivingUnits()
            )

        const selected =
            available.slice(0, count)

        selected.forEach(sprite => {
            this.deploy(sprite)
        })

        return selected
    }

    deploy(sprite) {
        if (sprite.location === 'battle') {
            return
        }

        const battleSlot =
            this.battleUnits.length

        sprite.battleSlot = battleSlot

        this.battleUnits.push(sprite)

        sprite.location = 'battle'

        const position =
            this.scene.arena.getBattlePosition(
                'enemy',
                battleSlot
            )

        this.scene.tweens.add({
            targets: sprite,
            x: position.x,
            y: position.y,
            duration: 300,
            ease: 'Power2'
        })
    }

    getBattleUnits() {
        return this.battleUnits.filter(
            sprite => !sprite.isDead
        )
    }
}