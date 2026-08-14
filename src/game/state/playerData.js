import { BAG_SIZES } from "../data/bagDB"

export const playerData = {
    coins: 100,

    bag: {
        size: 'small',
        contents: []
    },

    paint: [
    ],

    shop: {
        boneheads: null,
        boosters: null,
        paints: null,
        rerollCount: 0
    },

}

export function checkBagFull() {
    return playerData.bag.contents.length >= BAG_SIZES[playerData.bag.size].capacity
}