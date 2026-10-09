import Phaser from 'phaser'


export class RepairIcon extends Phaser.GameObjects.Container {

    constructor(scene, x, y, tooltip, targetScene = 'RepairsScene') {

        super(scene, x, y)

        scene.add.existing(this)

        this.gameScene = scene
        this.tooltip = tooltip
        this.targetScene = targetScene

        this.image = scene.add.image(
            80,
            20,
            'bag'
        )

        this.image.setScale(0.05)

        this.image.setInteractive({
            useHandCursor: true
        })

        this.image.on('pointerdown', () => {

            const returnScene =
                this.gameScene.scene.key

            this.gameScene.scene.pause(
                returnScene
            )

            this.gameScene.scene.launch(
                this.targetScene,
                {
                    returnScene
                }
            )

            this.gameScene.scene.bringToTop(
                this.targetScene
            )
        })

        this.add(this.image)
    }
}