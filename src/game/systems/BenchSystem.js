import Phaser from 'phaser'

const PLAYER_BENCH_Y = 500;
const PLAYER_BATTLE_X = 400;
const PLAYER_BATTLE_Y = 350;

const BATTLE_ZONE = {
    x: 400,
    y: 300,
    width: 500,
    height: 220
};

export default class BenchSystem {

    constructor(scene) {
        this.scene = scene
        this.playerBench = []
        this.opponentBench = []
        this.activePlayerBonehead = null
    }

    preload(boneheads) {

        boneheads.forEach(b => {

            this.scene.load.image(
                b.textures.idleKey,
                b.textures.idleUrl
            )

            this.scene.load.image(
                b.textures.blinkKey,
                b.textures.blinkUrl
            )
        })
    }

    create(boneheads) {

        boneheads.forEach((b, i) => {

            const x = 200 + i * 120

            const sprite = this.scene.add.image(
                x,
                PLAYER_BENCH_Y,
                b.textures.idleKey
            )

            sprite.setDisplaySize(64, 64)

            sprite.benchX = x
            sprite.benchY = PLAYER_BENCH_Y

            sprite.boneheadData = b

            sprite.setInteractive({ cursor: 'pointer' })
            this.scene.input.setDraggable(sprite);

            sprite.on('drag', (pointer, dragX, dragY) => {
                sprite.x = dragX;
                sprite.y = dragY;
            });

            sprite.on('dragend', () => {
                const insideBattleZone =
                    sprite.x > BATTLE_ZONE.x - BATTLE_ZONE.width / 2 &&
                    sprite.x < BATTLE_ZONE.x + BATTLE_ZONE.width / 2 &&
                    sprite.y > BATTLE_ZONE.y - BATTLE_ZONE.height / 2 &&
                    sprite.y < BATTLE_ZONE.y + BATTLE_ZONE.height / 2;

                if (insideBattleZone) {

                    this.moveToBattleZone(sprite);

                } else {

                    this.returnToBench(sprite);
                }
            });

            this.playerBench.push(sprite)

            this.startBlinking(sprite, b)
        })
    }

    moveToBattleZone(sprite) {
        if (
            this.activePlayerBonehead &&
            this.activePlayerBonehead !== sprite
        ) {
            this.returnToBench(this.activePlayerBonehead);
        }

        this.scene.tweens.add({
            targets: sprite,
            x: PLAYER_BATTLE_X,
            y: PLAYER_BATTLE_Y,
            duration: 300,
            ease: 'Power2'
        });

        this.activePlayerBonehead = sprite;
    }

    returnToBench(sprite) {
        this.scene.tweens.add({
            targets: sprite,
            x: sprite.benchX,
            y: sprite.benchY,
            duration: 300,
            ease: 'Power2'
        });
    }

    startBlinking(sprite, bonehead) {

        const blink = () => {

            sprite.setTexture(
                bonehead.textures.blinkKey
            )

            this.scene.time.delayedCall(120, () => {

                sprite.setTexture(
                    bonehead.textures.idleKey
                )
            })

            this.scene.time.delayedCall(
                Phaser.Math.Between(2000, 5000),
                blink
            )
        }

        blink()
    }
}