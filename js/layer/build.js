// 主要颜色
let primaryColor_b = '#73ea0a'
// 选中颜色
let chosenColor_b = '#58b331'
// 次要颜色
let secondaryColor_b = '#f4ffff'
// 不可选颜色
let negativeColor_b = '#777777'

activeButtonColorStyle_b = {background: primaryColor_b, color: secondaryColor_b + '!important'}
chosenButtonColorStyle_b = {background: chosenColor_b, color: secondaryColor_b}
lockedButtionColorStyle_b = {background: negativeColor_b, color: secondaryColor_b}

/**
 * add border style to a style object
 *
 * @param {Object} style target style object to add border style
 * @return {Object} result style object
 */
function addBorderStyle_b(style) {
    style['border-radius'] = '5px'
    style['margin'] = '5px'
    return style
}

/**
 * get upgrade button style
 *
 * @returns {Object} some of the upgrade button style
 */
function upGradeStyle_b() {
    let style
    if (hasUpgrade(this.layer, this.id)) {
        style = chosenButtonColorStyle_b
    } else if (canAffordUpgrade(this.layer, this.id)) {
        style = activeButtonColorStyle_b
    } else {
        style = lockedButtionColorStyle_b
    }
    style = addBorderStyle_b(style)
    return style
}

addLayer('b', {
    name: "build", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "建筑", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position wit1hin a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked() {
                return hasMilestone('c', 1)
            },
            points: new Decimal(0),
        }
    },
    update(diff) {
        // 烧砖
        layers.b.clickables[11].update(diff)
    },
    color: primaryColor_b,
    requires: new Decimal(150), // Can be a function that takes requirement increases into account
    resource: "砖", // Name of prestige currency
    baseResource: "黏土", // Name of resource prestige is based on
    baseAmount() {
        return player.c.points
    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(1), // Prestige currency expone1nt
    branches: [],
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(0.5)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        // 达到2时1:1生成
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown() {
        return hasMilestone('c', 1)
    },
    clickables: {
        11: {
            title(){
                return `<h2>烧砖${this.abOn?'(进行中)':'(已停止)'}</h2><br>
                    持续烧砖，花费${this.cost()}黏土，每${this.tick.toFixed(2)+'/'+this.abtick()}秒烧制一块砖
                    `
            },
            display() {
            },
            tick: new Decimal(0),
            cost() {
                return new Decimal(20)
            },
            abtick() {
                return new Decimal(30)
            },
            abOn: false,
            onClick(){
                this.abOn = !this.abOn
                this.tick = new Decimal(0)
            },
            style() {
                return this.abOn ? chosenButtonColorStyle_b: activeButtonColorStyle_b
            },
            canClick: true,
            update(diff) {
                if (!this.abOn) return
                if (this.tick.lt(this.abtick())) {
                    this.tick = this.tick.add(diff);
                } else {
                    if (player.c.points.gt(this.cost())) {
                        player.c.points = player.c.points.minus(this.cost());
                        player.b.points = player.b.points.add(1)
                    }
                    this.tick = new Decimal(0)
                }
                this.display()
            }
        },

    },
    doReset(resettingLayer) {
        let keep = [];
        let keepLayer = ['s', 'c']
        if (keepLayer.indexOf(resettingLayer) > -1) {
            keep.push("points", "best", "total", "milestones", "upgrades");
        }
        if (layers[resettingLayer].row > this.row) layerDataReset("b", keep);
    },
    upgrades: {
        11:
            {
                title: "<h2>土培箱</h2>",
                description: '解锁土培箱，以培养蚯蚓',
                cost: new Decimal(30),
                unlocked() {
                    return player[this.layer].unlocked
                },
                tooltip: "",
                style: upGradeStyle_b
            },
        // 12: {
        //     title() {
        //         return "<h2>改进工艺</h2>";
        //     }
        // }
    },
    milestones: {

    },
    tabFormat: [
        "main-display",
        // "prestige-button",
        // "resource-display",
        "clickables",
        "blank",
        "blank",
        "blank",
        "blank",
        "upgrades",
        "buyables",
        // ["display-text", '里程碑', {"color": secondaryColor_c}],
        "milestones"
    ]
})