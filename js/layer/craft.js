// 主要颜色
let primaryColor_c = '#ffc800'
// 选中颜色
let chosenColor_c = '#c9a627'
// 次要颜色
let secondaryColor_c = '#f4ffff'
// 不可选颜色
let negativeColor_c = '#777777'

activeButtonColorStyle_c = {color: secondaryColor_c + '!important'}
chosenButtonColorStyle_c = {background: chosenColor_c, color: secondaryColor_c}
lockedButtionColorStyle_c = {background: negativeColor_c, color: secondaryColor_c}

/**
 * add border style to a style object
 *
 * @param {Object} style target style object to add border style
 * @return {Object} result style object
 */
function addBorderStyle_c(style) {
    style['border-radius'] = '5px'
    style['margin'] = '5px'
    return style
}

/**
 * get upgrade button style
 *
 * @returns {Object} some of the upgrade button style
 */
function upGradeStyle_c() {
    let style
    if (hasUpgrade(this.layer, this.id)) {
        style = chosenButtonColorStyle_c
    } else if (canAffordUpgrade(this.layer, this.id)) {
        style = activeButtonColorStyle_c
    } else {
        style = lockedButtionColorStyle_c
    }
    style = addBorderStyle_c(style)
    return style
}

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
    color: primaryColor_c,
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "黏土", // Name of prestige currency
    baseResource: "土", // Name of resource prestige is based on
    baseAmount() {
        return player.s.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(0.75), // Prestige currency exponent
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
                style: upGradeStyle_c
            },
        12: {
            title: "<h2>动力压实版</h2>",
            description() {return `沙子>10时，每秒自动转化${upgradeEffect('c', 12)}单位沙子至土`},
            cost: new Decimal(2),
            unlocked() {
                return player[this.layer].unlocked
            },
            onPurchase: () => {
            },
            effect() {
                return new Decimal(0.1);
            },
            effectDisplay() {
                return this.effect()+'/s';
            },
            tooltip: "",
            style: upGradeStyle_c
        },
        13: {
            title: "<h2>回扣</h2>",
            description() {
                return "每次重置后保留一定量的土";
            },
            unlocked() {
                return hasUpgrade('c', 12);
            },
            effect() {
                let baseEff = new Decimal(1).div(20);
                return baseEff;
            },
            cost() {
              return new Decimal(35)
            },
            effectDisplay(){
                return this.effect().mul(100) + '%';
            },
            tooltip: "总得留一手，对吧",
            style: upGradeStyle_c
        }
    },
    milestones: {
        0: {
            requirementDescription: "m1: 5黏土",
            effectDescription: "解锁第二行土升级",
            done() { return player.c.points.gte(5) }
        },
        1: {
            requirementDescription: "m2: 60黏土",
            effectDescription: "解锁建筑",
            done() {
                return player.c.points.gte(60);
            }
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
        "buyables",
        ["display-text", '里程碑', {"color": secondaryColor_c}],
        "milestones"
    ]
})