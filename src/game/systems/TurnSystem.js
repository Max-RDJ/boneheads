export default class TurnSystem {

    constructor(scene, combatSystem) {

        this.scene = scene
        this.combat = combatSystem

        this.turn = 1

        this.playerDeployedThisTurn = []
        this.playerActionsThisTurn = []

        this.isResolving = false
    }

    onPlayerDeploy(sprite) {

        if (!this.playerDeployedThisTurn.includes(sprite)) {
            this.playerDeployedThisTurn.push(sprite)
        }
    }

    canAct(sprite) {

        if (!sprite || sprite.isDead) {
            return false
        }

        return true
    }

    attack(attacker, defender) {

        if (this.isResolving) {
            return
        }

        if (!this.canAct(attacker)) {
            return
        }

        if (!defender || defender.isDead) {
            return
        }

        this.combat.attack(
            attacker,
            defender
        )

        this.playerActionsThisTurn.push({
            type: 'attack',
            attacker,
            defender
        })
    }

    guard(sprite) {

        if (!this.canAct(sprite)) {
            return
        }

        sprite.isGuarding = true

        this.playerActionsThisTurn.push({
            type: 'guard',
            sprite
        })
    }

    endTurn() {

        this.turn++

        this.playerDeployedThisTurn = []
        this.playerActionsThisTurn = []

        this.resetGuards()
        this.cleanupDeadUnits()
    }

    resetGuards() {

        const units =
            this.scene.playerBench.getLivingUnits()

        units.forEach(unit => {
            unit.isGuarding = false
        })
    }

    cleanupDeadUnits() {

        const playerUnits =
            this.scene.playerBench.getLivingUnits()

        const enemyUnits =
            this.scene.enemyBench.getLivingUnits()

        console.log(
            'Player alive:',
            playerUnits.length
        )

        console.log(
            'Enemy alive:',
            enemyUnits.length
        )
    }
}