import { getBoneheadStats } from '../helpers/getBoneheadStats'
import { playerData } from '../state/playerData'


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

        defender.hp -= damage

        console.log(
            `${attacker.unit.typeId} attacks ${defender.unit.typeId}`
        )

        console.log(
            `${defender.unit.typeId} HP: ${defender.unit.hp}`
        )

        if (defender.unit.hp <= 0) {
            this.knockout(defender)
        }

        this.selectedAttacker = null

        return true
    }

    knockout(sprite) {
        sprite.isDead = true

        this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scale: 0,
            duration: 300
        })
        this.scene.turnSystem.checkBattleResult()
    }

}