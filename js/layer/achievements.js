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
                ${(hasAchievement('a', 12) ? '<br>' +
                    '奖励：挖沙子的速度x' + format(this.effect()) + '<br>解锁的成就越多加成越高' : '')}
                </div>`;
            },
            effect() {
                return new Decimal(player.a.achievements.length).max(1).pow(1.5);
            }
        },
        13: {
            name: "建筑师",
            done() {
                return hasMilestone('c',1)
                },
            tooltip() {
                return `<div style="font-size: 14px">解锁建筑节点
                ${(hasAchievement('a', 13) ? '<br>奖励：挖沙子的速度和沙子价值x' + this.effect() : '')}
                </div>`
            },
            effect() {
                return new Decimal(1.05);
            },
            onComplete() {
                player.a.points  = player.a.points.add(1)
            }
        }
    },
    tabFormat: [
        // "main-display",
        ["display-text",
            function() { return `共有${player.a.achievements.length}点成就点数` },
            { "color": 'yellow', "font-size": "32px", "font-family": "Comic Sans MS" }],
        "blank",
        "blank",
        "blank",
        "blank",
        "achievements",
    ],
    },
)