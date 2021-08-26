// 主要颜色
const primaryColor = '#ff7f00'
// 选中颜色
const chosenColor = '#c97927'
// 次要颜色
const secondaryColor = '#f4ffff'
// 不可选颜色
const negativeColor = '#777777'

activeButtonColorStyle = {color: secondaryColor + '!important'}
chosenButtonColorStyle = {background: chosenColor, color: secondaryColor}
lockedButtionColorStyle = {background: negativeColor, color: secondaryColor}

/**
 * add border style to a style object
 *
 * @param {Object} style target style object to add border style
 * @return {Object} result style object
 */
function addBorderStyle(style) {
    style['border-radius'] = '5px'
    style['margin'] = '5px'
    return style
}

/**
 * get upgrade button style
 *
 * @returns {Object} some of the upgrade button style
 */
function upGradeStyle() {
    let style
    if (hasUpgrade(this.layer, this.id)) {
        style = chosenButtonColorStyle
    } else if (canAffordUpgrade(this.layer, this.id)) {
        style = activeButtonColorStyle
    } else {
        style = lockedButtionColorStyle
    }
    style = addBorderStyle(style)
    return style
}

function buyableStyle() {
    let style
    if (getBuyableAmount(this.layer, this.id).eq(this.purchaseLimit)) {
        style = chosenButtonColorStyle;
    } else if (canBuyBuyable(this.layer, this.id)) {
        style = activeButtonColorStyle;
    } else {
        style = lockedButtionColorStyle;
    }
    style = addBorderStyle(style)
    return style
}

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
    color: primaryColor,
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
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        // 达到2时1:1生成
        return new Decimal(1).mul(buyableEffect(this.layer, 11));
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
        11:
            {
                title: "<h2>小盒子</h2>",
                description: "增加沙子上限至16",
                cost: new Decimal(10),
                unlocked() {
                    return player[this.layer].unlocked
                }, // The upgrade is only visible when this is true
                // branches: [UPDATE_SAND_EFFECT_1],
                onPurchase: () => {
                    player.pointsLimit = new Decimal(16)
                },
                tooltip: "",
                style: upGradeStyle
            },
        12:
            {
                title: "<h2>挖的更快了</h2>",
                description: "沙子获取效率x1.2",
                cost: new Decimal(20),
                unlocked() {
                    return hasUpgrade('s', 11)
                },
                effect: 1.2,
                tooltip: "",
                style: upGradeStyle
            },
        13:
            {
                title: "<h2>熟练掌握</h2>",
                description: `总获取土的数目加成挖的速度\nx2`,
                cost: new Decimal(45),
                unlocked() {
                    return hasUpgrade('s', 12)
                },
                effect() {
                    let eff = 2
                    return eff;
                },
                style: upGradeStyle
            }
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(x).pow(x) },
            display() {
                return `
                    <h2>减少税率</h2>\n\n
                    使沙子的价值^${this.effect()}\n
                    Cost: ${format(this.cost())}土\n
                    ( ${getBuyableAmount(this.layer, this.id)}/ ${this.purchaseLimit} )已购买
                `;
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                return format(new Decimal(1).add(new Decimal(0.2).mul(x)));},
            purchaseLimit: 5,
            style: buyableStyle
        },
    },
    tabFormat: [
        "main-display",
        "prestige-button",
        "resource-display",
        "blank",
        "blank",
        "blank",
        "blank",
        "upgrades",
        "buyables"
    ],
    // componentStyles:{
    //     "upgrades"() {return {background: '#f4ffff'}}
    // }
})
