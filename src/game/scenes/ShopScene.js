import Phaser from 'phaser'
import { BONEHEAD_DB } from '../data/boneheadDB'
import { playerData } from '../state/playerData'

export default class ShopScene extends Phaser.Scene {

    constructor() {
        super('ShopScene')
    }

    create() {

        this.goldText = this.add.text(
            20,
            20,
            `Gold: ${playerData.gold}`,
            {
                fontSize: '24px',
                color: '#ffff00'
            }
        )

        this.add.text(
            400,
            40,
            'BONEHEAD SHOP',
            {
                fontSize: '32px',
                color: '#ffffff'
            }
        ).setOrigin(0.5)

        this.createBoneheadMarket()
        this.createBoosterSection()
        this.createInventoryButtons()
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
            'Available Boneheads',
            {
                fontSize: '24px'
            }
        )

        const ids = Object.keys(BONEHEAD_DB)

        const selections = Phaser.Utils.Array.Shuffle(
            [...ids]
        ).slice(0, 3)

        selections.forEach((id, index) => {

            const bonehead = BONEHEAD_DB[id]

            const x = 100 + index * 220
            const y = 180

            this.add.rectangle(
                x,
                y,
                180,
                120,
                0x333333
            )

            this.add.text(
                x,
                y - 30,
                bonehead.name,
                {
                    fontSize: '20px'
                }
            ).setOrigin(0.5)

            const buyButton = this.add.text(
                x,
                y + 20,
                'BUY (20g)',
                {
                    backgroundColor: '#228822',
                    padding: {
                        left: 10,
                        right: 10,
                        top: 5,
                        bottom: 5
                    }
                }
            )
                .setOrigin(0.5)
                .setInteractive()

            buyButton.on('pointerdown', () => {

                if (playerData.gold < 20) {
                    return
                }

                playerData.gold -= 20

                playerData.collection.push({
                    instanceId: this.generateInstanceId(),
                    typeId: id
                })

                this.refreshGold()
                this.showInventory()
            })
        })
    }

    createBoosterSection() {

        this.add.text(
            50,
            330,
            'Booster Packs',
            {
                fontSize: '24px'
            }
        )

        const packButton = this.add.text(
            100,
            390,
            'OPEN BOOSTER (50g)',
            {
                backgroundColor: '#4444aa',
                padding: {
                    left: 12,
                    right: 12,
                    top: 8,
                    bottom: 8
                }
            }
        )
            .setInteractive()

        packButton.on('pointerdown', () => {

            if (playerData.gold < 50) {
                return
            }

            playerData.gold -= 50

            const ids = Object.keys(BONEHEAD_DB)

            for (let i = 0; i < 3; i++) {

                const randomId =
                    Phaser.Utils.Array.GetRandom(ids)

                playerData.collection.push({
                    instanceId: this.generateInstanceId(),
                    typeId: randomId
                })
            }

            this.refreshGold()
            this.showInventory()
        })
    }

    createInventoryButtons() {

        const inventoryButton = this.add.text(
            550,
            350,
            'VIEW INVENTORY',
            {
                backgroundColor: '#666666',
                padding: {
                    left: 12,
                    right: 12,
                    top: 8,
                    bottom: 8
                }
            }
        )
            .setInteractive()

        inventoryButton.on('pointerdown', () => {
            this.showInventory()
        })

        const removeButton = this.add.text(
            550,
            420,
            'REMOVE LAST BONEHEAD (5g)',
            {
                backgroundColor: '#aa2222',
                padding: {
                    left: 12,
                    right: 12,
                    top: 8,
                    bottom: 8
                }
            }
        )
            .setInteractive()

        removeButton.on('pointerdown', () => {

            if (playerData.collection.length === 0) {
                return
            }

            if (playerData.gold < 5) {
                return
            }

            playerData.gold -= 5

            playerData.collection.pop()

            this.refreshGold()
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

    refreshGold() {
        this.goldText.setText(
            `Gold: ${playerData.gold}`
        )
    }
}