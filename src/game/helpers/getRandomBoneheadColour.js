import { BONEHEAD_COLOURS } from "../data/boneheadColours"

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