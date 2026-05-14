import BenchBase from './BenchBase'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { DEPTH } from '../config/depth'

const START_X = 200
const SLOT_SPACING = 100
const PLAYER_Y = 500

const BATTLE_ZONE = {
    x: 400,
    y: 300,
    width: 500,
    height: 220
}

const BATTLE_X = 400
const BATTLE_Y = 380

export default class PlayerBenchSystem extends BenchBase {

    constructor(scene) {
        super(scene)
        this.activeUnit = null
    }

    create(party) {
        this.slots = []
        this.slotPositions = []
        const SLOT_COUNT = party.length;
        const totalWidth = (party.length - 1) * SLOT_SPACING
        const startX = (800 - totalWidth) / 2

        for (let i = 0; i < SLOT_COUNT; i++) {
            this.slots[i] = null;

            this.slotPositions[i] = {
                x: startX + i * SLOT_SPACING,
                y: PLAYER_Y
            };
        }

        party.forEach((unit, i) => {
            const data = BONEHEAD_DB[unit.typeId]
            const pos = this.slotPositions[i];

            const sprite = this.scene.add.image(
                pos.x,
                pos.y,
                data.textures.idleKey
            )

            sprite.slotIndex = i;
            this.slots[i] = sprite;

            sprite.setDisplaySize(64, 64)

            sprite.unit = unit
            sprite.setInteractive({ cursor: 'pointer' })
            this.scene.input.setDraggable(sprite)

            sprite.on('dragstart', () => {
                sprite.setDepth(DEPTH.dragging)
            })

            sprite.on('drag', (p, x, y) => {
                sprite.x = x
                sprite.y = y
            })

            sprite.on('dragend', () => {
                sprite.setDepth(DEPTH.player);

                const slotIndex = this.getNearestSlot(sprite.x, sprite.y);
                const insideBattle = this.isInBattleZone(sprite);

                if (insideBattle) {
                    this.moveToBattle(sprite);
                    this.slots[sprite.slotIndex] = null;
                    return;
                }

                if (slotIndex !== -1) {
                    this.snapToSlot(sprite, slotIndex);
                } else {
                    this.snapToSlot(sprite, sprite.slotIndex);
                }
            });

            this.startBlinking(sprite, data)
            this.sprites.push(sprite)
        })
    }

    isInBattleZone(sprite) {
        return (
            sprite.x > BATTLE_ZONE.x - BATTLE_ZONE.width / 2 &&
            sprite.x < BATTLE_ZONE.x + BATTLE_ZONE.width / 2 &&
            sprite.y > BATTLE_ZONE.y - BATTLE_ZONE.height / 2 &&
            sprite.y < BATTLE_ZONE.y + BATTLE_ZONE.height / 2
        );
    }

    getNearestSlot(x, y) {
        let bestIndex = -1;
        let bestDist = Infinity;

        this.slotPositions.forEach((pos, i) => {
            const dx = x - pos.x;
            const dy = y - pos.y;
            const dist = dx * dx + dy * dy;

            if (dist < bestDist) {
                bestDist = dist;
                bestIndex = i;
            }
        });

        return bestIndex;
    }

    snapToSlot(sprite, targetIndex) {
        const currentIndex = sprite.slotIndex;
        const occupying = this.slots[targetIndex];

        if (occupying && occupying !== sprite) {
            this.slots[currentIndex] = occupying;

            this.scene.tweens.add({
                targets: occupying,
                x: this.slotPositions[currentIndex].x,
                y: PLAYER_Y,
                duration: 200
            });

            occupying.slotIndex = currentIndex;
        } else {
            this.slots[currentIndex] = null;
        }

        this.slots[targetIndex] = sprite;
        sprite.slotIndex = targetIndex;

        this.scene.tweens.add({
            targets: sprite,
            x: this.slotPositions[targetIndex].x,
            y: PLAYER_Y,
            duration: 200
        });
    }

    moveToBattle(sprite) {
        this.scene.tweens.add({
            targets: sprite,
            x: BATTLE_X,
            y: BATTLE_Y,
            duration: 250,
            ease: 'Power2'
        })

        this.activeUnit = sprite
    }

    returnToBench(sprite) {
        this.scene.tweens.add({
            targets: sprite,
            x: sprite.x,
            y: PLAYER_Y,
            duration: 250,
            ease: 'Power2'
        })
    }
}