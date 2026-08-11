import { BONEHEAD_DB } from '../data/boneheadDB'
import { PAINT_EFFECTS } from '../data/paintEffects'

export function getBoneheadStats(bonehead) {
    const baseStats = BONEHEAD_DB[bonehead.typeId].stats

    const stats = {
        accuracy: baseStats.accuracy,
        defence: baseStats.defence
    }

    const paintEffect = PAINT_EFFECTS[bonehead.colour]

    if (!paintEffect) {
        return stats
    }

    if (paintEffect.accuracyMultiplier) {
        stats.accuracy *= paintEffect.accuracyMultiplier
    }

    if (paintEffect.defenceMultiplier) {
        stats.defence *= paintEffect.defenceMultiplier
    }

    if (paintEffect.accuracyBonus) {
        stats.accuracy += paintEffect.accuracyBonus
    }

    if (paintEffect.defenceBonus) {
        stats.defence += paintEffect.defenceBonus
    }

    return stats
}