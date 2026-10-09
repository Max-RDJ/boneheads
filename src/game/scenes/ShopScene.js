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
import { checkBagFull } from '../state/playerData'
import { ErrorOverlay } from '../ui/ErrorOverlay'
import { startSpriteBlinking } from '../helpers/startSpriteBlinking'

import { centerText } from '../ui/utils/centerText'
import { createBoneheadInstance } from '../helpers/createBoneheadInstance'
import { generateInstanceId } from '../helpers/generateInstanceId'
import { repairBonehead } from '../helpers/repairBonehead'

import { Tooltip } from '../ui/Tooltip'
import { UIButton } from '../ui/uiButton'
import { UI_STYLES } from '../ui/styles'


export default class ShopScene extends Phaser.Scene {

    constructor() {
        super('ShopScene')
    }

    create(data = {}) {
        this.tooltip = new Tooltip(this)
        this.paintTooltip = new Tooltip(this)

        if (
            !playerData.shop.boneheads ||
            !playerData.shop.misc ||
            data.refreshShop
        ) {
            this.refreshShop()
        }


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
        this.createMiscMarket()
        this.createRepairShop()
        this.createStartBattleButton()
        this.createRerollButton()
    }

    generateShopStock() {
        return {
            boneheads: this.generateBoneheadStock(),
            misc: this.generateMiscStock(),
        }
    }

    refreshShop() {
        playerData.shop = this.generateShopStock()
    }

    createBoneheadMarket() {
        const panelLayout = SHOP_LAYOUT.panels.market

        this.boneheadPanel = new Panel(
            this,
            panelLayout.x,
            panelLayout.y,
            panelLayout.width,
            panelLayout.height,
            {
                title: 'Singles',
                errorOverlay: true
            }
        )

        this.createBoneheadCards(this.boneheadPanel)
    }

    createBoneheadCards(panel) {
        const boneheadLayout = SHOP_LAYOUT.boneheads

        this.boneheadCards = []

        playerData.shop.boneheads.forEach((bonehead, index) => {

            const x =
                boneheadLayout.offsetX +
                index * boneheadLayout.spacing

            const y =
                boneheadLayout.offsetY

            if (bonehead.sold) {
                this.createSoldText(panel, x, y)
                return
            }

            const card = new BoneheadCard(
                this,
                x,
                y,
                bonehead,
                this.buyBonehead.bind(this),
                this.tooltip,
                this.paintTooltip
            )

            card.image.unit = {
                id: bonehead.id,
                colour: bonehead.colour
            }

            startSpriteBlinking(this, card.image)

            card.boneheadId = bonehead.instanceId

            this.boneheadCards.push(card)

            this.boneheadPanel.addContent(card)
        })
    }

    
    generateBoneheadStock() {
        const ids = Phaser.Utils.Array.Shuffle(
            Object.keys(BONEHEAD_DB)
        ).slice(0, 5)

        return ids.map(id => ({
            ...BONEHEAD_DB[id],
            ...createBoneheadInstance(id),
            instanceId: generateInstanceId(),
            sold: false
        }))
    }

