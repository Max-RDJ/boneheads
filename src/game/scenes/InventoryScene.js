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
import { PaintModeIndicator } from '../ui/PaintModeIndicator'
import { getBoneheadStats } from '../helpers/getBoneheadStats'


export default class InventoryScene extends Phaser.Scene {

    constructor() {
        super('InventoryScene')
    }

    create() {

        this.paintMode = false
        this.selectedPaint = null
        this.paintModeIndicator = null

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

        this.paintMode = false
        this.selectedPaint = null

        this.input.on('pointerdown', this.handlePointerDown, this)

        this.game.canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault()
    })
    }

    createBackButton() {
        this.backButton = new UIButton(
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
                    this.selectPaint.bind(this),
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

    selectPaint(paint) {
        this.paintMode = true
        this.selectedPaint = paint

        this.enterPaintMode()
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

        const boneheads = playerData.bag.contents.map(unit => {

            const bonehead = BONEHEAD_DB[unit.typeId]
            const stats = getBoneheadStats(unit)

            return {
                ...bonehead,
                instanceId: unit.instanceId,
                colour: unit.colour,
                stats: getBoneheadStats(unit)
            }
        })

        const columns = 5
        const spacingX = 140
        const spacingY = 140

        const startX = 120
        const startY = 150

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
                    this.handleBoneheadClick.bind(this),
                    this.tooltip,
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

    
    // Painting
    handleBoneheadClick(bonehead) {
        if (!this.paintMode) {
            return
        }

        this.paintBonehead(
            bonehead,
            this.selectedPaint
        )
    }

    paintBonehead(bonehead, paint) {
        const ownedBonehead = playerData.bag.contents.find(
            item => item.instanceId === bonehead.instanceId
        )

        if (!ownedBonehead) {
            return
        }

        ownedBonehead.colour = paint.colour

        const paintIndex = playerData.paint.findIndex(
            item => item.instanceId === paint.instanceId
        )

        if (paintIndex !== -1) {
            playerData.paint.splice(paintIndex, 1)
        }

        this.exitPaintMode()
        this.refreshInventory()
    }


    enterPaintMode() {
        this.backButton.disableInteractive()

        const paint = this.selectedPaint

        if (!this.paintModeIndicator) {
            this.paintModeIndicator = new PaintModeIndicator(
                this,
                paint.colour
            )
        } else {
            this.paintModeIndicator.setColour(paint.colour)
        }

        this.paintModeIndicator.show()
        this.input.setDefaultCursor('none')
    }

    exitPaintMode() {

        this.paintMode = false
        this.selectedPaint = null

        this.backButton.setInteractive()
        this.paintModeIndicator.hide()
        this.input.setDefaultCursor('default')
    }

    handlePointerDown(pointer) {
        if (pointer.rightButtonDown() && this.paintMode) {
            this.exitPaintMode()
        }
    }

    refreshInventory() {
        this.children.removeAll(true)
        this.create()
    }
}