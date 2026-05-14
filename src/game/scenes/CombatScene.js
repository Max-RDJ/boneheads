import Phaser from 'phaser'
import BenchSystem from '../systems/BenchSystem'
import { playerBoneheads } from '../state/boneheads'

export default class CombatScene extends Phaser.Scene {

    constructor() {
        super('CombatScene')
    }

    preload() {
        this.benchSystem = new BenchSystem(this)
        this.benchSystem.preload(playerBoneheads)
    }

    create() {
        this.benchSystem.create(playerBoneheads)
    }
}