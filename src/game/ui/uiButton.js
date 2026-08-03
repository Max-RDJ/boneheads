import Phaser from 'phaser'

export class UIButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y, label, style, onClick, overrides = {}) {

        super(
            scene,
            x,
            y,
            label,
            {
                ...style,
                ...overrides
            }
        )

        scene.add.existing(this)

        this.setOrigin(0.5)

        this.setInteractive({ useHandCursor: true })

        this.on('pointerdown', onClick)

        this.on('pointerover', () => this.setScale(1.05))
        this.on('pointerout', () => this.setScale(1))
    }
}