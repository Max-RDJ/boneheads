export const BOOSTER_DB = {
    standard: {
        id: "standard",
        name: "Standard Pack",
        textures: {
            key: "standard_booster",
            url: "/assets/boosters/standard_booster.png",
        },
        contentsCount: 5,
        description: "A standard booster pack containing 5 random Boneheads.",
        price: 10,
        weight: 60
    },
    mega: {
        id: "mega",
        name: "Mega Pack",
        textures: {
            key: "mega_booster",
            url: "/assets/boosters/standard_booster.png",
        },
        contentsCount: 5,
        price: 20,
        weight: 30
    },
    mystery: {
        id: "mystery",
        name: "Mystery Box",
        textures: {
            key: "mystery_booster",
            url: "/assets/boosters/mystery_booster.png",
        },
        contentsCount: 1,
        price: 30,
        weight: 10
    },
}