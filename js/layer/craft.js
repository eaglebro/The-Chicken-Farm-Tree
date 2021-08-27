addLayer('c', {
    name: "craft", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "制造", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked() {return hasUpgrade('s', 14)},
            points: new Decimal(0),
        }
    },
    update(diff) {

    },
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "土", // Name of prestige currency
    baseResource: "沙子", // Name of resource prestige is based on
    baseAmount() {
        return player.s.points

    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(0.5), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        // 达到2时1:1生成
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown() {
        return hasUpgrade('s', 14)
    },
    tabFormat: [
        "main-display",
        "resource-display",
        "blank",
        "blank",
        "blank",
        "blank",
        "upgrades",
        "buyables"
    ]
})