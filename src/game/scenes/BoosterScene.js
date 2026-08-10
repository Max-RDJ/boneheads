import Phaser from 'phaser'

import { BONEHEAD_DB } from '../data/boneheadDB'
import { BOOSTER_DB } from '../data/boosterDB'
import { playerData } from '../state/playerData'

import { BoneheadCard } from '../ui/BoneheadCard'
import { CoinCounter } from '../ui/CoinCounter'
import { Panel } from '../ui/Panel'
import { SHOP_LAYOUT } from '../ui/layout'
import { Tooltip } from '../ui/Tooltip'
import { UI_STYLES } from '../ui/styles'

import { createBoneheadInstance } from '../helpers/createBoneheadInstance'
import { generateInstanceId } from '../helpers/generateInstanceId'


export default class BoosterScene extends Phaser.Scene {

    constructor() {
        super('BoosterScene')
    }

    init(data) {
        this.booster = BOOSTER_DB[data.boosterId]
    }

    create() {

        if (!this.booster) {
            console.error('No booster supplied to BoosterScene')
            this.scene.start('ShopScene')
            return
        }

        this.coinCounter = new CoinCounter(
            this,
            680,
            30
        )

        this.add.text(
            400,
            40,
            this.booster.name,
            UI_STYLES.title
        ).setOrigin(0.5)

        this.add.text(
            400,
            100,
            'Choose a Bonehead',
            UI_STYLES.subtitle
        ).setOrigin(0.5)

        this.tooltip = new Tooltip(this)

        this.createChoices()
    }

    createChoices() {

        const choices = this.getRandomBoneheads(
            this.booster.contentsCount
        )

        const spacing = 180

        const totalWidth =
            (choices.length - 1) * spacing

        const startX =
            400 - totalWidth / 2

        const y = 280

        choices.forEach((bonehead, index) => {

            const x =
                startX + index * spacing

            new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.selectBonehead.bind(this),
                this.tooltip,
                { showPrice: false }
            )
        })
    }

    getRandomBoneheads(amount) {
        const ids = Object.keys(BONEHEAD_DB)

        const shuffled = Phaser.Utils.Array.Shuffle(
            [...ids]
        )

        return shuffled
            .slice(0, Math.min(amount, ids.length))
            .map(id => createBoneheadInstance(id))
    }

    selectBonehead(bonehead) {

        playerData.bag.push({
            instanceId: bonehead.generateInstanceId,
            typeId: bonehead.id,
            colour: bonehead.colour
        })

        this.scene.start('ShopScene')
    }

}