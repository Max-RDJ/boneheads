import { playerData } from '../state/playerData.js';

export function repairBonehead(bonehead) {
    const repairCost = 10

    if (playerData.coins < repairCost) {
        this.repairsPanel.errorOverlay?.showMessage(
            'You broke, pal?'
        )
        return
    }

    const bagBonehead = playerData.bag.contents.find(
        item => item.instanceId === bonehead.instanceId
    )

    if (!bagBonehead) {
        return
    }

    playerData.coins -= repairCost

    bagBonehead.currentHp = bagBonehead.maxHp
    bagBonehead.currentGuard = 0
    bagBonehead.isDead = false

    this.refreshCoins()

    this.repairsPanel.destroy()

    this.createRepairShop()
}