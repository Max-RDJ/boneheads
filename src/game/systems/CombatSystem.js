import { getBoneheadStats } from '../helpers/getBoneheadStats'
import { playerData } from '../state/playerData'


export default class CombatSystem {

    constructor(scene) {
        this.scene = scene
        this.selectedUnit = null
    }

    syncBoneheadStats(sprite) {
        const bagBonehead = playerData.bag.contents.find(
            bonehead => bonehead.instanceId === sprite.unit.instanceId
        )

        if (!bagBonehead) {
            return
        }

        bagBonehead.currentHp = Math.max(0, sprite.currentHp)
        bagBonehead.currentGuard = sprite.currentGuard
        bagBonehead.isDead = sprite.currentHp <= 0
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

        let remainingDamage = damage

        if (defender.currentGuard > 0) {
            const absorbed = Math.min(
                defender.currentGuard,
                remainingDamage
            )

            defender.currentGuard -= absorbed
            remainingDamage -= absorbed
        }

        if (remainingDamage > 0) {
            defender.currentHp = Math.max(
                0,
                defender.currentHp - remainingDamage
            )

            this.syncBoneheadStats(defender)
        }

        attacker.hasActed = true

        if (defender.currentHp <= 0) {
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

        sprite.currentGuard = sprite.maxGuard
        sprite.isGuarding = true
        sprite.hasActed = true

        console.log(
            `${sprite.unit.typeId} is guarding`
        )

        console.log(
            `${sprite.unit.typeId} Guard: ${sprite.maxGuard}`
        )

        console.log(
            `${sprite.unit.typeId} HP: ${sprite.currentHp}`
        )

        this.selectedUnit = null
        this.scene.hideActionOptions()

        return true
    }

    knockout(sprite) {
        sprite.isDead = true

        const targets = sprite.roundsRemainingCounter
            ? [sprite, sprite.roundsRemainingCounter]
            : sprite

        this.scene.tweens.add({
            targets,
            alpha: 0,
            scale: 0,
            duration: 300,
            onComplete: () => {
                this.scene.turnSystem.checkBattleResult()
            }
        })
    }

    showActionOptions(sprite) {
        this.scene.showAttackOptions(sprite)
        this.scene.showGuardOption(sprite)
    }

}