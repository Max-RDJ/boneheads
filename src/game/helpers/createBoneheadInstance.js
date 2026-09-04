import { BONEHEAD_COLOURS } from "../data/boneheadColours"
import { BONEHEAD_DB } from "../data/boneheadDB"
import { PAINT_EFFECTS } from "../data/paintEffects"

export function getRandomBoneheadColour() {

    const colours = Object.entries(BONEHEAD_COLOURS)

    const totalWeight = colours.reduce(
        (total, [, data]) => total + data.weight,
        0
    )

    let random = Math.random() * totalWeight

    for (const [colour, data] of colours) {

        random -= data.weight

        if (random <= 0) {
            return colour
        }
    }

    return 'blue'
}

export function createBoneheadInstance(id, colour) {

    const bonehead = BONEHEAD_DB[id]

    const selectedColour =
        colour ?? getRandomBoneheadColour()

    const paintEffect =
        PAINT_EFFECTS[selectedColour]

    return {
        typeId: id,
        colour: selectedColour,
        attack: bonehead.stats.attack,
        maxHp: bonehead.stats.hp,
        currentHp: bonehead.stats.hp,
        maxGuard: Math.round(bonehead.stats.hp / 2),
        currentGuard: 0,

        roundsRemaining:
            paintEffect?.roundsRemaining ?? null
    }
}