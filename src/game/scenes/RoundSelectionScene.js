import Phaser from 'phaser'

import { enemies } from '../data/enemyDB'
import { CoinCounter } from '../ui/CoinCounter'
import { ROUND_SELECTION_LAYOUT } from '../ui/layout'
import { Tooltip } from '../ui/Tooltip'
import { UI_STYLES } from '../ui/styles'
import { RoundCard } from '../ui/RoundCard'
import { progressData } from '../systems/ProgressSystem'


export default class RoundSelectionScene extends Phaser.Scene {

    constructor() {
        super('RoundSelectionScene')
    }

    create() {

        this.tooltip = new Tooltip(this)

        this.coinCounter = new CoinCounter(
            this,
            680,
            30
        )

        this.add.text(
            400,
            40,
            'Choose Your Round',
            UI_STYLES.title
        ).setOrigin(0.5)

        this.createRoundCards()
    }

    createRoundCards() {

        this.roundCards = []

        const currentRound =
            progressData.currentEnemy % 3
        const startEnemy =
            Math.floor(progressData.currentEnemy / 3) * 3
        const tierEnemies =
            enemies.slice(startEnemy, startEnemy + 3)
        const layout = ROUND_SELECTION_LAYOUT.cards

        tierEnemies.forEach((enemy, index) => {

            const x =
                layout.startX +
                index * layout.spacing

            const y = layout.y

            const isCurrentRound =
                index === currentRound

            const card = new RoundCard(
                this,
                x,
                y,
                enemy,
                index + 1,
                isCurrentRound,
                () => {
                    this.scene.start('CombatScene')
                },
                this.tooltip
            )

            this.roundCards.push(card)
        })
    }
}