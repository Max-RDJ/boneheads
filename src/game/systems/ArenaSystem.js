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
        y: 165,
        width: 500,
        height: 250
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
        y: 170
    }
}

const battleZoneRadius = 12
const battleBorderWidth = 5

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
        const radius = 12

        this.battleZone = this.scene.add.graphics()

        this.battleZone.fillStyle(
            0xffffff,
            0
        )

        this.battleZone.fillRoundedRect(
            0,
            0,
            ARENA.battle.width,
            ARENA.battle.height,
            radius
        )

        this.battlePanel.add(this.battleZone)
    }

    drawBattleZone(color, alpha) {
        const inset = battleBorderWidth / 2
        const radius = battleZoneRadius - inset

        this.battleZone.clear()

        this.battleZone.fillStyle(
            color,
            alpha
        )

        this.battleZone.fillRoundedRect(
            inset,
            inset,
            ARENA.battle.width - battleBorderWidth,
            ARENA.battle.height - battleBorderWidth,
            radius
        )
    }

    showBattleZoneHighlight(valid = true) {
        const color = valid
            ? 0x66ff66
            : 0xff6666

        this.drawBattleZone(color, 0.12)
    }

    hideBattleZoneHighlight() {
        this.drawBattleZone(0xffffff, 0)
    }

    glowBattleZoneHighlight() {
        this.drawBattleZone(0x66ff66, 0.24)
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