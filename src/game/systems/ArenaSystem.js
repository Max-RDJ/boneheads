import {Panel} from '../ui/Panel'
import { enemies } from '../data/enemyDB'
import { getCurrentEnemy } from './ProgressSystem'


const ARENA = {
    enemyBench: {
        x: 100,
        y: 50,
        width: 600,
        height: 100
    },

    battle: {
        x: 150,
        y: 190,
        width: 500,
        height: 220
    },

    playerBench: {
        x: 100,
        y: 450,
        width: 600,
        height: 100
    }
}

const BATTLE_FORMATION = {
    spacing: 90,

    enemy: {
        y: 50
    },

    player: {
        y: 160
    }
}

export default class ArenaSystem {

    constructor(scene) {
        this.scene = scene
    }

    create() {

        const enemy = getCurrentEnemy()

        this.enemyBenchPanel = new Panel(
            this.scene,
            ARENA.enemyBench.x,
            ARENA.enemyBench.y,
            ARENA.enemyBench.width,
            ARENA.enemyBench.height,
            {
                title: enemy.name
            }
        )

        this.battlePanel = new Panel(
            this.scene,
            ARENA.battle.x,
            ARENA.battle.y,
            ARENA.battle.width,
            ARENA.battle.height,
            {
                title: 'Battle'
            }
        )

        this.playerBenchPanel = new Panel(
            this.scene,
            ARENA.playerBench.x,
            ARENA.playerBench.y,
            ARENA.playerBench.width,
            ARENA.playerBench.height,
            {
                title: 'You'
            }
        )

        this.createBattleZoneIndicator()
    }

    createBattleZoneIndicator() {

        this.battleZone = this.scene.add.rectangle(
            ARENA.battle.width / 2,
            ARENA.battle.height / 2,
            ARENA.battle.width - 20,
            ARENA.battle.height - 20
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

        this.battleZoneLabel = this.scene.add.text(
            ARENA.battle.width / 2,
            ARENA.battle.height / 2,
            'DRAG BONEHEAD HERE',
            {
                fontSize: '24px',
                fontFamily: 'Arial',
                color: '#ffffff'
            }
        )

        this.battleZoneLabel.setOrigin(0.5)

        this.battlePanel.add(this.battleZone)
        this.battlePanel.add(this.battleZoneLabel)
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

    isInBattleZone(sprite) {
        return (
            sprite.x > ARENA.battle.x &&
            sprite.x < ARENA.battle.x + ARENA.battle.width &&
            sprite.y > ARENA.battle.y &&
            sprite.y < ARENA.battle.y + ARENA.battle.height
        )
    }

    getBattlePosition(team, index) {
        const centerX =
            ARENA.battle.width / 2

        const offset =
            (index - 1) * BATTLE_FORMATION.spacing

        const y =
            team === 'enemy'
                ? BATTLE_FORMATION.enemy.y
                : BATTLE_FORMATION.player.y

        return {
            x: ARENA.battle.x + centerX + offset,
            y: ARENA.battle.y + y
        }
    }
}