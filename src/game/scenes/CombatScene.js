import Phaser from 'phaser'

import PlayerBenchSystem from '../systems/PlayerBenchSystem'
import EnemyBenchSystem from '../systems/EnemyBenchSystem'
import CombatSystem from '../systems/CombatSystem'
import TurnSystem from '../systems/TurnSystem'
import ArenaSystem from '../systems/ArenaSystem'
import { VictoryScreen } from '../ui/VictoryScreen'
import { advanceEnemy } from '../systems/ProgressSystem'

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
        this.createHealthBars()

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
        button.setDepth(1001)

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

    createHealthBars() {
        this.healthBars = new Map()

        const allUnits = [
            ...this.playerBench.sprites,
            ...this.enemyBench.sprites
        ]

        allUnits.forEach(sprite => {
            const bars = {
                hpBar: this.add.graphics(),
                hpText: this.add.text(
                    sprite.x,
                    sprite.y,
                    `${sprite.hp}/${sprite.maxHp}`,
                    {
                        fontSize: '10px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        align: 'center'
                    }
                ),

                guardBar: this.add.graphics(),
                guardText: this.add.text(
                    sprite.x,
                    sprite.y,
                    `${sprite.guard}/${sprite.maxGuard}`,
                    {
                        fontSize: '10px',
                        fontFamily: 'Arial',
                        color: '#ffffff',
                        align: 'center'
                    }
                )
            }

            bars.hpText.setOrigin(0.5)
            bars.guardText.setOrigin(0.5)

            bars.hpBar.setDepth(100)
            bars.hpText.setDepth(101)

            bars.guardBar.setDepth(100)
            bars.guardText.setDepth(101)

            this.healthBars.set(sprite, bars)
        })
    }

    updateHealthBars() {
        if (!this.healthBars) {
            return
        }

        this.healthBars.forEach((bars, sprite) => {

            if (sprite.isDead) {
                bars.hpBar.clear()
                bars.guardBar.clear()

                bars.hpText.setVisible(false)
                bars.guardText.setVisible(false)

                return
            }

            const width = 64
            const height = 12

            const x = sprite.x - width / 2
            const hpY = sprite.y + 36
            const guardY = sprite.y + 50

            // HP
            bars.hpBar.clear()

            bars.hpBar.fillStyle(0x990A17)
            bars.hpBar.fillRect(
                x,
                hpY,
                width,
                height
            )

            const radius = 4

            bars.hpBar.clear()

            // Shadow
            bars.hpBar.fillStyle(0x000000, 0.5)
            bars.hpBar.fillRoundedRect(
                x + 2,
                hpY + 2,
                width,
                height,
                radius
            )

            // Outer border
            bars.hpBar.fillStyle(0x111111, 1)
            bars.hpBar.fillRoundedRect(
                x,
                hpY,
                width,
                height,
                radius
            )

            // Empty HP background
            bars.hpBar.fillStyle(0x990A17, 1)
            bars.hpBar.fillRoundedRect(
                x + 1,
                hpY + 1,
                width - 2,
                height - 2,
                radius - 1
            )

            // HP fill
            const hpRatio =
                Math.max(
                    0,
                    Math.min(1, sprite.hp / sprite.maxHp)
                )

            if (hpRatio > 0) {
                bars.hpBar.fillStyle(0x44aa44, 1)
                bars.hpBar.fillRoundedRect(
                    x + 1,
                    hpY + 1,
                    (width - 2) * hpRatio,
                    height - 2,
                    radius - 1
                )
            }

            bars.hpText.setPosition(
                sprite.x,
                hpY + height / 2
            )

            bars.hpText.setText(
                `${sprite.hp}/${sprite.maxHp}`
            )

            bars.hpText.setVisible(true)


            // GUARD
            bars.guardBar.clear()

            if (sprite.guard > 0) {
                const radius = 4

                const guardRatio =
                    Math.max(
                        0,
                        Math.min(1, sprite.guard / sprite.maxGuard)
                    )

                // Shadow
                bars.guardBar.fillStyle(0x000000, 0.5)
                bars.guardBar.fillRoundedRect(
                    x + 2,
                    guardY + 2,
                    width,
                    height,
                    radius
                )

                // Outer border
                bars.guardBar.fillStyle(0x111111, 1)
                bars.guardBar.fillRoundedRect(
                    x,
                    guardY,
                    width,
                    height,
                    radius
                )

                // Empty guard background
                bars.guardBar.fillStyle(0x333333, 1)
                bars.guardBar.fillRoundedRect(
                    x + 1,
                    guardY + 1,
                    width - 2,
                    height - 2,
                    radius - 1
                )

                // Guard fill
                if (guardRatio > 0) {
                    bars.guardBar.fillStyle(0x0096FF, 1)
                    bars.guardBar.fillRoundedRect(
                        x + 1,
                        guardY + 1,
                        (width - 2) * guardRatio,
                        height - 2,
                        radius - 1
                    )
                }

                bars.guardText.setPosition(
                    sprite.x,
                    guardY + height / 2
                )

                bars.guardText.setText(
                    `${sprite.guard}/${sprite.maxGuard}`
                )

                bars.guardText.setVisible(true)

            } else {
                bars.guardText.setVisible(false)
            }
        })
    }

    update() {
        this.updateHealthBars()
    }

    showVictoryScreen(reward) {
        this.endTurnButton.setEnabled(false)

        this.victoryScreen = new VictoryScreen(
            this,
            reward,
            () => {
                advanceEnemy()
                this.scene.start('ShopScene', {
                    refreshShop: true
                })
            }
        )
    }

}