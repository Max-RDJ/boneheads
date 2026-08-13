import Phaser from 'phaser'

import PlayerBenchSystem from '../systems/PlayerBenchSystem'
import EnemyBenchSystem from '../systems/EnemyBenchSystem'
import CombatSystem from '../systems/CombatSystem'
import TurnSystem from '../systems/TurnSystem'
import ArenaSystem from '../systems/ArenaSystem'
import { Panel } from '../ui/Panel' 

export default class CombatScene extends Phaser.Scene {

    constructor() {
        super('CombatScene')
    }

    create() {

        // Systems
        this.arena = new ArenaSystem(this)
        this.playerBench = new PlayerBenchSystem(this)
        this.enemyBench = new EnemyBenchSystem(this)
        this.combatSystem = new CombatSystem(this)
        this.turnSystem = new TurnSystem(this)

        // Arena
        this.arena.create()

        // Benches
        this.playerBench.create()
        this.enemyBench.create(3)

        // UI
        this.createActionButtons()
    }

    createActionButtons() {

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

        this.guardButton.setInteractive({
            cursor: 'pointer'
        })

        this.guardButton.on('pointerdown', () => {
            this.turnSystem.selectAction('guard')
        })
    }

    createBattleZone() {
        this.battleZone = this.add.rectangle(
            400,
            300,
            500,
            220
        )

        this.battleZone.setStrokeStyle(
            4,
            0xffffff,
            0.15
        )

        this.battleZone.setFillStyle(
            0xffffff,
            0.03
        )

        this.battleZone.setDepth(1)

        this.battleZoneLabel = this.add.text(
            400,
            300,
            'DRAG BONEHEAD HERE',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        )

        this.battleZoneLabel.setOrigin(0.5)
        this.battleZoneLabel.setAlpha(0.25)
    }
}