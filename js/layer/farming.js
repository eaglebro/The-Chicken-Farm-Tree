/**
 * 增加人口的方法
 * 如果一天增加的人口小于1，则有0.75概率增加1人口
 * 否则增加的人口数为整数部分+小数部分的概率加1
 */
function updateWorm() {
    let {population, growthRate, sc} = player.f.earthworm
    let populationAfter = new Decimal(population);
    let incr = population.mul(growthRate.minus(1));
    if (incr.lt(1)) {
        if (Math.random() < 0.75) {
            populationAfter = population.add(1)
        }
    } else {
        let int = incr.floor()
        let deci = incr.minus(int)
        populationAfter = population.add(int).add(deci.gte(Math.random())?1:0)
    }
    populationAfter = softcap(populationAfter, sc, 0.5).floor()
    player.f.earthworm.population = populationAfter
}

addLayer('f', {
    name: "farming",
    symbol: "养殖",
    position: 2,
    startData() {
        return {
            unlocked() {
                return hasUpgrade('b', 11)
            },
            points: new Decimal(0),
            earthworm: {
                // 数量
                population: new Decimal(2),
                // 增长率
                growthRate: new Decimal(1.1),
                // 软上限
                sc: new Decimal(300)
            },
            dayLength: new Decimal(5),
            timeNow: new Decimal(0)
        }
    },
    update(diff) {
        if (this.isNewDay(diff) === false) return
        updateWorm()
    },

    /**
     * 是否是新的一天
     *
     * @param diff
     */
    isNewDay(diff) {
        player.f.timeNow = player.f.timeNow.add(diff)
        if (player.f.timeNow.gte(player.f.dayLength)) {
            player.f.timeNow = player.f.timeNow.minus(player.f.dayLength);
            return true;
        } else {
            return false;
        }
    },
    color: '#ffffff',
    requires: new Decimal(150),
    resource: "砖",
    baseResource: "砖",
    baseAmount() {
        return player.c.points
    },
    type: "normal",
    exponent: new Decimal(1),
    branches: ['b'],
    gainMult() {
        let mult = new Decimal(0.5)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    row: 1,
    hotkeys: [],
    layerShown() {
        return hasMilestone('c', 1)
    },
    doReset(resettingLayer) {
        let keep = [];
        let keepLayer = ['s', 'b', 'c']
        if (keepLayer.indexOf(resettingLayer) > -1) {
            keep.push("points", "best", "total", "milestones", "upgrades");
        }
        if (layers[resettingLayer].row > this.row) layerDataReset("f", keep);
    },
    tabFormat: {
        "土培箱": {
            buttonStyle() {
                return {'color': 'orange'}
            },
            shouldNotify: true,
            content:
                [
                    ["blank", "5px"], // Height
                    // ["raw-html", function () {
                    //     return "<button onclick='console.log(`yeet`); makeParticles(textParticle)'>'HI'</button>"
                    // }],
                    // ["display-text", "Name your points!"],
                    // ["text-input", "thingy"],
                    ["display-text",
                        function () {
                            return `现在有${player.f.earthworm.population}只蚯蚓`
                        },
                        {"color": "red", "font-size": "32px", "font-family": "Comic Sans MS"}],
                    "h-line", "milestones", "blank", "upgrades", "challenges"],
            glowColor: "blue",

        },
    }
})

const textParticle = {
    spread: 20,
    gravity: 0,
    time: 3,
    speed: 0,
    text: function() { return "<h1 style='color:yellow'>" + format(player.points)},
    offset: 30,
    fadeInTime: 1,
}