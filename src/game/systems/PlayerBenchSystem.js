import { BONEHEAD_DB } from '../data/boneheadDB'
import { DEPTH } from '../config/depth'
import { playerData } from '../state/playerData'
import { startSpriteBlinking } from '../helpers/startSpriteBlinking'
import { showBattleZoneHighlight, hideBattleZoneHighlight } from './ArenaSystem'


const SLOT_SPACING = 100
const PLAYER_Y = 500

const BATTLE_ZONE = {
    x: 400,
    y: 300,
    width: 500,
    height: 220
}

const MAX_DEPLOYED = 3

export default class PlayerBenchSystem {

    constructor(scene) {
        this.scene = scene
        this.slots = []
        this.slotPositions = []
        this.battleUnits = []
    }

    create() {
        this.sprites = []
        this.slots = []
        this.slotPositions = []
        this.battleUnits = []

        const playerBoneheads = playerData.bag.contents

        const slotCount = playerBoneheads.length

        const totalWidth =
            (slotCount - 1) * SLOT_SPACING

        const startX =
            (800 - totalWidth) / 2

        for (let i = 0; i < slotCount; i++) {
            this.slotPositions[i] = {
                x: startX + i * SLOT_SPACING,
                y: PLAYER_Y
            }

            this.slots[i] = null
        }

        playerBoneheads.forEach((unit, index) => {
            this.createBonehead(unit, index, startX)
        })
    }

    createBonehead(unit, index) {
        const data = BONEHEAD_DB[unit.typeId]
        const position = this.slotPositions[index]

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
        sprite.setInteractive({ cursor: 'pointer' })

        this.scene.input.setDraggable(sprite)

        this.slots[index] = sprite
        this.sprites.push(sprite)

        this.setupDragging(sprite)

        startSpriteBlinking(this.scene, sprite)
    }

    setupDragging(sprite) {
        sprite.on('dragstart', () => {

            if (sprite.isDead) {
                return
            }

            const canDeploy =
                sprite.location === 'battle' ||
                this.battleUnits.length < MAX_DEPLOYED

            this.scene.arena.showBattleZoneHighlight(canDeploy)

            sprite.setDepth(DEPTH.dragging)
        })

        sprite.on('drag', (pointer, x, y) => {

            if (sprite.isDead) {
                return
            }

            sprite.x = x
            sprite.y = y

            const inside =
                this.isInBattleZone(sprite)

            if (!inside) {
                this.scene.arena.hideBattleZoneHighlight()
                return
            }

            const alreadyDeployed =
                sprite.location === 'battle'

            const canDeploy =
                alreadyDeployed ||
                this.battleUnits.length < MAX_DEPLOYED

            this.scene.arena.showBattleZoneHighlight(canDeploy)
        })

        sprite.on('dragend', () => {

            this.scene.arena.hideBattleZoneHighlight()

            if (sprite.isDead) {
                return
            }

            sprite.setDepth(DEPTH.player)

            const inside =
                this.isInBattleZone(sprite)

            if (inside) {
                this.deploy(sprite)
            } else {
                this.returnToBench(sprite)
            }
        })
    }

    isInBattleZone(sprite) {
        return this.scene.arena.isInBattleZone(sprite)
    }

    deploy(sprite) {

        if (sprite.location === 'battle') {
            this.moveToBattle(sprite)
            return
        }

        if (this.battleUnits.length >= MAX_DEPLOYED) {
            this.returnToBench(sprite)
            return
        }

        this.battleUnits.push(sprite)

        sprite.location = 'battle'

        this.moveToBattle(sprite)

        this.scene.turnSystem.onPlayerDeploy(sprite)
    }

    moveToBattle(sprite) {
        const position =
            this.scene.arena.getBattlePosition()

        this.scene.tweens.add({
            targets: sprite,
            x: position.x,
            y: position.y,
            duration: 250,
            ease: 'Power2'
        })
    }

    returnToBench(sprite) {

        const index = this.battleUnits.indexOf(sprite)

        if (index !== -1) {
            this.battleUnits.splice(index, 1)
        }

        sprite.location = 'bench'

        const position =
            this.slotPositions[sprite.slotIndex]

        this.scene.tweens.add({
            targets: sprite,
            x: position.x,
            y: position.y,
            duration: 250,
            ease: 'Power2'
        })
    }

    getBattleUnits() {
        return this.battleUnits.filter(
            sprite => !sprite.isDead
        )
    }

    getLivingUnits() {
        return this.sprites.filter(
            sprite => !sprite.isDead
        )
    }
}