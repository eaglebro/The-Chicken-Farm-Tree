let modInfo = {
	name: "The Chicken Farm Tree",
	id: "chickenfarmmod",
	author: "jibro",
	pointsName: "沙子",
	modFiles: ['layer/achievements.js', "layer/soil.js", "layer/craft.js","layer/build.js", "layer/earthworm.js", "tree.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.0.4",
	name: "Soil Farm",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.0.4</h2><br>
		-增加制造里程碑m1，m2
		-增加制造升级’回扣‘
		-实装su22效果
		-增加节点建筑
		-修复成就点数显示不正确的bug
		-修复su21，su22在没达到里程碑就可以显示的bug
	<h2>v0.0.3</h2><br>
		-Add two upgrades to Craft layer<br>
		-Bug fixed<br>
	<h2>v0.0.2</h2><br>
		- Added achievements panel.<br>
		- Added a new achievement to unlock.<br>
		- Added a new layer -- Craft, where you<br>
		    can make new equipments and upgrades<br>
	<h2>v0.0.1</h2><br>
		- Added layer soil.<br>
		- Added 3 clickable things.<br>
		- Some style adjustment`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return player.points.lt(player.pointsLimit)
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade('s', 12)) gain = gain.times(upgradeEffect('s', 12));
	if (hasUpgrade('s', 13)) gain = gain.times(upgradeEffect('s', 13));
	if (hasAchievement('a', 11)) gain = gain.times(achievementEffect('a', 11));
	if (hasAchievement('a', 12)) gain = gain.times(achievementEffect('a', 12));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	pointsLimit: new Decimal(1)
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
	// return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}