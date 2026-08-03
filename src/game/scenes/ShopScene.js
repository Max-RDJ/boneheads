import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { BOOSTER_DB } from '../data/boosterDB'
import { playerData } from '../state/playerData'

import { BoneheadCard } from '../ui/BoneheadCard'
import { CoinCounter } from '../ui/CoinCounter'
import { SHOP_LAYOUT } from '../ui/layout'
import { Panel } from '../ui/Panel'

import { centerText } from '../ui/utils/centerText'

import { Tooltip } from '../ui/Tooltip'
import { UIButton } from '../ui/uiButton'
import { UI_STYLES } from '../ui/styles'


export default class ShopScene extends Phaser.Scene {

    constructor() {
        super('ShopScene')
    }

    create() {
        this.coinCounter = new CoinCounter(
            this,
            20,
            20
        )

        centerText(
            this,
            400,
            40,
            'SHOP',
            UI_STYLES.title
        )

        this.tooltip = new Tooltip(this)

        this.createBoneheadMarket()
        this.createBoosterSection()
        this.createInventoryButtons()
        this.createStartBattleButton()
    }

    generateInstanceId() {
        return (
            Date.now().toString() +
            Math.random().toString(36).slice(2)
        )
    }

    createBoneheadMarket() {
        const panel = SHOP_LAYOUT.panels.market

        new Panel(
            this,
            panel.x,
            panel.y,
            panel.width,
            panel.height,
            {
                title: 'Singles'
            }
        )

        const boneheadIds = Object.keys(BONEHEAD_DB)

        const boneheadSelections = Phaser.Utils.Array.Shuffle(
            [...boneheadIds]
        ).slice(0, 3)


        const boneheadLayout = SHOP_LAYOUT.boneheads


        boneheadSelections.forEach((id, index) => {

            const bonehead = BONEHEAD_DB[id]

            const x = panel.x + boneheadLayout.offsetX + index * boneheadLayout.spacing
            const y = panel.y + boneheadLayout.offsetY


            new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.buyBonehead.bind(this),
                this.tooltip
            )
        })
    }

    buyBonehead(bonehead) {
        if (playerData.coins < bonehead.price) {
            return
        }

        playerData.coins -= bonehead.price

        playerData.collection.push({
            instanceId: this.generateInstanceId(),
            typeId: bonehead.id
        })

        this.refreshCoins()
        this.showInventory()
    }

    createBoosterSection() {
        const panel = SHOP_LAYOUT.panels.boosters

        new Panel(
            this,
            panel.x,
            panel.y,
            panel.width,
            panel.height,
            {
                title: 'Booster Packs'
            }
        )

        const boosterIds = Object.keys(BONEHEAD_DB)

         const boosterSelections = Phaser.Utils.Array.Shuffle(
            [...boosterIds]
        ).slice(0, 3)


        const boneheadLayout = SHOP_LAYOUT.boneheads


        boosterSelections.forEach((id, index) => {

            const booster = BOOSTER_DB[id]

            const x = panel.x + boneheadLayout.offsetX + index * boneheadLayout.spacing
            const y = panel.y + boneheadLayout.offsetY


            new BoosterCard(
                this,
                x,
                y,
                booster,
                this.buyBooster.bind(this),
                this.tooltip
            )
        })

        new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.buyBonehead.bind(this),
                this.tooltip
            )

        const boosterCard = this.add.text(
            100,
            390,
            'Open Booster (50g)',
            {
                backgroundColor: '#4444aa'
            }
        )
            .setInteractive()

        packButton.on('pointerdown', () => {

            if (playerData.coins < 50) {
                return
            }

            playerData.coins -= 50

            const ids = Object.keys(BONEHEAD_DB)

            for (let i = 0; i < 3; i++) {

                const randomId =
                    Phaser.Utils.Array.GetRandom(ids)

                playerData.collection.push({
                    instanceId: this.generateInstanceId(),
                    typeId: randomId
                })
            }

            this.refreshCoins()
            this.showInventory()
        })
    }

    createInventoryButtons() {

        const inventoryButton = this.add.text(
            550,
            350,
            'VIEW INVENTORY',
            UI_STYLES.button
        )
            .setInteractive()

        inventoryButton.on('pointerdown', () => {
            this.showInventory()
        })
    }

    showInventory() {

        if (this.inventoryText) {
            this.inventoryText.destroy()
        }

        const names = playerData.collection.map(unit => {

            const bonehead =
                BONEHEAD_DB[unit.typeId]

            return `${bonehead.name}`
        })

        this.inventoryText = this.add.text(
            520,
            120,
            names.join('\n') || 'No Boneheads',
            {
                fontSize: '18px',
                backgroundColor: '#222222',
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        )
    }

    refreshCoins() {
        this.coinCounter.setAmount(playerData.coins)
    }

    createStartBattleButton() {
        new UIButton(this, 600, 520, 'Next Round', UI_STYLES.button, () => {
            console.log(playerData.activeParty)
            if (playerData.activeParty.length === 0) {
                alert('You must have at least one Bonehead in your active party to start a battle!')
                return
            }
            this.scene.start('CombatScene')
        },
        {backgroundColor: '#aa2222'}
    )
    }
}