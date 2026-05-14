import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'

const GAME_WIDTH = 800;

const SLOT_SPACING = 100;
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
        this.scene = scene;

        this.playerBench = [];
        this.activePlayerBonehead = null;
    }

    preload(playerParty) {
        playerParty.forEach(unit => {
            const data = BONEHEAD_DB[unit.typeId];
            if (!data) return;

            this.scene.load.image(data.textures.idleKey, data.textures.idleUrl);
            this.scene.load.image(data.textures.blinkKey, data.textures.blinkUrl);
        });
    }

    create(playerParty) {
        const count = playerParty.length;
        const totalWidth = (count - 1) * SLOT_SPACING;
        const startX = (GAME_WIDTH - totalWidth) / 2;

        playerParty.forEach((unit, i) => {
            const data = BONEHEAD_DB[unit.typeId];
            if (!data) return;

            const x = startX + i * SLOT_SPACING;

            const sprite = this.scene.add.image(
                x,
                PLAYER_BENCH_Y,
                data.textures.idleKey
            );

            sprite.setDisplaySize(64, 64);

            sprite.benchX = x;
            sprite.benchY = PLAYER_BENCH_Y;

            sprite.unitData = unit;
            sprite.boneheadData = data;

            sprite.setInteractive({ cursor: 'pointer' });
            this.scene.input.setDraggable(sprite);

            sprite.on('drag', (pointer, dragX, dragY) => {
                sprite.x = dragX;
                sprite.y = dragY;
            });

            sprite.on('dragend', () => {
                const inside =
                    sprite.x > BATTLE_ZONE.x - BATTLE_ZONE.width / 2 &&
                    sprite.x < BATTLE_ZONE.x + BATTLE_ZONE.width / 2 &&
                    sprite.y > BATTLE_ZONE.y - BATTLE_ZONE.height / 2 &&
                    sprite.y < BATTLE_ZONE.y + BATTLE_ZONE.height / 2;

                if (inside) {
                    this.moveToBattleZone(sprite);
                } else {
                    this.returnToBench(sprite);
                }
            });

            this.playerBench.push(sprite);

            this.startBlinking(sprite, data);
        });
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
            duration: 250,
            ease: 'Power2'
        });

        this.activePlayerBonehead = sprite;
    }

    returnToBench(sprite) {
        this.scene.tweens.add({
            targets: sprite,
            x: sprite.benchX,
            y: sprite.benchY,
            duration: 250,
            ease: 'Power2'
        });

        if (this.activePlayerBonehead === sprite) {
            this.activePlayerBonehead = null;
        }
    }

    startBlinking(sprite, data) {
        const blink = () => {
            sprite.setTexture(data.textures.blinkKey);

            this.scene.time.delayedCall(120, () => {
                sprite.setTexture(data.textures.idleKey);
            });

            this.scene.time.delayedCall(
                Phaser.Math.Between(2000, 5000),
                blink
            );
        };

        blink();
    }
}