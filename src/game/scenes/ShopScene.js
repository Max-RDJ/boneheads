import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { BONEHEAD_COLOURS } from '../data/boneheadColours'
import { BOOSTER_DB } from '../data/boosterDB'
import { PAINT_DB } from '../data/paintDB'
import { playerData } from '../state/playerData'

import { BagIcon } from '../ui/BagIcon'
import { BoneheadCard } from '../ui/BoneheadCard'
import { BoosterCard } from '../ui/BoosterCard'
import { PaintCard } from '../ui/PaintCard'
import { BoosterScene } from './BoosterScene'
import { CoinCounter } from '../ui/CoinCounter'
import { SHOP_LAYOUT } from '../ui/layout'
import { Panel } from '../ui/Panel'

import { centerText } from '../ui/utils/centerText'
import { getRandomBoneheadColour } from '../helpers/getRandomBoneheadColour'

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

        this.createBoneheadMarket()
        this.createBoosterMarket()
        this.createPaintMarket()
        this.createStartBattleButton()
        this.createRerollButton()
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
        ).slice(0, 4)


        const boneheadLayout = SHOP_LAYOUT.boneheads
        this.boneheadCards = []

        boneheadSelections.forEach((id, index) => {

            const bonehead = BONEHEAD_DB[id]
            const colour = getRandomBoneheadColour()

            const x = panel.x + boneheadLayout.offsetX + index * boneheadLayout.spacing
            const y = panel.y + boneheadLayout.offsetY

            const card = new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.buyBonehead.bind(this),
                this.tooltip
            )

            card.boneheadId = bonehead.id
            this.boneheadCards.push(card)
        })
    }

    buyBonehead(bonehead) {
        if (playerData.coins < bonehead.price) {
            return
        }

        playerData.coins -= bonehead.price

        playerData.bag.push({
            instanceId: this.generateInstanceId(),
            typeId: bonehead.id,
            colour: bonehead.colour
        })

        const card = this.boneheadCards.find(
            card => card.boneheadId === bonehead.id
        )

        if (card) {
            this.tooltip.hide()
            card.destroy()

            this.add.text(
                card.x,
                card.y - 20,
                'SOLD!',
                UI_STYLES.bodySmall
            ).setOrigin(0.5)
        }

        this.refreshCoins()
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
        ).slice(0, 3)
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
        const panel = SHOP_LAYOUT.panels.paint

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

        const paintIds = Object.keys(PAINT_DB)
        const paintSelections = Phaser.Utils.Array.Shuffle(
            [...paintIds]
        ).slice(0, 4)
        const paintLayout = SHOP_LAYOUT.paint

        this.paintCards = []

        paintSelections.forEach((id, index) => {
            const paint = PAINT_DB[id]
            const column = index % 2
            const row = Math.floor(index / 2)
            const x = panel.x + paintLayout.offsetX + column * paintLayout.spacing
            const y = panel.y + paintLayout.offsetY + row * paintLayout.spacing

            new PaintCard(
                this,
                x,
                y,
                paint,
                this.buyPaint.bind(this),
                this.tooltip
            )  
        })
    }

        buyPaint(paint) {
            if (playerData.coins < paint.price) {
                return
            }

            playerData.coins -= paint.price

            playerData.paint.push({
                instanceId: this.generateInstanceId(),
                typeId: paint.id,
                colour: paint.colour
            })

            const card = this.paintCards.find(
                card => card.paintId === paint.id
            )

            if (card) {
                this.tooltip.hide()
                card.destroy()

                this.add.text(
                    card.x,
                    card.y - 20,
                    'SOLD!',
                    UI_STYLES.bodySmall
                ).setOrigin(0.5)
            }

            this.refreshCoins()
        }   

    refreshCoins() {
        this.coinCounter.setAmount(playerData.coins)
    }

    createStartBattleButton() {
        new UIButton(this, 650, 150, 'Next Round', UI_STYLES.button, () => {
            console.log(playerData.activeParty)
            if (playerData.activeParty.length === 0) {
                alert('You must have at least one Bonehead in your active party to start a battle!')
                return
            }
            this.scene.start('CombatScene')
        },
        {
            backgroundColor: '0xaa2222',
            width: 200
        })
    }

    createRerollButton() {
        this.rerollButton = new UIButton(
            this,
            650,
            230,
            `Reroll\n¢${this.calculateRerollCost()}`,
            UI_STYLES.button,
            () => {
                const rerollCost = this.calculateRerollCost()

                if (playerData.coins < rerollCost) {
                    alert('Not enough coins to reroll!')
                    return
                }

                playerData.coins -= rerollCost
                playerData.rerollCount = (playerData.rerollCount || 0) + 1

                this.boneheadCards.forEach(card => card.destroy())

                this.createBoneheadMarket()
                this.updateRerollButtonText()
                this.refreshCoins()

                this.rerollButton.disableInteractive()
                this.rerollButton.setInteractive()
            },
            {
                width: 200,
                height: 75,
                backgroundColor: 0x154d1f
            }
        )
    }

    updateRerollButtonText() {
        this.rerollButton.setText(
            `Reroll\n¢${this.calculateRerollCost()}`
        )
    }

    calculateRerollCost() {
        const baseCost = 10
        const costMultiplier = 1.5
        const rerollCount = playerData.rerollCount || 0

        return Math.ceil(baseCost + (rerollCount * costMultiplier))
    }

}