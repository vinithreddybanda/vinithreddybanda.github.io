export const ASSET_NAMES = [
  "tree-oak","tree-pine","tree-round","tree-tall-pine","rock-large",
  "flower-purple","flower-red","flower-yellow","bush-detailed","bridge-wood",
  "campfire","tent","house-a","house-b","house-f","house-j","house-m","planter",
  "person-male-a","person-female-a","person-male-b","person-female-c",
  "cat","deer","bunny","ship","dock","lighthouse"
];

export const REGIONS = [
  {id:"quarter",name:"The Old Quarter",short:"OLD QUARTER",x:-4,z:5,tag:"The beginning",description:"A slow little town of slate roofs, flower boxes and doors that are rarely locked.",colour:"#c5a77b"},
  {id:"meadow",name:"Bluebell Meadow",short:"BLUEBELL MEADOW",x:-72,z:49,tag:"A little colour",description:"A wide field that moves with the breeze, dotted with flowers, footpaths and quiet pools.",colour:"#9ab98c"},
  {id:"harbour",name:"Saltwind Harbour",short:"SALTWIND HARBOUR",x:93,z:34,tag:"By the water",description:"Old boats, a sleepy lighthouse and the smell of salt carried inland.",colour:"#7ca8a8"},
  {id:"forest",name:"The Whispering Woods",short:"WHISPERING WOODS",x:57,z:-74,tag:"A quieter corner",description:"A deep green woodland with soft clearings, fallen logs and well-worn animal paths.",colour:"#65866a"},
  {id:"highlands",name:"Cloudrest Highlands",short:"CLOUDREST HIGHLANDS",x:15,z:-111,tag:"Up above",description:"Pine-covered slopes and wind-carved stone overlooking the whole island.",colour:"#a4b3a3"},
  {id:"ruins",name:"The Sunken Observatory",short:"THE OLD OBSERVATORY",x:-108,z:-52,tag:"Look closer",description:"A forgotten place where the old islanders measured the stars.",colour:"#a9957c"}
];

export const NPC_DATA = [
  {id:"elowen",name:"Elowen",role:"Postmistress",mood:"Keeps a hundred little stories",asset:"person-female-a",x:-5,z:4,region:"quarter",greeting:"There you are. I was beginning to think the letter had found its own way out of town.",quest:"postcard",portrait:"E"},
  {id:"toma",name:"Toma",role:"Innkeeper",mood:"Knows everyone's favourite tea",asset:"person-male-a",x:10,z:9,region:"quarter",greeting:"A traveller! Sit a moment. The kettle is always nearly ready.",quest:"kitten",portrait:"T"},
  {id:"willow",name:"Willow",role:"Meadow gardener",mood:"Talks to flowers without embarrassment",asset:"person-female-c",x:-69,z:49,region:"meadow",greeting:"Listen. The meadow sounds different when the wind turns east.",quest:"seeds",portrait:"W"},
  {id:"maren",name:"Maren",role:"Lighthouse keeper",mood:"Has a pocket full of sea glass",asset:"person-male-b",x:94,z:25,region:"harbour",greeting:"The tide has been kind today. It brought in a little more than driftwood.",quest:"lantern",portrait:"M"},
  {id:"rowan",name:"Rowan",role:"Forest guide",mood:"Can identify a bird by its shadow",asset:"person-female-a",x:59,z:-72,region:"forest",greeting:"Walk softly. The woods have a way of hearing everything.",quest:"mushrooms",portrait:"R"},
  {id:"orin",name:"Orin",role:"Keeper of the observatory",mood:"Collects maps that lead nowhere",asset:"person-male-a",x:-107,z:-49,region:"ruins",greeting:"Most people come here to look at the stars. I prefer to look for what they left behind.",quest:"relics",portrait:"O"}
];