    buyBonehead(bonehead) {
        if (playerData.coins < bonehead.price) {
            this.boneheadPanel.errorOverlay.showMessage('You broke, pal?')
            return
        }

        if (checkBagFull()) {
            this.boneheadPanel.errorOverlay.showMessage('Bag full!')
            return
        }

        playerData.coins -= bonehead.price

        const purchasedBonehead =
            createBoneheadInstance(
                bonehead.id,
                bonehead.colour
            )

        playerData.bag.contents.push({
            ...purchasedBonehead,
            instanceId: generateInstanceId()
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
            this.paintTooltip.hide()

            const x = card.x
            const y = card.y

            card.destroy()

            this.createSoldText(this.boneheadPanel, x, y)
        }

        this.refreshCoins()
    }

    createMiscMarket() {
        const panelLayout = SHOP_LAYOUT.panels.misc

        this.miscPanel = new Panel(
            this,
            panelLayout.x,
            panelLayout.y,
            panelLayout.width,
            panelLayout.height,
            {
                title: 'Miscellaneous',
                errorOverlay: true
            }
        )

        this.createMiscCards(this.miscPanel)
    }

    generateMiscStock() {
        const miscStock = [
            ...Object.entries(BOOSTER_DB).map(([id, data]) => ({
                id,
                ...data,
                type: 'booster'
            })),

            ...Object.entries(PAINT_DB).map(([id, data]) => ({
                id,
                ...data,
                type: 'paint'
            }))
        ]

        const totalWeight = miscStock.reduce(
            (total, item) => total + item.weight,
            0
        )

        const stock = []

        for (let i = 0; i < 3; i++) {
            let random = Math.random() * totalWeight

            for (const item of miscStock) {
                random -= item.weight

                if (random <= 0) {
                    stock.push({
                        ...item,
                        instanceId: generateInstanceId(),
                        sold: false
                    })

                    break
                }
            }
        }

        return stock
    }

    createMiscCards(panel) {
        const miscLayout = SHOP_LAYOUT.boosters

        this.miscCards = []

        playerData.shop.misc.forEach((item, index) => {

            const x =
                miscLayout.offsetX +
                index * miscLayout.spacing

            const y =
                miscLayout.offsetY

            if (item.sold) {
                this.createSoldText(panel, x, y)
                return
            }

            let card

            if (item.type === 'booster') {
                card = new BoosterCard(
                    this,
                    x,
                    y,
                    item,
                    this.buyBooster.bind(this),
                    this.tooltip
                )

                card.boosterId = item.instanceId

            } else if (item.type === 'paint') {
                card = new PaintCard(
                    this,
                    x,
                    y,
                    item,
                    this.buyPaint.bind(this),
                    this.paintTooltip
                )

                card.paintId = item.instanceId
            }

            if (!card) {
                return
            }

            this.miscCards.push(card)
            panel.addContent(card)
        })
    }

    buyBooster(booster) {
        if (playerData.coins < booster.price) {
            this.miscPanel.errorOverlay.showMessage('You broke, pal?')
            return
        }

        if (checkBagFull()) {
            this.miscPanel.errorOverlay.showMessage('Bag full!')
            return
        }

        playerData.coins -= booster.price

        const shopItem = playerData.shop.misc.find(
            item => item.instanceId === booster.instanceId
        )

        if (shopItem) {
            shopItem.sold = true
        }

        const card = this.miscCards.find(
            card => card.boosterId === booster.instanceId
        )

        if (card) {
            this.tooltip.hide()

            const x = card.x
            const y = card.y

            card.destroy()

            this.createSoldText(this.miscPanel, x, y)
        }

        this.refreshCoins()

        this.scene.start('BoosterScene', {
            boosterId: booster.id
        })
    }

    createPaintMarket() {
        const panelLayout = SHOP_LAYOUT.panels.paint

        this.paintPanel = new Panel(
            this,
            panelLayout.x,
            panelLayout.y,
            panelLayout.width,
            panelLayout.height,
            {
                title: 'Paint',
                errorOverlay: true
            }
        )

        this.createPaintCards(this.paintPanel)
    }

    createRepairShop() {
        const panelLayout = SHOP_LAYOUT.panels.repairs

        this.repairsPanel = new Panel(
            this,
            panelLayout.x,
            panelLayout.y,
            panelLayout.width,
            panelLayout.height,
            {
                title: 'Repairs'
            }
        )

        const knockedOutBoneheads =
            playerData.bag.contents.filter(
                bonehead => bonehead.isDead ||
                bonehead.currentHp < bonehead.maxHp
            )

        const previewBoneheads =
            knockedOutBoneheads.slice(0, 4)

        const hasMore =
            knockedOutBoneheads.length > 4

        const positions = [
            {
                x: panelLayout.x + 65,
                y: panelLayout.y + 90
            },
            {
                x: panelLayout.x + 190,
                y: panelLayout.y + 90
            },
            {
                x: panelLayout.x + 65,
                y: panelLayout.y + 185
            },
            {
                x: panelLayout.x + 190,
                y: panelLayout.y + 185
            }
        ]

        const cardsToShow = hasMore
            ? previewBoneheads.slice(0, 3)
            : previewBoneheads

        if (cardsToShow.length > 0) {
            cardsToShow.forEach((bonehead, index) => {
                const position = positions[index]

                this.createRepairCard(
                    bonehead,
                    position.x,
                    position.y
                )
            })
        } else {
            const noRepairsText = this.add.text(
                panelLayout.x + panelLayout.width / 2,
                panelLayout.y + panelLayout.height / 2,
                'No Boneheads need fixing',
                {
                    fontSize: '16px',
                    fill: '#fdfdfd'
                }
            )
            noRepairsText.setOrigin(0.5)
        }

        if (hasMore) {
            const position = positions[3]

            this.createMoreRepairsButton(
                position.x,
                position.y
            )
        }
    }

    createRepairCard(bonehead, x, y) {
        const card = new BoneheadCard(
            this,
            x,
            y,
            bonehead,
            (selectedBonehead) => repairBonehead( selectedBonehead, this ),
            this.tooltip,
            this.paintTooltip,
            {
                showPrice: true
            }
        )

        card.boneheadId = bonehead.instanceId

        this.repairsPanel.addContent(card)

        return card
    }

    createMoreRepairsButton(x, y) {
        const button = new UIButton(
            this,
            x,
            y,
            'More',
            UI_STYLES.buttonSmall,
            () => {
                this.showRepairOverlay()
            },
            {
                width: 100,
                height: 75
            }
        )

        this.repairsPanel.addContent(button)

        return button
    }

    showRepairOverlay() {
        this.scene.launch('RepairsScene', {
            returnScene: this.scene.key
        })
    }

    buyPaint(paint) {
        if (playerData.coins < paint.price) {
            this.miscPanel.errorOverlay.showMessage('You broke, pal?')
            return
        }

        playerData.coins -= paint.price

        playerData.paint.push({
            instanceId: generateInstanceId(),
            typeId: paint.id,
            colour: paint.colour
        })

        const shopItem = playerData.shop.misc.find(
            item => item.instanceId === paint.instanceId
        )

        if (shopItem) {
            shopItem.sold = true
        }

        const card = this.miscCards.find(
            card => card.paintId === paint.instanceId
        )

        if (card) {
            this.paintTooltip.hide()

            const x = card.x
            const y = card.y

            card.destroy()

            this.createSoldText(this.miscPanel, x, y)
        }

        this.refreshCoins()
    }

    refreshCoins() {
        this.coinCounter.setAmount(playerData.coins)
    }

    createSoldText(panel, x, y) {
        const soldText = this.add.text(
            x,
            y - 20,
            'SOLD!',
            UI_STYLES.bodySmall
        ).setOrigin(0.5)

        panel.addContent(soldText)

        return soldText
    }

    createRepairedText(panel, x, y) {
        const soldText = this.add.text(
            x,
            y - 20,
            'REPAIRED!',
            UI_STYLES.bodySmall
        ).setOrigin(0.5)

        panel.addContent(soldText)

        return soldText
    }

    createStartBattleButton() {
        new UIButton(this, 650, 150, 'Next Round', UI_STYLES.buttonDanger, () => {
            if (playerData.bag.contents.length === 0) {
                alert('You must have at least one Bonehead in your active party to start a battle!')
                return
            }
            this.scene.start('RoundSelectionScene')
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