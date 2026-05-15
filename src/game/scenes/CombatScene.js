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
        this.turnSystem.setPlayerBench(
            this.playerBench.getActiveUnits()
        )
        
        this.enemyBench.create(enemyParty)
        this.turnSystem.setEnemyBench(
            this.enemyBench.getActiveUnits()
        )

        this.playerAction = null
        this.playerGuarding = false

        this.attackButton = this.add.text(
            660,
            230,
            'ATTACK',
            {
                fontSize: '30px',
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
            this.turnSystem.takeTurn('attack')
        })

        this.guardButton = this.add.text(
            660,
            300,
            'GUARD',
            {
                fontSize: '30px',
                fontFamily: 'Arial',
                backgroundColor: '#228aaa',
                padding: {
                    left: 16,
                    right: 16,
                    top: 8,
                    bottom: 8
                }
            }
        )

        this.guardButton.setInteractive({ cursor: 'pointer' })

        this.guardButton.on('pointerdown', () => {
            this.turnSystem.takeTurn('guard')
        })
    }
}