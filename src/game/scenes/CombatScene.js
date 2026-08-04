import Phaser from 'phaser'

import ArenaSystem from '../systems/ArenaSystem'
import PlayerBenchSystem from '../systems/PlayerBenchSystem'
import EnemyBenchSystem from '../systems/EnemyBenchSystem'
import TurnSystem from '../systems/TurnSystem'

import { playerData } from '../state/playerData'
import { enemyParty } from '../state/enemyParty'


function getPlayerUnits() {
    return playerData.bag.map(id =>
        playerData.bag.find(
            unit => unit.instanceId === id
        )
    )
}

function getEnemyUnits() {
    return enemyParty.bag.map(id =>
        enemyParty.bag.find(
            unit => unit.instanceId === id
        )
    )
}
const playerUnits = getPlayerUnits()
const enemyUnits = getEnemyUnits()


export default class CombatScene extends Phaser.Scene {

    constructor() {
        super('CombatScene')
    }

    preload() {
        this.playerBench = new PlayerBenchSystem(this)
        this.enemyBench = new EnemyBenchSystem(this)

    this.playerBench.preload(playerUnits)
        this.enemyBench.preload(enemyParty)
    }

    create() {
        this.arena = new ArenaSystem(this)
        this.arena.create()

        this.createBattleZoneIndicator()

        this.turnSystem = new TurnSystem(this)

        this.playerBench = new PlayerBenchSystem(this)
        this.enemyBench = new EnemyBenchSystem(this)

        this.playerBench.preload(playerUnits)
        this.turnSystem.setPlayerBench(
            this.playerBench.getPlayerUnits()
        )

        this.enemyBench.create(enemyParty)
        this.turnSystem.setEnemyBench(
            this.enemyBench.getEnemyUnits()
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

    createBattleZoneIndicator() {
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

    showBattleZoneHighlight(valid = true) {
        const color = valid
            ? 0x66ff66
            : 0xff6666

        this.battleZone.setStrokeStyle(
            6,
            color,
            0.9
        )

        this.battleZone.setFillStyle(
            color,
            0.12
        )

        this.battleZoneLabel.setAlpha(0.9)
    }

    hideBattleZoneHighlight() {

        this.battleZone.setStrokeStyle(
            4,
            0xffffff,
            0.15
        )

        this.battleZone.setFillStyle(
            0xffffff,
            0.03
        )

        this.battleZoneLabel.setAlpha(0.25)
    }
}