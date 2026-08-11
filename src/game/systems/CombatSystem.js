import { getBoneheadStats } from '../helpers/getBoneheadStats'

export default class CombatSystem {

    constructor(scene) {
        this.scene = scene
        this.selectedAttacker = null
    }

    selectAttacker(sprite) {
        if (!sprite || sprite.isDead) {
            return false
        }

        if (sprite.location !== 'battle') {
            return false
        }

        if (sprite.deployedTurn === this.scene.turnSystem.turn) {
            return false
        }

        this.selectedAttacker = sprite

        console.log(
            'Selected attacker:',
            sprite.unit.typeId
        )

        return true
    }

    attack(attacker, defender) {

        if (!attacker || !defender) {
            return false
        }

        if (attacker.isDead || defender.isDead) {
            return false
        }

        const attackerStats =
            getBoneheadStats(attacker.unit)

        const damage = attackerStats.accuracy

        defender.unit.hp -= damage

        console.log(
            `${attacker.unit.typeId} attacks ${defender.unit.typeId}`
        )

        console.log(
            `${defender.unit.typeId} HP: ${defender.unit.hp}`
        )

        if (defender.unit.hp <= 0) {
            this.defeat(defender)
        }

        this.selectedAttacker = null

        return true
    }

    defeat(sprite) {
        sprite.isDead = true

        this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scale: 0,
            duration: 300
        })
    }
}