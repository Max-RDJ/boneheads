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

        this.isResolving = false
        this.playerAction = null
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

    takeTurn(action) {
        if (!this.playerFighter) return
        if (this.isResolving) return
        if (!this.enemyFighter) return

        this.playerAction = action
        this.isResolving = true

        this.resolveCombat()
    }

    async resolveStep() {
        if (!this.enemyFighter || this.enemyFighter.isDead) return
        if (!this.playerFighter || this.playerFighter.isDead) return
        
        const playerHit = this.combat.attack(
            this.playerFighter,
            this.enemyFighter
        )

        await this.delay(500)

        if (this.checkWin()) return

        if (this.enemyFighter.isDead) {
            this.enemyFighter = this.selectNextEnemyFighter()
        }

        if (!this.enemyFighter.isDead) {
            const target = this.pickPlayerTarget()

            this.combat.attack(
                this.enemyFighter,
                target
            )

            await this.delay(500)
        }
    }

    async resolveCombat() {
        const player = this.playerFighter
        const enemy = this.enemyFighter

        if (!player || !enemy) {
            this.resetTurn()
            return
        }

        const playerIsGuarding = this.playerAction === 'guard'

        if (this.playerAction === 'attack') {
            this.combat.attack(player, enemy, false)
        }

        this.clearDeadPlayerFighter()

        if (this.checkWin() || this.checkLoss()) {
            this.resetTurn()
            return
        }

        if (playerIsGuarding) {
            player.isGuarding = true
        }

        await this.delay(500)

        if (enemy.isDead) {
            this.enemyFighter = this.selectNextEnemyFighter()

            if (!this.enemyFighter) {
                console.log("PLAYER WINS")
                this.resetTurn()
                return
            }

            await this.delay(500)
        }

        const defenderGuarding = player.isGuarding === true

        const currentEnemy = this.enemyFighter

        this.combat.attack(
            currentEnemy,
            player,
            defenderGuarding
        )
        
        this.clearDeadPlayerFighter()

        if (this.checkWin() || this.checkLoss()) {
            this.resetTurn()
            return
        }

        await this.delay(500)

        const survivedGuard =
            playerIsGuarding &&
            !player.isDead

        if (survivedGuard) {
            this.scene.playerBench.returnActiveToBench()
            this.playerFighter = null
        }

        player.isGuarding = false

        this.resetTurn()
    }

    pickPlayerTarget() {
        return this.playerFighter
    }

    resetTurn() {
        this.playerAction = null
        this.isResolving = false

        if (this.playerFighter) {
            this.playerFighter.isGuarding = false
        }
    }

    checkWin() {
        const allDead = (this.enemyBench || []).every(e => e.isDead)

        if (allDead) {
            console.log("PLAYER WINS")
            return true
        }

        return false
    }

    checkLoss() {
        const bench = this.playerBench || []

        const allDead =
            bench.length > 0 &&
            bench.every(p => p.isDead)

        console.log('Checking loss condition:', allDead)

        if (allDead) {
            console.log("ENEMY WINS")
            return true
        }

        return false
    }

    clearDeadPlayerFighter() {
        if (
            this.playerFighter &&
            this.playerFighter.isDead
        ) {
            this.scene.playerBench.activeUnit = null
            this.playerFighter = null
        }
    }

    selectNextEnemyFighter() {
        return this.scene.enemyBench.selectRandomFighter()
    }

    delay(ms) {
        return new Promise(resolve => {
            this.scene.time.delayedCall(ms, resolve)
        })
    }
}