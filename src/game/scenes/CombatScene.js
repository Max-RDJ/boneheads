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
        this.actionButtons = []

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

        this.endTurnButton.setEnabled(false)
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

    showAttackOptions(unit) {
        this.hideActionOptions()

        const enemies =
            this.enemyBench.getBattleUnits()

        enemies.forEach(enemy => {

            if (enemy.isDead) {
                return
            }

            const button = this.add.text(
                enemy.x,
                enemy.y - 50,
                '⚔',
                {
                    fontSize: '28px',
                    color: '#ffffff'
                }
            )

            button.setOrigin(0.5)

            button.setInteractive({
                cursor: 'pointer'
            })

            button.on('pointerdown', () => {
                this.combatSystem.attack(
                    unit,
                    enemy
                )
            })

            this.actionButtons.push(button)
        })
    }

    showGuardOption(unit) {
        const button = this.add.text(
            unit.x,
            unit.y + 50,
            '🛡',
            {
                fontSize: '28px'
            }
        )

        button.setOrigin(0.5)

        button.setInteractive({
            cursor: 'pointer'
        })

        button.on('pointerdown', () => {
            this.combatSystem.guard(unit)
        })

        this.actionButtons.push(button)
    }

    hideActionOptions() {
        this.actionButtons.forEach(button => {
            button.destroy()
        })

        this.actionButtons = []
    }

}