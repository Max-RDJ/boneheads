class BoneheadSprite {
    constructor(scene, x, y, boneheadData) {
        this.scene = scene
        this.data = boneheadData

        this.sprite = scene.add.image(
            x,
            y,
            `${boneheadData.id}-idle`
        )

        this.startBlinking()
    }
}