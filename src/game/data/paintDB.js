export const PAINT_DB = {
    red: {
        id: "red",
        name: "Red Paint",
        colour: "red",
        textures: {
            key: "paint_red",
            url: "/assets/paint/paint_red.png",
        },
        description: "Double Bonehead accuracy; Bonehead is destroyed after 3 rounds.",
        price: 10,
        sizes: ["10ml", "30ml", "50ml"]
    },
    blue: {
        id: "blue",
        name: "Blue Paint",
        colour: "blue",
        textures: {
            key: "paint_blue",
            url: "/assets/paint/paint_blue.png",
        },
        description: "Remove all paint effects from Bonehead.",
        price: 10,
        sizes: ["10ml", "30ml", "50ml"]
    },
    green: {
        id: "green",
        name: "Green Paint",
        colour: "green",
        textures: {
            key: "paint_green",
            url: "/assets/paint/paint_green.png",
        },
        description: "Bonehead does not incur cost if knocked out.",
        price: 10,
        sizes: ["10ml", "30ml", "50ml"]
    },
    magenta: {
        id: "magenta",
        name: "Magenta Paint",
        colour: "magenta",
        textures: {
            key: "paint_magenta",
            url: "/assets/paint/paint_magenta.png",
        },
        description: "When played, creates a random Bonehead and destroys this Bonehead.",
        price: 10,
        sizes: ["10ml", "30ml", "50ml"]
    },
}