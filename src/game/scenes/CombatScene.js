import Phaser from 'phaser'
import BenchSystem from '../systems/BenchSystem'
import ArenaSystem from '../systems/ArenaSystem';
import { playerParty } from '../state/playerParty'
import { BONEHEAD_DB } from '../data/boneheadDB'

const PLAYER_BATTLE_X = 400;
const PLAYER_BATTLE_Y = 380;

export default class CombatScene extends Phaser.Scene {

    constructor() {
        super('CombatScene')
    }

    preload() {
        this.benchSystem = new BenchSystem(this)
        this.benchSystem.preload(playerParty)
    }

    create() {
        this.arenaSystem = new ArenaSystem(this)
        this.arenaSystem.create()

        this.benchSystem = new BenchSystem(this)
        this.benchSystem.create(playerParty, BONEHEAD_DB)
    }
}