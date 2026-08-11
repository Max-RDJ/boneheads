import Phaser from 'phaser'

export class PaintModeIndicator extends Phaser.GameObjects.Container {

    constructor(scene, colour) {
        super(scene)

        scene.add.existing(this)

        this.brush = scene.add.image(
            0,
            0,
            `paint_brush_${colour}`
        )

        this.brush.setScale(0.2)

        this.add(this.brush)

        this.setDepth(10000)
        this.setVisible(false)

        scene.input.on('pointermove', this.updatePosition, this)
    }

    updatePosition(pointer) {
        this.setPosition(
            pointer.x + 36,
            pointer.y + -28
        )
    }

    setColour(colour) {
        this.brush.setTexture(`paint_brush_${colour}`)
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