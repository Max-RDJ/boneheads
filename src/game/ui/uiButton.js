import Phaser from 'phaser'

export class UIButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, label, style, onClick) {
        super(scene, x, y, label, style)

        scene.add.existing(this)

        this.setInteractive({ useHandCursor: true })

        this.on('pointerdown', onClick)

        this.on('pointerover', () => this.setScale(1.05))
        this.on('pointerout', () => this.setScale(1))
    }
}