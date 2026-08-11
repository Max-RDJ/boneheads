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

    if (paintEffect.roundsRemaining) {
        stats.roundsRemaining = paintEffect.roundsRemaining
    }

    return stats
}