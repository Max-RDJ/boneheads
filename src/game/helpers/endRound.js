import { playerData } from "../state/playerData"
import { countdownBoneheadRoundsRemaining } from "./countdownBoneheadRoundsRemaining"

export function endRound() {
    playerData.bag.contents.forEach(bonehead => {
        countdownBoneheadRoundsRemaining(bonehead)
    })
}