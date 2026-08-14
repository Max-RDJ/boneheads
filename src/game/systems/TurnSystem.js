import Phaser from 'phaser'
import { advanceEnemy, getCurrentEnemy } from './ProgressSystem'
import { enemies } from '../data/enemyDB'


export default class TurnSystem {

    constructor(scene) {
        this.scene = scene

        this.turn = 1
        this.phase = 'player_deployment'
        this.isPlayerTurn = true
        this.battleOver = false
    }

    start() {
        console.log('Player deployment phase')

        this.enableEndTurnButton()
    }

    endPlayerTurn() {
        if (!this.isPlayerTurn) {
            return
        }

        this.disableEndTurnButton()

        if (this.phase === 'player_deployment') {
            this.startEnemyDeployment()
            return
        }

        if (this.phase === 'player_combat') {
            this.startEnemyCombat()
            return
        }
    }

    startEnemyDeployment() {
        this.isPlayerTurn = false
        this.phase = 'enemy_deployment'

        console.log('Enemy deployment')

        setTimeout(() => {
            this.scene.enemyBench.deployRandomUnits(3)

            this.endEnemyTurn()
        }, 500)
    }

    endEnemyTurn() {
        if (this.phase === 'enemy_deployment') {
            this.enableEndTurnButton()
            this.startPlayerCombat()
            return
        }

        if (this.phase === 'enemy_combat') {
            this.enableEndTurnButton()
            this.startPlayerCombat()
        }
    }

    startPlayerCombat() {
        this.isPlayerTurn = true
        this.phase = 'player_combat'

        this.scene.playerBench
            .getBattleUnits()
            .forEach(sprite => {
                sprite.hasActed = false
                sprite.isGuarding = false
            })

        console.log('Player combat phase')
    }

    startEnemyCombat() {
        this.isPlayerTurn = false
        this.phase = 'enemy_combat'

        this.scene.enemyBench
            .getBattleUnits()
            .forEach(sprite => {
                sprite.hasActed = false
                sprite.isGuarding = false
            })

        this.enemyTakeTurns()
    }

    enemyTakeTurns() {
        const enemyUnits =
            this.scene.enemyBench.getBattleUnits()

        const playerUnits =
            this.scene.playerBench.getBattleUnits()

        enemyUnits.forEach(enemy => {
            if (enemy.isDead || enemy.hasActed) {
                return
            }

            const action =
                Phaser.Math.Between(0, 3)

            if (action === 0) {
                this.scene.combatSystem.guard(enemy)
            } else {
                this.enemyAttack(enemy, playerUnits)
            }
        })

        setTimeout(() => {
            this.endEnemyTurn()
        }, 500)    }

    enemyAttack(enemy, playerUnits) {
        const availableTargets =
            playerUnits.filter(
                unit => !unit.isDead
            )

        if (availableTargets.length === 0) {
            return
        }

        const target =
            availableTargets[
                Math.floor(Math.random() * availableTargets.length)
            ]

        this.scene.combatSystem.attack(
            enemy,
            target
        )
    }

    disableEndTurnButton() {
        this.scene.endTurnButton.setEnabled(false)
    }

    enableEndTurnButton() {
        this.scene.endTurnButton.setEnabled(true)
    }

    
    // Separate function to use in case a bonehead has an effect that prevents the opponent from attacking and guarding for a turn
    skipActPhase() {

    }

    checkBattleResult() {
        if (this.battleOver) {
            return
        }

        const enemyAlive =
            this.scene.enemyBench.getLivingUnits().length > 0

        const playerAlive =
            this.scene.playerBench.getLivingUnits().length > 0

        if (!enemyAlive) {
            this.battleOver = true
            this.playerVictory()
            return
        }

        if (!playerAlive) {
            this.battleOver = true
            this.playerLoss()
        }
    }

    playerVictory() {
        const enemy = getCurrentEnemy()
        const reward = enemy.reward
        
        setTimeout(() => {
            this.scene.showVictoryScreen(reward)
        }, 1000);
    }

    playerLoss() {
        alert("Oh dear!")
    }
}