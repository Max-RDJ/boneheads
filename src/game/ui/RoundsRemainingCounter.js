import Phaser from 'phaser'

export class RoundsRemainingCounter extends Phaser.GameObjects.Container {

    constructor(bonehead, roundsRemaining, colour) {

        super(
            bonehead.scene,
            0,
            0
        )

        this.bonehead = bonehead

        this.offsetX = 300
        this.offsetY = -350

        this.radius = 13

        this.createBackground(colour)
        this.createText(roundsRemaining, colour)

        this.setDepth(1000)

        bonehead.scene.add.existing(this)

        this.updatePosition()

        this.scene.events.on(
            Phaser.Scenes.Events.POST_UPDATE,
            this.updatePosition,
            this
        )

        bonehead.once(
            Phaser.GameObjects.Events.DESTROY,
            this.destroy,
            this
        )
    }

    createBackground(colour) {

        this.circle = this.scene.add.circle(
            0,
            0,
            this.radius
        )

        this.circle.setFillStyle(
            0x222222,
            1
        )

        this.circle.setStrokeStyle(
            2,
            colour,
            1
        )

        this.add(this.circle)
    }

    createText(roundsRemaining, colour) {

        this.text = this.scene.add.text(
            0,
            0,
            roundsRemaining.toString(),
            {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: Phaser.Display.Color
                    .IntegerToColor(colour)
                    .rgba,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5)

        this.add(this.text)
    }

    updatePosition() {

        if (!this.bonehead || !this.bonehead.active) {
            return
        }

        const worldPoint =
            this.bonehead.getWorldTransformMatrix()
                .transformPoint(
                    this.offsetX,
                    this.offsetY
                )

        this.setPosition(
            worldPoint.x,
            worldPoint.y
        )
    }

    update(roundsRemaining) {
        this.text.setText(
            roundsRemaining.toString()
        )
    }

    destroy(fromScene) {

        if (this.scene) {
            this.scene.events.off(
                Phaser.Scenes.Events.POST_UPDATE,
                this.updatePosition,
                this
            )
        }

        if (this.bonehead) {
            this.bonehead.off(
                Phaser.GameObjects.Events.DESTROY,
                this.destroy,
                this
            )
        }

        super.destroy(fromScene)
    }
}