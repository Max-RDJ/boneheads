export default class ArenaSystem {

    constructor(scene) {
        this.scene = scene
    }

    create() {

        // opponent bench
        this.scene.add.rectangle(
            400,
            100,
            600,
            100,
            0x222222,
            0.3
        )
        .setStrokeStyle(2, 0xffffff)

        // battle zone
        this.scene.add.rectangle(
            400,
            300,
            500,
            220,
            0x111111,
            0.4
        )
        .setStrokeStyle(3, 0xffffff)

        // player bench
        this.scene.add.rectangle(
            400,
            500,
            600,
            100,
            0x222222,
            0.3
        )
        .setStrokeStyle(2, 0xffffff)
    }
}