import Phaser from 'phaser'

import ArenaSystem from '../systems/ArenaSystem'
import PlayerBenchSystem from '../systems/PlayerBenchSystem'
import EnemyBenchSystem from '../systems/EnemyBenchSystem'
import TurnSystem from '../systems/TurnSystem'

import { playerParty } from '../state/playerParty'
import { enemyParty } from '../state/enemyParty'

export default class CombatScene extends Phaser.Scene {

    constructor() {
        super('CombatScene')
    }

    preload() {
        this.playerBench = new PlayerBenchSystem(this)
        this.enemyBench = new EnemyBenchSystem(this)

        this.playerBench.preload(playerParty)
        this.enemyBench.preload(enemyParty)
    }

    create() {
        this.arena = new ArenaSystem(this)
        this.arena.create()

        this.turnSystem = new TurnSystem(this)

        this.playerBench = new PlayerBenchSystem(this)
        this.enemyBench = new EnemyBenchSystem(this)

        this.playerBench.create(playerParty)
        this.enemyBench.create(enemyParty)
        this.turnSystem.setEnemyBench(
            this.enemyBench.getActiveUnits()
        )

        this.attackButton = this.add.text(
            650,
            540,
            'ATTACK',
            {
                fontSize: '32px',
                fontFamily: 'Arial',
                backgroundColor: '#aa2222',
                padding: {
                    left: 16,
                    right: 16,
                    top: 8,
                    bottom: 8
                }
            }
        )

        this.attackButton.setInteractive({ cursor: 'pointer' })

        this.attackButton.on('pointerdown', () => {
            this.turnSystem.takeTurn()
        })
    }
}