import { BONEHEAD_COLOURS } from "../data/boneheadColours"
import { BONEHEAD_DB } from "../data/boneheadDB"

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

export function createBoneheadInstance(id) {
    const baseBonehead = BONEHEAD_DB[id]
    const colour = getRandomBoneheadColour()

    return {
        ...baseBonehead,
        colour
    }
}