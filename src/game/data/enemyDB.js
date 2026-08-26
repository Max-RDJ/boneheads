import { generateInstanceId } from "../helpers/generateInstanceId"

export const enemies =[
    {
        name: "Timmy",
        bag: [
            {
                typeId: "beefhead",
                colour: "blue"    
            },
            {
                typeId: "beefhead",
                colour: "blue"    
            },
            {
                typeId: "beefhead",
                colour: "blue"    
            },
        ],
        enemyTier: 1,
        reward: 3,
        quote: "Wanna pway?",
        boss: false
    },
    {
        name: "Jimmy",
        bag: [
            {
                typeId: "ploder",
                colour: "blue"    
            },
            {
                typeId: "beefhead",
                colour: "blue"    
            },
            {
                typeId: "beefhead",
                colour: "red"    
            },
        ],
        enemyTier: 1,
        reward: 3,
        quote: "At least I'm not Timmy.",
        boss: false
    },
    {
        name: "Bimmy",
        bag: [
            {
                typeId: "julius",
                colour: "blue"    
            },
            {
                typeId: "beefhead",
                colour: "blue"    
            },
            {
                typeId: "beefhead",
                colour: "blue"    
            },
        ],
        enemyTier: 1,
        reward: 8,
        quote: "I'm bimmyyyyy!",
        boss: true
    },
]