import { getBoneheadStats } from '../helpers/getBoneheadStats'
import { showAttackOptions, showGuardOption } from '../scenes/CombatScene'


export default class CombatSystem {

    constructor(scene) {
        this.scene = scene
        this.selectedUnit = null
    }

    selectUnit(sprite) {
        if (this.scene.turnSystem.phase !== 'player_combat') {
            return false
        }

        if (!sprite || sprite.isDead) {
            return false
        }

        if (sprite.location !== 'battle') {
            return false
        }

        if (sprite.hasActed) {
            return false
        }

        this.selectedUnit = sprite

        console.log(
            'Selected unit:',
            sprite.unit.typeId
        )

        this.showActionOptions(sprite)

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

        const damage = attackerStats.attack

        console.log(
            `${attacker.unit.typeId} attacks ${defender.unit.typeId}`
        )

        let remainingDamage = damage

        if (defender.guard > 0) {
            const absorbed = Math.min(
                defender.guard,
                remainingDamage
            )

            defender.guard -= absorbed
            remainingDamage -= absorbed
        }

        if (remainingDamage > 0) {
            defender.hp -= remainingDamage
        }

        console.log(
            `${defender.unit.typeId} Guard: ${defender.guard}`
        )

        console.log(
            `${defender.unit.typeId} HP: ${defender.hp}`
        )

        attacker.hasActed = true

        if (defender.hp <= 0) {
            this.knockout(defender)
        }

        this.selectedAttacker = null
        this.scene.hideActionOptions()

        return true
    }

    guard(sprite) {
        if (!sprite || sprite.isDead || sprite.hasActed) {
            return false
        }

        sprite.guard = Math.round(sprite.hp / 2)
        sprite.isGuarding = true
        sprite.hasActed = true

        console.log(
            `${sprite.unit.typeId} is guarding`
        )

        console.log(
            `${sprite.unit.typeId} Guard: ${sprite.guard}`
        )

        console.log(
            `${sprite.unit.typeId} HP: ${sprite.hp}`
        )

        this.selectedUnit = null
        this.scene.hideActionOptions()

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

    showActionOptions(sprite) {
        this.scene.showAttackOptions(sprite)
        this.scene.showGuardOption(sprite)
    }

}