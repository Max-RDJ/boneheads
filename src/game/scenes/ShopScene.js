import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { BOOSTER_DB } from '../data/boosterDB'
import { playerData } from '../state/playerData'

import { BagIcon } from '../ui/BagIcon'
import { BoneheadCard } from '../ui/BoneheadCard'
import { BoosterCard } from '../ui/BoosterCard'
import { BoosterScene } from './BoosterScene'
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
        this.tooltip = new Tooltip(this)

        this.coinCounter = new CoinCounter(
            this,
            680,
            30
        )

        this.bagIcon  = new BagIcon(
            this,
            600,
            30,
            this.tooltip
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
        this.createBoosterMarket()
        this.createPaintMarket()
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

    createBoosterMarket() {
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

        const boosterIds = Object.keys(BOOSTER_DB)
        const boosterSelections = Phaser.Utils.Array.Shuffle(
            [...boosterIds]
        ).slice(0, 2)
        const boosterLayout = SHOP_LAYOUT.boosters

        boosterSelections.forEach((id, index) => {
            const booster = BOOSTER_DB[id]
            const x = panel.x + boosterLayout.offsetX + index * boosterLayout.spacing
            const y = panel.y + boosterLayout.offsetY

            new BoosterCard(
                this,
                x,
                y,
                booster,
                this.buyBooster.bind(this),
                this.tooltip
            )  
        })
    }

        buyBooster(booster) {
            if (playerData.coins < booster.price) {
                return
            }

            playerData.coins -= booster.price
            this.refreshCoins()

            this.scene.start('BoosterScene', { boosterId: booster.id })
        }


    createPaintMarket() {
        const panel = SHOP_LAYOUT.panels.inventory

        new Panel(
            this,
            panel.x,
            panel.y,
            panel.width,
            panel.height,
            {
                title: 'Paint'
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