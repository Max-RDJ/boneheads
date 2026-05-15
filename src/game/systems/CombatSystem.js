import { BONEHEAD_DB } from '../data/boneheadDB'


export default class CombatSystem {
    constructor(scene) {
        this.scene = scene
    }

    getHitChance(attackerStats, defenderStats) {
        const acc = attackerStats.accuracy
        const size = defenderStats.size

        let chance = acc / (acc + size)

        const variance =
            (Math.random() - 0.5) * 0.2

        chance += variance

        return Math.min(
            0.95,
            Math.max(0.05, chance)
        )
    }

    attack(attackerSprite, defenderSprite) {
        if (!attackerSprite || !defenderSprite) {
            console.warn('Missing sprites')
            return false
        }

        if (!attackerSprite.unit || !defenderSprite.unit) {
            console.warn('Missing unit data:', attackerSprite, defenderSprite)
            return false
        }

        const attackerData =
            BONEHEAD_DB[attackerSprite.unit.typeId]

        const defenderData =
            BONEHEAD_DB[defenderSprite.unit.typeId]

        if (!attackerData || !defenderData) {
            console.warn('Missing bonehead DB data')
            return false
        }

        const chance = this.getHitChance(
            attackerData.stats,
            defenderData.stats
        )

        console.log(
            `${attackerData.name} attacks ${defenderData.name}`,
            `(${Math.round(chance * 100)}% hit chance)`
        )

        const hit = Math.random() < chance

        if (hit) {
            console.log('HIT')
            this.defeat(defenderSprite)
            return true
        }

        console.log('MISS')

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
