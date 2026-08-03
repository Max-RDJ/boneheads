import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { playerData } from '../state/playerData'

import { BoneheadCard } from '../ui/BoneheadCard'
import { CoinCounter } from '../ui/CoinCounter'

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

        this.add.text(
            400,
            40,
            'SHOP',
            UI_STYLES.title
        ).setOrigin(0.5)

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

        this.add.text(
            50,
            100,
            'Singles',
            UI_STYLES.subtitle
        )

        const ids = Object.keys(BONEHEAD_DB)

        const selections = Phaser.Utils.Array.Shuffle(
            [...ids]
        ).slice(0, 3)


        selections.forEach((id, index) => {

            const bonehead = BONEHEAD_DB[id]

            const x = 100 + index * 220
            const y = 180


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

        this.add.text(
            50,
            330,
            'Booster Packs',
            UI_STYLES.subtitle
        )

        const packButton = this.add.text(
            100,
            390,
            'Open Booster (50g)',
            UI_STYLES.button,
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