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
import { createBoneheadInstance } from '../helpers/createBoneheadInstance'
import { generateInstanceId } from '../helpers/generateInstanceId'

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

        if (!playerData.shop.boneheads) {
            playerData.shop.boneheads = this.generateBoneheadStock()
        }

        this.createBoneheadCards(panel)
    }

    createBoneheadCards(panel) {
        const boneheadLayout = SHOP_LAYOUT.boneheads

        this.boneheadCards = []

        playerData.shop.boneheads.forEach((bonehead, index) => {

            const x =
                panel.x +
                boneheadLayout.offsetX +
                index * boneheadLayout.spacing

            const y =
                panel.y +
                boneheadLayout.offsetY

            if (bonehead.sold) {
                this.createSoldText(x, y)
                return
            }

            const card = new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.buyBonehead.bind(this),
                this.tooltip
            )

            card.boneheadId = bonehead.instanceId

            this.boneheadCards.push(card)
        })
    }

    generateBoneheadStock() {
        const ids = Phaser.Utils.Array.Shuffle(
            Object.keys(BONEHEAD_DB)
        ).slice(0, 5)

        return ids.map(id => ({
            ...createBoneheadInstance(id),
            instanceId: generateInstanceId(),
            sold: false
        }))
    }

    buyBonehead(bonehead) {
        if (playerData.coins < bonehead.price) {
            return
        }

        playerData.coins -= bonehead.price

        playerData.bag.contents.push({
            instanceId: generateInstanceId(),
            typeId: bonehead.id,
            colour: bonehead.colour
        })

        const shopBonehead = playerData.shop.boneheads.find(
            item => item.instanceId === bonehead.instanceId
        )

        if (shopBonehead) {
            shopBonehead.sold = true
        }

        const card = this.boneheadCards.find(
            card => card.boneheadId === bonehead.instanceId
        )

        if (card) {
            this.tooltip.hide()

            const x = card.x
            const y = card.y

            card.destroy()

            this.createSoldText(x, y)
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

        if (!playerData.shop.boosters) {
            playerData.shop.boosters = this.generateBoosterStock()
        }

        const boosterLayout = SHOP_LAYOUT.boosters

        this.boosterCards = []

        playerData.shop.boosters.forEach((booster, index) => {

            const x =
                panel.x +
                boosterLayout.offsetX +
                index * boosterLayout.spacing

            const y =
                panel.y +
                boosterLayout.offsetY

            if (booster.sold) {
                this.createSoldText(x, y)
                return
            }

            const card = new BoosterCard(
                this,
                x,
                y,
                booster,
                this.buyBooster.bind(this),
                this.tooltip
            )

            card.boosterId = booster.instanceId

            this.boosterCards.push(card)
        })
    }

    generateBoosterStock() {
        const boosters = Object.entries(BOOSTER_DB)

        const totalWeight = boosters.reduce(
            (total, [, data]) => total + data.weight,
            0
        )

        const stock = []

        for (let i = 0; i < 3; i++) {
            let random = Math.random() * totalWeight

            for (const [id, data] of boosters) {

                random -= data.weight

                if (random <= 0) {
                    stock.push({
                        ...data,
                        instanceId: generateInstanceId(),
                        sold: false
                    })

                    break
                }
            }
        }

        return stock
    }

    buyBooster(booster) {
        if (playerData.coins < booster.price) {
            return
        }

        playerData.coins -= booster.price

        const shopBooster = playerData.shop.boosters.find(
            item => item.instanceId === booster.instanceId
        )

        if (shopBooster) {
            shopBooster.sold = true
        }

        const card = this.boosterCards.find(
            card => card.boosterId === booster.instanceId
        )

        if (card) {
            this.tooltip.hide()

            const x = card.x
            const y = card.y

            card.destroy()

            this.createSoldText(x, y)
        }

        this.refreshCoins()

        this.scene.start('BoosterScene', {
            boosterId: booster.id
        })
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

        if (!playerData.shop.paints) {
            playerData.shop.paints = this.generatePaintStock()
        }

        const paintLayout = SHOP_LAYOUT.paint

        this.paintCards = []

        playerData.shop.paints.forEach((paint, index) => {

            const column = index % 2
            const row = Math.floor(index / 2)

            const x =
                panel.x +
                paintLayout.offsetX +
                column * paintLayout.spacing

            const y =
                panel.y +
                paintLayout.offsetY +
                row * paintLayout.spacing

            if (paint.sold) {
                this.createSoldText(x, y)
                return
            }

            const card = new PaintCard(
                this,
                x,
                y,
                paint,
                this.buyPaint.bind(this),
                this.tooltip
            )

            card.paintId = paint.instanceId

            this.paintCards.push(card)
        })
    }

    generatePaintStock() {
        const paintIds = Phaser.Utils.Array.Shuffle(
            Object.keys(PAINT_DB)
        ).slice(0, 4)

        return paintIds.map(id => ({
            ...PAINT_DB[id],
            instanceId: generateInstanceId(),
            sold: false
        }))
    }

    buyPaint(paint) {
        if (playerData.coins < paint.price) {
            return
        }

        playerData.coins -= paint.price

        playerData.paint.push({
            instanceId: generateInstanceId(),
            typeId: paint.id,
            colour: paint.colour
        })

        const shopPaint = playerData.shop.paints.find(
            item => item.instanceId === paint.instanceId
        )

        if (shopPaint) {
            shopPaint.sold = true
        }

        const card = this.paintCards.find(
            card => card.paintId === paint.instanceId
        )

        if (card) {
            this.tooltip.hide()

            const x = card.x
            const y = card.y

            card.destroy()
            this.createSoldText(x, y)
        }

        this.refreshCoins()
    } 

    refreshCoins() {
        this.coinCounter.setAmount(playerData.coins)
    }

    createSoldText(x, y) {
        this.add.text(
            x,
            y - 20,
            'SOLD!',
            UI_STYLES.bodySmall
        ).setOrigin(0.5)
    }

    createStartBattleButton() {
        new UIButton(this, 650, 150, 'Next Round', UI_STYLES.buttonDanger, () => {
            console.log(playerData.activeParty)
            if (playerData.activeParty.length === 0) {
                alert('You must have at least one Bonehead in your active party to start a battle!')
                return
            }
            this.scene.start('CombatScene')
        },
        {
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

                playerData.shop.boneheads = this.generateBoneheadStock()

                this.createBoneheadMarket()
                this.updateRerollButtonText()
                this.refreshCoins()

                this.rerollButton.disableInteractive()
                this.rerollButton.setInteractive()
            },
            {
                width: 200,
                height: 75,
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