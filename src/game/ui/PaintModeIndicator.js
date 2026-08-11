import Phaser from 'phaser'

export class PaintModeIndicator extends Phaser.GameObjects.Container {

    constructor(scene, texture, colour) {
        super(scene)

        scene.add.existing(this)

        this.brush = scene.add.image(
            0,
            0,
            texture
        )

        this.brush.setScale(0.6)

        this.add(this.brush)

        this.setDepth(10000)
        this.setVisible(false)

        scene.input.on('pointermove', this.updatePosition, this)
    }

    updatePosition(pointer) {
        this.setPosition(
            pointer.worldX + 12,
            pointer.worldY + 12
        )
    }

    setColour(colour) {
        this.brush.setTexture(`paint_brush_${colour}.png`)
    }

    show() {
        this.setVisible(true)
    }

    hide() {
        this.setVisible(false)
    }

    destroy(fromScene) {
        this.scene.input.off(
            'pointermove',
            this.updatePosition,
            this
        )

        super.destroy(fromScene)
    }
}