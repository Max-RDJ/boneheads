import Phaser from 'phaser'

import { BONEHEAD_DB } from '../data/boneheadDB'
import { UI_STYLES } from './styles'
import { UIButton } from './uiButton'
import { COLOURS } from './ColourMap'


export class RoundCard extends Phaser.GameObjects.Container {

    constructor(
        scene,
        x,
        y,
        enemy,
        roundNumber,
        enabled,
        onStart,
        tooltip
    ) {

        super(scene, x, y)

        this.scene = scene
        this.enemy = enemy
        this.tooltip = tooltip

        scene.add.existing(this)

        this.createBackground()
        this.createEnemyName(roundNumber)
        this.createQuote()
        this.createBoneheads()
        this.createReward()
        this.createStartButton(enabled, onStart)
    }

    createBackground() {

        this.background = this.scene.add.rectangle(
            0,
            0,
            220,
            360,
            0x222222
        )

        this.background.setStrokeStyle(
            2,
            0xffffff
        )

        this.add(this.background)
    }

    createEnemyName(roundNumber) {

        const text = this.scene.add.text(
            0,
            -145,
            `ROUND ${roundNumber}\n${this.enemy.name}`,
            UI_STYLES.subtitle
        ).setOrigin(0.5)

        this.add(text)
    }

    createQuote() {

        const text = this.scene.add.text(
            0,
            -85,
            `"${this.enemy.quote}"`,
            UI_STYLES.bodySmall
        ).setOrigin(0.5)

        text.setWordWrapWidth(190)

        this.add(text)
    }

    createBoneheads() {

        const background = this.scene.add.rectangle(
            0,
            10,
            190,
            100,
            0x111111
        )

        background.setStrokeStyle(
            1,
            0xffffff
        )

        this.add(background)

        this.enemy.bag.forEach((bonehead, index) => {

            const x =
                -60 + index * 60

            const y = 10

            const textureKey =
                `${bonehead.typeId}_idle_${bonehead.colour}`

            const image = this.scene.add.image(
                x,
                y,
                textureKey
            )

            image.setDisplaySize(50, 50)

            image.setInteractive({
                useHandCursor: true
            })

            image.on('pointermove', pointer => {

                const data =
                    BONEHEAD_DB[bonehead.typeId]

                this.tooltip.show(
                    pointer,
                    data.name,
                    `Attack: ${data.stats.attack}\nHP: ${data.stats.hp}`,
                    COLOURS[bonehead.colour]
                )
            })

            image.on('pointerout', () => {
                this.tooltip.hide()
            })

            this.add(image)
        })
    }

    createReward() {

        const text = this.scene.add.text(
            0,
            85,
            `Reward: ¢${this.enemy.reward}`,
            UI_STYLES.body
        ).setOrigin(0.5)

        this.add(text)
    }

    createStartButton(enabled, onStart) {

        this.startButton = new UIButton(
            this.scene,
            0,
            135,
            enabled ? 'Start Round' : 'Locked',
            enabled
                ? UI_STYLES.button
                : UI_STYLES.buttonDisabled,
            () => {
                if (enabled) {
                    onStart()
                }
            },
            {
                width: 160,
                height: 55
            }
        )

        this.add(this.startButton)
    }
}