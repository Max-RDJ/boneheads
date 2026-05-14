import Phaser from 'phaser'
import CombatSystem from './CombatSystem'
import { BONEHEAD_DB } from '../data/boneheadDB'

export default class TurnSystem {
    constructor(scene) {
        this.scene = scene
        this.combat = new CombatSystem(scene)

        this.playerUnit = null
        this.enemyUnit = null

        this.isResolving = false
    }

    setPlayerUnit(sprite) {
        this.playerUnit = sprite

        this.tryResolveTurn()
    }

    setEnemyUnits(enemySprites) {
        this.enemyUnits = enemySprites
    }

    pickTarget() {
        const alive = (this.enemyUnits || []).filter(e => !e.isDead)
        if (!alive.length) return null
        return Phaser.Utils.Array.GetRandom(alive)
    }

    tryResolveTurn() {
        if (!this.playerUnit) return
        if (this.isResolving) return

        this.isResolving = true

        this.enemyUnit = this.pickTarget()

        this.resolveCombat()
    }

    pickTarget() {
        const alive = this.enemyUnits.filter(e => !e.isDead)

        return alive[Math.floor(Math.random() * alive.length)]
    }

    async resolveCombat() {
        const playerHit = this.combat.attack(
            this.playerUnit,
            this.enemyUnit
        )

        await this.delay(600)

        if (this.checkWin()) return

        const enemyAlive = !this.enemyUnit.isDead

        if (enemyAlive) {

            const target = this.pickPlayerTarget()

            this.combat.attack(
                this.enemyUnit,
                target
            )

            await this.delay(600)
        }

        this.resetTurn()
    }

    pickPlayerTarget() {
        return this.playerUnit
    }

    resetTurn() {
        this.playerUnit = null
        this.enemyUnit = null
        this.isResolving = false
    }

    checkWin() {
        const allDead = this.enemyUnits.every(e => e.isDead)

        if (allDead) {
            console.log("PLAYER WINS")
            return true
        }

        return false
    }

    delay(ms) {
        return new Promise(resolve => {
            this.scene.time.delayedCall(ms, resolve)
        })
    }
}