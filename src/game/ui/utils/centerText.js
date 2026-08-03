export function centerText(scene, x, y, text, style) {
    return scene.add.text(x, y, text, style)
        .setOrigin(0.5)
}