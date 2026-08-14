import Phaser from 'phaser'

import PlayerBenchSystem from '../systems/PlayerBenchSystem'
import EnemyBenchSystem from '../systems/EnemyBenchSystem'
import CombatSystem from '../systems/CombatSystem'
import TurnSystem from '../systems/TurnSystem'
import ArenaSystem from '../systems/ArenaSystem'

import { UIButton } from '../ui/uiButton'
import { UI_STYLES } from '../ui/styles'


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
        this.enemyBench.create()

        // UI
        this.createEndTurnButton()

        // Start combat
        this.turnSystem.start()
    }

    createEndTurnButton() {
        this.endTurnButton = new UIButton(
            this,
            720,
            300,
            `End turn`,
            UI_STYLES.button,
            () => {
                this.turnSystem.endPlayerTurn()
            },
            {
                width: 120,
                height: 75,
            }
        )
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