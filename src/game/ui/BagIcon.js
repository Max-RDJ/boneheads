import Phaser from 'phaser'


export class BagIcon extends Phaser.GameObjects.Container {

    constructor(scene, x, y, tooltip) {

        super(scene, x, y)

        scene.add.existing(this)

        this.gameScene = scene
        this.tooltip = tooltip

        this.image = scene.add.image(
            80,
            20,
            'bag'
        )

        this.image.setScale(0.05)

        this.image.setInteractive({
            useHandCursor: true
        })

        this.image.on('pointerover', (pointer) => {
            this.tooltip.show(
                pointer,
                'View full bag'
            )
        })

        this.image.on('pointerout', () => {
            this.tooltip.hide()
        })

        this.image.on('pointerdown', () => {
            this.gameScene.scene.start('InventoryScene')
        })

        this.add(this.image)
    }
}