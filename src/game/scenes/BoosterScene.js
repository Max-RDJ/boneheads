import Phaser from 'phaser'

import { BAG_SIZES } from '../data/bagDB'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { BOOSTER_DB } from '../data/boosterDB'
import { playerData } from '../state/playerData'

import { BoneheadCard } from '../ui/BoneheadCard'
import { CoinCounter } from '../ui/CoinCounter'
import { Tooltip } from '../ui/Tooltip'
import { UIButton } from '../ui/uiButton'
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
            'Choose Boneheads to add to your bag',
            UI_STYLES.subtitle
        ).setOrigin(0.5)

        this.tooltip = new Tooltip(this)
        this.paintTooltip = new Tooltip(this)

        this.createChoices()
        this.createSkipButton()
    }

    createChoices() {

        this.boosterBoneheads = this.getRandomBoneheads(
            this.booster.contentsCount
        )

        this.boneheadCards = []

        const spacing = 180

        const totalWidth =
            (this.boosterBoneheads.length - 1) * spacing

        const startX =
            400 - totalWidth / 2

        const y = 280

        this.boosterBoneheads.forEach((bonehead, index) => {

            const x =
                startX + index * spacing

            const card = new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.addBonehead.bind(this),
                this.tooltip,
                this.paintTooltip,
                { showPrice: false }
            )

            this.boneheadCards.push(card)
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

    addBonehead(bonehead) {

        const capacity =
            BAG_SIZES[playerData.bag.size].capacity

        if (playerData.bag.contents.length >= capacity) {
            return
        }

        const newBonehead =
            createBoneheadInstance(
                bonehead.typeId,
                bonehead.colour
            )

        playerData.bag.contents.push({
            ...newBonehead,
            instanceId: generateInstanceId()
        })

        const card =
            this.boneheadCards.find(
                card => card.bonehead === bonehead
            )

        if (card) {
            card.destroy()
        }

        if (
            playerData.bag.contents.length >= capacity
        ) {
            this.skipButton.setText('Return to shop')
        }
    }

    createSkipButton() {

        this.skipButton = new UIButton(
            this,
            400,
            450,
            'Skip',
            UI_STYLES.button,
            () => {
                this.scene.start('ShopScene')
            },
            {
                width: 200,
                height: 75,
            }
        )
    }
}