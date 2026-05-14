import { BONEHEAD_DB } from '../data/boneheadDB'

export default class CombatSystem {
    constructor(scene) {
        this.scene = scene
    }

    getHitChance(attacker, defender) {
        const acc = attacker.stats.accuracy;
        const size = defender.stats.size;

        let chance = acc / (acc + size);

        const variance = (Math.random() - 0.5) * 0.2;
        chance += variance;

        return Math.min(0.95, Math.max(0.05, chance));
    }

    attack(attackerSprite, defenderSprite) {
        if (!attackerSprite?.unit || !defenderSprite?.unit) {
            console.warn('Missing unit data:', attackerSprite, defenderSprite)
            return false
        }

        const chance = this.getHitChance(
            attackerSprite.unit,
            defenderSprite.unit
        )

        const hit = Math.random() < chance

        if (hit) {
            this.defeat(defenderSprite)
            return true
        }

        return false
    }

    defeat(sprite) {
        sprite.isDead = true

        this.scene.tweens.add({
            targets: sprite,
            alpha: 0,
            scale: 0,
            duration: 300
        })
    }
}
