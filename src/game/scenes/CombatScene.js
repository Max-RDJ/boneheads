import Phaser from 'phaser'
import PlayerBenchSystem from '../systems/PlayerBenchSystem'
import EnemyBenchSystem from '../systems/EnemyBenchSystem'
import ArenaSystem from '../systems/ArenaSystem'

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

        this.playerBench.create(playerParty)
        this.enemyBench.create(enemyParty)
    }
}