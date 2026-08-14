import { BONEHEAD_DB } from '../data/boneheadDB'
import { PAINT_EFFECTS } from '../data/paintEffects'

export function getBoneheadStats(bonehead) {
    const baseStats = BONEHEAD_DB[bonehead.typeId].stats

    const stats = {
        attack: baseStats.attack,
        hp: baseStats.hp,
        guard: baseStats.guard
    }

    const paintEffect = PAINT_EFFECTS[bonehead.colour]

    if (!paintEffect) {
        return stats
    }

    if (paintEffect.attackMultiplier) {
        stats.attack *= paintEffect.attackMultiplier
    }

    if (paintEffect.roundsRemaining) {
        stats.roundsRemaining = paintEffect.roundsRemaining
    }

    return stats
}