export const QUESTS = [
  {id:"postcard",title:"A letter with no address",giver:"elowen",target:"maren",region:"harbour",kind:"delivery",description:"Elowen has a sealed letter for Maren, the lighthouse keeper. Carry it across the island and find out why the address is missing.",shortObjective:"Take Elowen's letter to Maren at Saltwind Harbour.",reward:35,item:"A sealed letter",lore:"Some letters are written for the person we used to be."},
  {id:"seeds",title:"A meadow in bloom",giver:"willow",target:"willow",region:"meadow",kind:"collect",pickupType:"seed",amount:3,description:"Willow's packet of bluebell seeds spilled across the meadow. Find all three little bundles and bring them back before the rain.",shortObjective:"Find 3 bluebell seed bundles in the meadow.",reward:55,item:"Bluebell seeds",lore:"A garden is a promise made to tomorrow."},
  {id:"kitten",title:"A small pair of paws",giver:"toma",target:"toma",region:"quarter",kind:"pet",description:"Toma's little cat has slipped away toward the old mill path. Find the curious creature and bring it back to the inn.",shortObjective:"Find Toma's cat near the old mill path.",reward:65,item:"Toma's cat",lore:"Home is sometimes just the place that knows your name."},
  {id:"lantern",title:"Light for the long evening",giver:"maren",target:"maren",region:"highlands",kind:"collect",pickupType:"shard",amount:4,requires:"postcard",description:"The lighthouse lens has dimmed. Maren needs four pieces of clear sky-glass from the wind-carved highlands to restore its glow.",shortObjective:"Find 4 pieces of sky-glass in Cloudrest Highlands.",reward:90,item:"Sky-glass",lore:"Even a small light can change the shape of a dark coast."},
  {id:"mushrooms",title:"The forest remembers",giver:"rowan",target:"rowan",region:"forest",kind:"collect",pickupType:"mushroom",amount:4,description:"Rowan is preparing a lantern walk and needs four glowcaps from the forest floor. They grow close to old trees and fallen logs.",shortObjective:"Gather 4 glowcaps in the Whispering Woods.",reward:75,item:"Glowcaps",lore:"The forest keeps its own kind of calendar."},
  {id:"relics",title:"Three marks in the stone",giver:"orin",target:"orin",region:"ruins",kind:"collect",pickupType:"relic",amount:3,description:"Three star-marked stones are missing from the observatory ring. Find them among the ruins and return them to Orin.",shortObjective:"Find the 3 star-marked stones in the observatory ruins.",reward:120,item:"Observatory stones",lore:"The sky changes. The questions stay."}
];

export const PICKUPS = [
  {id:"seed-1",type:"seed",x:-82,z:43,label:"Bluebell seeds"},{id:"seed-2",type:"seed",x:-62,z:59,label:"Bluebell seeds"},{id:"seed-3",type:"seed",x:-58,z:43,label:"Bluebell seeds"},
  {id:"shard-1",type:"shard",x:5,z:-121,label:"Sky-glass"},{id:"shard-2",type:"shard",x:29,z:-116,label:"Sky-glass"},{id:"shard-3",type:"shard",x:43,z:-103,label:"Sky-glass"},{id:"shard-4",type:"shard",x:-8,z:-108,label:"Sky-glass"},
  {id:"mushroom-1",type:"mushroom",x:44,z:-60,label:"Glowcap"},{id:"mushroom-2",type:"mushroom",x:73,z:-83,label:"Glowcap"},{id:"mushroom-3",type:"mushroom",x:81,z:-62,label:"Glowcap"},{id:"mushroom-4",type:"mushroom",x:35,z:-91,label:"Glowcap"},
  {id:"relic-1",type:"relic",x:-120,z:-52,label:"Star-marked stone"},{id:"relic-2",type:"relic",x:-100,z:-63,label:"Star-marked stone"},{id:"relic-3",type:"relic",x:-102,z:-36,label:"Star-marked stone"}
];

export const KEEPSAKES = [
  {id:"shell-1",x:111,z:50,name:"A pink shell",note:"The sea leaves little signatures."},
  {id:"feather-1",x:45,z:-93,name:"A blue feather",note:"Something small passed overhead."},
  {id:"marble-1",x:-33,z:36,name:"A glass marble",note:"Someone must have played here once."},
  {id:"coin-1",x:-119,z:-70,name:"An old copper coin",note:"A face worn smooth by time."},
  {id:"star-1",x:24,z:-126,name:"A piece of the night",note:"The highlands hold the sky close."},
  {id:"bottle-1",x:104,z:8,name:"A message bottle",note:"The handwriting is almost gone."},
  {id:"leaf-1",x:68,z:-42,name:"A pressed leaf",note:"A tiny map of a tree."},
  {id:"bell-1",x:-46,z:67,name:"A little brass bell",note:"It rings when the wind turns."}
];

export const MODEL_URL = name => "./assets/models/" + name + ".glb";
