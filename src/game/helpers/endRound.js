import { countdownBoneheadRoundsRemaining } from "./countdownBoneheadRoundsRemaining"
import { playerData } from "../state/playerData"

playerData.bag.contents.forEach(bonehead => {
    countdownBoneheadRoundsRemaining(bonehead)
})