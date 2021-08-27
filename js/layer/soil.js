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
            points: new Decimal(0),
            pointsAcquisitionTotal: new Decimal(0)
        }
    },
    update(diff) {
        // 计算获取的沙子总量。总量每次增加这一帧获得的沙子数量。如果下一帧到达上限则使用到达上限的所需值
        player[this.layer].pointsAcquisitionTotal = player[this.layer].pointsAcquisitionTotal.add(tmp.pointGen.times(diff))
        player.pointsLimit = upgradeEffect('s', 11)
    },
    color: primaryColor,
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "土", // Name of prestige currency
    baseResource: "沙子", // Name of resource prestige is based on
    baseAmount() {
        return player.points

    }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: new Decimal(0.5), // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasAchievement('a', 11)) mult = mult.mul(achievementEffect('a', 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        // 达到2时1:1生成
        return new Decimal(1).mul(buyableEffect(this.layer, 11));
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [],
    layerShown() {
        return true
    },
    doReset(resettingLayer) {
        let keep = [];
    //     // if (resettingLayer=="s") keep.push("points","best","total","milestones","upgrades");
    //     // if (resettingLayer=="a") keep.push("points","best","total","milestones","upgrades");
    //     // if (resettingLayer=="bm") keep.push("points","best","total","milestones","upgrades");
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer, keep)
            player.s.upgrades = [14]
        }
    },
    upgrades: {
        11:
            {
                // title: `<h2>${hasUpgrade('c', 11)?'小盒子':'大盒子'}</h2>`,
                title(){ return `<h2>${hasUpgrade('c', 11)?'大盒子': '小盒子'}</h2>`},
                description: "增加沙子上限",
                cost: new Decimal(10),
                unlocked() {
                    return player[this.layer].unlocked
                },
                onPurchase() {

                },
                effect() {
                    let eff = new Decimal(1)
                    if(hasUpgrade('s', 11)) {
                        eff = new Decimal(16)
                        if(hasUpgrade('c', 11)) eff = new Decimal(3000)
                    }
                    return eff
                },
                effectDisplay(){
                    return this.effect();
                },
                tooltip: "",
                style: upGradeStyle
            },
        12:
            {
                title: "<h2>挖的更快了</h2>",
                description: "沙子获取效率增加",
                cost: new Decimal(20),
                unlocked() {
                    return hasUpgrade('s', 11)
                },
                effectDisplay() {
                    return format(this.effect());
                },
                effect(){
                    return new Decimal(1.2)
                },
                tooltip: "",
                style: upGradeStyle
            },
        13:
            {
                title: "<h2>熟练掌握</h2>",
                description: `总获取沙子的数目加成挖的速度`,
                cost: new Decimal(45),
                unlocked() {
                    return hasUpgrade('s', 12)
                },
                effectDisplay() {
                    return format(this.effect())+ "x";
                },
                effect() {
                    let total = player.s.pointsAcquisitionTotal
                    if (!total) {
                        player.s.pointsAcquisitionTotal = new Decimal(1);
                    }
                    return ((total).max(10).log10()).max(1);
                },
                style: upGradeStyle
            },
        14: {
            title:"<h2>解锁制造台</h2>",
            description: '用这些土搭个台子吧',
            cost: new Decimal(120),
            unlocked() {
                return hasUpgrade('s', 12) || player.c.unlocked;
            },
            style: upGradeStyle,
        }
    },
    buyables: {
        11: {
            cost(x) { return new Decimal(x).pow(x) },
            display() {
                return `
                    <h2>减少税率</h2>\n\n
                    增加沙子的价值\n
                    Currently: ^${this.effect()}\n
                    Cost: ${format(this.cost())}土\n
                    (${getBuyableAmount(this.layer, this.id)} / ${this.purchaseLimit})已购买
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
        ["display-text",
            function() { return `总计获取了 ${format(player[this.layer].pointsAcquisitionTotal)} 沙子` },
            { "color": secondaryColor, "font-size": "32px", "font-family": "Comic Sans MS" }],
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
