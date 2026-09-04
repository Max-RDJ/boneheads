import { playerData } from "../state/playerData"

export function countdownBoneheadRoundsRemaining(bonehead) {

    if (bonehead.roundsRemaining == null) {
        return
    }

    bonehead.roundsRemaining--

    if (bonehead.roundsRemaining <= 0) {

        const index =
            playerData.bag.contents.findIndex(
                item =>
                    item.instanceId === bonehead.instanceId
            )

        if (index !== -1) {
            playerData.bag.contents.splice(index, 1)
        }
    }
}