import { BONEHEAD_DB } from '../data/boneheadDB'
import { PAINT_EFFECTS } from '../data/paintEffects'

export function getBoneheadStats(bonehead) {
    const baseStats = BONEHEAD_DB[bonehead.typeId].stats

    const stats = {
        attack: baseStats.attack,
        maxHp: baseStats.maxHp,
        currentHp: bonehead.currentHp ?? baseStats.maxHp,
        maxGuard: baseStats.maxGuard ?? baseStats.guard ?? Math.round(baseStats.maxHp / 2)
    }

    const paintEffect = PAINT_EFFECTS[bonehead.colour]

    if (paintEffect?.attackMultiplier) {
        stats.attack *= paintEffect.attackMultiplier
    }

    return stats
}