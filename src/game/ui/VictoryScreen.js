import Phaser from 'phaser'
import { UIButton } from './uiButton'
import { UI_STYLES } from './styles'

export class VictoryScreen extends Phaser.GameObjects.Container {

    constructor(scene, reward, onContinue) {
        super(scene, 0, 0)

        scene.add.existing(this)

        this.setDepth(10000)

        const width = scene.scale.width
        const height = scene.scale.height

        this.overlay = scene.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000,
            0.65
        )

        this.overlay.setInteractive()

        this.add(this.overlay)

        // Modal
        const modalWidth = 400
        const modalHeight = 300

        this.background = scene.add.graphics()

        this.background.fillStyle(0x1e293b, 1)
        this.background.lineStyle(5, 0x475569)

        this.background.fillRoundedRect(
            (width - modalWidth) / 2,
            (height - modalHeight) / 2,
            modalWidth,
            modalHeight,
            16
        )

        this.background.strokeRoundedRect(
            (width - modalWidth) / 2,
            (height - modalHeight) / 2,
            modalWidth,
            modalHeight,
            16
        )

        this.add(this.background)

        this.title = scene.add.text(
            width / 2,
            height / 2 - 90,
            'VICTORY!',
            UI_STYLES.title
        )

        this.title.setOrigin(0.5)

        this.add(this.title)

        this.rewardText = scene.add.text(
            width / 2,
            height / 2 - 20,
            `Reward: ¢${reward}`,
            UI_STYLES.body
        )

        this.rewardText.setOrigin(0.5)

        this.add(this.rewardText)

        this.continueButton = new UIButton(
            scene,
            width / 2,
            height / 2 + 80,
            'Continue to Shop',
            UI_STYLES.button,
            onContinue,
            {
                width: 200,
                height: 60
            }
        )

        this.add(this.continueButton)
    }
}