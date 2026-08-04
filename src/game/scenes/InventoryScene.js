import Phaser from 'phaser'

import { BONEHEAD_DB } from '../data/boneheadDB'
import { playerData } from '../state/playerData'

import { BoneheadCard } from '../ui/BoneheadCard'
import { CoinCounter } from '../ui/CoinCounter'

import { Tooltip } from '../ui/Tooltip'
import { UIButton } from '../ui/uiButton'
import { UI_STYLES } from '../ui/styles'


export default class InventoryScene extends Phaser.Scene {

    constructor() {
        super('InventoryScene')
    }

    create() {

        this.tooltip = new Tooltip(this)

        this.coinCounter = new CoinCounter(
            this,
            680,
            30
        )

        this.add.text(
            400,
            40,
            'Bag',
            UI_STYLES.title
        ).setOrigin(0.5)
      
        this.showInventory()
        this.createBackButton()
    }

    createBackButton() {
        new UIButton(this, 600, 520, 'Back', UI_STYLES.button, () => {
            this.scene.start('ShopScene')
        },
        {backgroundColor: '#6a6a6a'})
    }

    showInventory() {

        const boneheads = playerData.bag.map(unit => {

            const bonehead = BONEHEAD_DB[unit.typeId]

            return {
                ...bonehead,
                instanceId: unit.instanceId
            }
        })

        const columns = 5
        const spacingX = 140
        const spacingY = 140

        const startX = 120
        const startY = 150

        boneheads.forEach((bonehead, index) => {

            const column = index % columns
            const row = Math.floor(index / columns)

            const x = startX + column * spacingX
            const y = startY + row * spacingY

            new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                null,
                this.tooltip,
                { showPrice: false }
            )
        })
    }
}