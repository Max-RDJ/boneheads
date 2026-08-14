import { advanceEnemy } from './ProgressSystem'


export default class TurnSystem {

    constructor(scene) {
        this.scene = scene

        this.turn = 1
        this.phase = 'player_deployment'
        this.isPlayerTurn = true
    }

    start() {
        console.log('Player deployment phase')
    }

    endPlayerTurn() {
        if (!this.isPlayerTurn) {
            return
        }

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

        this.scene.enemyBench.deployRandomUnits(3)

        this.endEnemyTurn()
    }

    endEnemyTurn() {
        if (this.phase === 'enemy_deployment') {
            this.startPlayerCombat()
            return
        }

        if (this.phase === 'enemy_combat') {
            this.startPlayerCombat()
        }
    }

    startPlayerCombat() {
        this.isPlayerTurn = true
        this.phase = 'player_combat'
    }

    startEnemyCombat() {
        this.isPlayerTurn = false
        this.phase = 'enemy_combat'

        // Temporary:
        // AI will eventually attack/guard here.

        this.endEnemyTurn()
    }

    
    // Separate function to use in case a bonehead has an effect that prevents the opponent from attacking and guarding for a turn
    skipActPhase() {

    }

    checkBattleResult() {
        const enemyAlive =
            this.scene.enemyBench.getLivingUnits().length > 0

        const playerAlive =
            this.scene.playerBench.getLivingUnits().length > 0

        if (!enemyAlive) {
            this.playerVictory()
            return
        }

        if (!playerAlive) {
            this.playerLoss()
        }
    }

    playerVictory() {
        advanceEnemy()
    }

    playerLoss() {
        alert("Oh dear!")
    }
}