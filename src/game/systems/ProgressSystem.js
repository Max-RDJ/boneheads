import { enemies } from '../data/enemyDB'

export const progressData = {
    currentEnemy: 0
}

export function getCurrentEnemy() {

    const enemy =
        enemies[progressData.currentEnemy]

    if (!enemy) {
        throw new Error(
            `No enemy found at index ${progressData.currentEnemy}`
        )
    }

    return enemy
}

export function advanceEnemy() {
    if (progressData.currentEnemy >= enemies.length - 1) {
        return false
    }

    progressData.currentEnemy++

    return true
}