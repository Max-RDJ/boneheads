import Phaser from 'phaser'

import { BONEHEAD_DB } from '../data/boneheadDB'
import { PAINT_DB } from '../data/paintDB'
import { playerData } from '../state/playerData'

import { BoneheadCard } from '../ui/BoneheadCard'
import { CoinCounter } from '../ui/CoinCounter'
import { PaintCard } from '../ui/PaintCard'
import { INVENTORY_LAYOUT } from '../ui/layout'
import { Panel } from '../ui/Panel'
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

        this.createBoneheadSection()
        this.createPaintSection()
        this.createBackButton()
    }

    createBackButton() {
        new UIButton(
            this,
            70,
            50,
            'Back',
            UI_STYLES.buttonSmall,
            () => {
                this.scene.start('ShopScene')
            },
        )
    }

    createPaintSection() {
        const panel = INVENTORY_LAYOUT.panels.paint
        
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

        const paints = playerData.paint.map(unit => {

            const paintData = PAINT_DB[unit.typeId]

            return {
                ...paintData,
                instanceId: unit.instanceId
            }
        })

        const columns = 4
        const spacingX = 100
        const spacingY = 100

        const startX = 100
        const startY = 400

        if (paints.length > 0) {

            paints.forEach((paint, index) => {

                const column = index % columns
                const row = Math.floor(index / columns)

                const x = startX + column * spacingX
                const y = startY + row * spacingY

                new PaintCard(
                    this,
                    x,
                    y,
                    paint,
                    null,
                    this.tooltip,
                    { showPrice: false }
                )
            })

        } else {

            this.add.text(
                400,
                400,
                'How about bringing some colour into your life?',
                UI_STYLES.bodyLarge
            ).setOrigin(0.5)
        }
    }

    createBoneheadSection() {
        const panel = INVENTORY_LAYOUT.panels.boneheads
        
        new Panel(
            this,
            panel.x,
            panel.y,
            panel.width,
            panel.height,
            {
                title: 'Boneheads'
            }
        )

        const boneheads = playerData.bag.contents.map(unit => {

            const bonehead = BONEHEAD_DB[unit.typeId]

            return {
                ...bonehead,
                instanceId: unit.instanceId,
                colour: unit.colour
            }
        })

        const columns = 5
        const spacingX = 140
        const spacingY = 140

        const startX = 120
        const startY = 150

        if (boneheads.length > 0) {

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

        } else {

            this.add.text(
                400,
                200,
                "It's looking a little lonely in here...",
                UI_STYLES.bodyLarge
            ).setOrigin(0.5)
        }
    }
}