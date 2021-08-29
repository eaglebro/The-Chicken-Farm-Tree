// A side layer with achievements, with no prestige
addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "achievement power",
    row: "side",
    tooltip() {
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "炼金术师",
            done() {
                return layers.s.exponent.mul(layers.s.gainExp()).gte(1);},
            tooltip() {
                return `<div style="font-size: 14px">沙子和土的兑换比例达到1:1
                ${(hasAchievement('a', 11) ? '<br>奖励：挖沙子的速度和沙子价值x' + this.effect() : '')}
                </div>`
            },
            effect() {
                return new Decimal(1.05);
            },
            onComplete() {
                player.a.points  = player.a.points.add(1)
            }
        },
        12: {
            name: '手工艺',
            done(){
                return hasUpgrade('s',14)
            },
            onComplete() {
                player.a.points  = player.a.points.add(1)
            },
            tooltip() {
                return `<div style="font-size: 14px">解锁制造台<br>
                ${(hasAchievement('a', 11) ? '<br>' +
                    '奖励：挖沙子的速度x' + format(this.effect()) + '<br>解锁的成就越多加成越高' : '')}
                </div>`;
            },
            effect() {
                return new Decimal(player.a.achievements.length).max(1).pow(1.5);
            }
        }
    },
    midsection: ["grid", "blank"],
        // grid: {
        //     maxRows: 3,
        //     rows: 2,
        //     cols: 2,
        //     getStartData(id) {
        //         return id
        //     },
        //     getUnlocked(id) { // Default
        //         return true
        //     },
        //     getCanClick(data, id) {
        //         return player.points.eq(10)
        //     },
        //     getStyle(data, id) {
        //         return {'background-color': '#'+ (data*1234%999999)}
        //     },
        //     onClick(data, id) { // Don't forget onHold
        //         player[this.layer].grid[id]++
        //     },
        //     getTitle(data, id) {
        //         return "Gridable #" + id
        //     },
        //     getDisplay(data, id) {
        //         return data
        //     },
        // },
    },
)