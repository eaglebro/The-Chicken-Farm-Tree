addLayer("s", {
    name: "soil", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "土", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
        }
    },
    color: "#d97811",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "土", // Name of prestige currency
    baseResource: "沙子", // Name of resource prestige is based on
    baseAmount() {
        return player.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade(this.layer, UPGRADE_SAND_EFFECT_1)) mult = mult.times(this.layer, UPGRADE_SAND_EFFECT_1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        // 达到2时1:1生成
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {
            key: "s", description: "土: 挖一块土", onPress() {
                if (canReset(this.layer)) doReset(this.layer)
            }
        },
    ],
    layerShown() {
        return true
    },
    upgrades: {
        UPGRADE_SAND_CAP:
            {
                title: "增加沙子上限",
                description: "增加沙子上限至16",
                cost: new Decimal(10),
                unlocked() {
                    return player[this.layer].unlocked
                }, // The upgrade is only visible when this is true
                // branches: [UPDATE_SAND_EFFECT_1],
                onPurchase: () => {
                    player.pointsLimit = new Decimal(16)
                },
                tooltip: "hi",
            },
        UPGRADE_SAND_EFFECT_1:
            {
                title: "增加沙子效率",
                description: "沙子效率x1.2",
                cost: new Decimal(20),
                unlocked() {
                    hasUpgrade(this.layer, UPGRADE_SAND_CAP)
                },
                branches: [UPGRADE_SAND_EFFECT_1],
                onPurchase: () => {
                    player.pointsLimit = new Decimal(16)
                },
                effect: 1.2,
                tooltip: "hi",
            }
    },
})
