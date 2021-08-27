// // 主要颜色
// const primaryColor = '#ffc800'
// // 选中颜色
// const chosenColor = '#c9a627'
// // 次要颜色
// const secondaryColor = '#f4ffff'
// // 不可选颜色
// const negativeColor = '#777777'
//
// activeButtonColorStyle = {color: secondaryColor + '!important'}
// chosenButtonColorStyle = {background: chosenColor, color: secondaryColor}
// lockedButtionColorStyle = {background: negativeColor, color: secondaryColor}
//
// /**
//  * add border style to a style object
//  *
//  * @param {Object} style target style object to add border style
//  * @return {Object} result style object
//  */
// function addBorderStyle(style) {
//     style['border-radius'] = '5px'
//     style['margin'] = '5px'
//     return style
// }
//
// /**
//  * get upgrade button style
//  *
//  * @returns {Object} some of the upgrade button style
//  */
// function upGradeStyle() {
//     let style
//     if (hasUpgrade(this.layer, this.id)) {
//         style = chosenButtonColorStyle
//     } else if (canAffordUpgrade(this.layer, this.id)) {
//         style = activeButtonColorStyle
//     } else {
//         style = lockedButtionColorStyle
//     }
//     style = addBorderStyle(style)
//     return style
// }

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
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "黏土", // Name of prestige currency
    baseResource: "土", // Name of resource prestige is based on
    baseAmount() {
        return player.s.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(0.5), // Prestige currency exponent
    branches: ['s'],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        // 达到2时1:1生成
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown() {
        return hasUpgrade('s', 14)
    },
    upgrades: {
        11:
            {
                title: "<h2>大盒子</h2>",
                description: '使“小盒子”升级变为”大盒子“，沙子上限提高至3000',
                cost: new Decimal(1),
                unlocked() {
                    return player[this.layer].unlocked
                },
                onPurchase: () => {
                },
                effect() {
                    return new Decimal(3000);
                },
                effectDisplay() {
                    return this.effect();
                },
                tooltip: "",
                // style: upGradeStyle
            },
        12: {
            title: "<h2>动力压实版</h2>",
            description: '每秒自动转化0.5单位沙子至土（还没做呢）',
            cost: new Decimal(2),
            unlocked() {
                return player[this.layer].unlocked
            },
            onPurchase: () => {
            },
            effect() {
                return new Decimal(0.5);
            },
            effectDisplay() {
                return this.effect()+'/s';
            },
            tooltip: "",
            // style: upGradeStyle
        }
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
    ]
})