import Phaser from 'phaser'
import CombatSystem from './CombatSystem'
import { BONEHEAD_DB } from '../data/boneheadDB'

export default class TurnSystem {
    constructor(scene) {
        this.scene = scene
        this.combat = new CombatSystem(scene)

        this.playerFighter = null
        this.playerBench = []
        this.enemyFighter = null
        this.enemyBench = []
    }

    setPlayerFighter(sprite) {
        this.playerFighter = sprite
    }

    setPlayerBench(units) {
        this.playerBench = units
    }

    setEnemyFighter(sprite) {
        this.enemyFighter = sprite
    }

    setEnemyBench(units) {
        this.enemyBench = units
    }

    takeTurn() {
        if (!this.playerFighter || !this.enemyFighter) return

        this.resolveStep()
    }

    tryResolveTurn() {
        if (!this.playerFighter) return
        if (this.isResolving) return

        this.isResolving = true
        this.resolveCombat()
    }

    async resolveStep() {
        if (this.enemyFighter.isDead) return
        if (this.playerFighter.isDead) return
        
        const playerHit = this.combat.attack(
            this.playerFighter,
            this.enemyFighter
        )

        await this.delay(500)

        if (this.checkWin()) return

        if (!this.enemyFighter.isDead) {
            const target = this.pickPlayerTarget()

            this.combat.attack(
                this.enemyFighter,
                target
            )

            await this.delay(500)
        }
    }

    pickPlayerTarget() {
        return this.playerFighter
    }

    resetTurn() {
        this.playerFighter = null
        this.enemyFighter = null
        this.isResolving = false
    }

    checkWin() {
        const allDead = (this.enemyBench || []).every(e => e.isDead)
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