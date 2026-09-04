import Phaser from 'phaser'

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


export default class CombatInventoryScene extends Phaser.Scene {

    constructor() {
        super('CombatInventoryScene')
    }

    create() {

        this.createOverlay()

        this.tooltip = new Tooltip(this)
        this.paintTooltip = new Tooltip(this)

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

    createOverlay() {
        this.overlay = this.add.rectangle(
            400,
            300,
            800,
            600,
            0x000000,
            0.65
        )

        this.overlay.setDepth(0)
    }

    createBackButton() {
        this.backButton = new UIButton(
            this,
            70,
            50,
            'Back',
            UI_STYLES.buttonSmall,
            () => {
                this.scene.stop('CombatInventoryScene')
                this.scene.resume('CombatScene')
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

        if (paints.length > 0) {

            paints.forEach((paint, index) => {
                const paintLayout = INVENTORY_LAYOUT.paint

                const column = index % columns
                const row = Math.floor(index / columns)

                const x =
                    panel.x +
                    paintLayout.x +
                    column * paintLayout.spacing

                const y =
                    panel.y +
                    paintLayout.y +
                    row * paintLayout.spacing

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
                430,
                'How about bringing some colour into your life?',
                UI_STYLES.bodyLarge
            ).setOrigin(0.5)
        }
    }

    createBoneheadSection() {
        const panel = INVENTORY_LAYOUT.panels.bag[playerData.bag.size]
        
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

        const boneheads = playerData.bag.contents

        const columns = 5

        if (boneheads.length > 0) {

            boneheads.forEach((bonehead, index) => {
                const boneheadLayout = INVENTORY_LAYOUT.boneheads

                const column = index % columns
                const row = Math.floor(index / columns)

                const x =
                    panel.x +
                    boneheadLayout.x +
                    column * boneheadLayout.spacing

                const y =
                    panel.y +
                    boneheadLayout.y +
                    row * boneheadLayout.spacing

                const card = new BoneheadCard(
                    this,
                    x,
                    y,
                    bonehead,
                    null,
                    this.tooltip,
                    this.paintTooltip,
                    { showPrice: false }
                )

                card.boneheadId = bonehead.instanceId
            })

        } else {

            this.add.text(
                400,
                180,
                "It's looking a little lonely in here...",
                UI_STYLES.bodyLarge
            ).setOrigin(0.5)
        }
    }

    refreshInventory() {
        this.children.removeAll(true)
        this.create()
    }
}