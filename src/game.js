import * as THREE from "three";
import { World } from "./world.js";
import { NPC_DATA, QUESTS, REGIONS, KEEPSAKES } from "./data.js";

const $ = id => document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const saved=(()=>{try{return JSON.parse(localStorage.getItem("morrowvale-save")||"null");}catch{return null;}})();

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xc7d9d7);
scene.fog=new THREE.FogExp2(0xc7d9d7,.00225);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,650);
const renderer=new THREE.WebGLRenderer({canvas:$("world"),antialias:true,powerPreference:"high-performance"});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.14;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;

const hemi=new THREE.HemisphereLight(0xf5f3df,0x627d69,1.75);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe7bf,2.45);
sun.position.set(-75,115,55);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);
sun.shadow.camera.left=-190;sun.shadow.camera.right=190;sun.shadow.camera.top=190;sun.shadow.camera.bottom=-190;
sun.shadow.camera.near=1;sun.shadow.camera.far=330;sun.shadow.bias=-.00022;sun.shadow.normalBias=.025;
scene.add(sun);
const fill=new THREE.DirectionalLight(0xc2d8e5,.55);fill.position.set(90,45,-100);scene.add(fill);

let started=false,paused=false,modalOpen=false,playerActor=null,playerModel=null,previewRenderer=null,previewScene=null,previewCamera=null,previewActor=null;
let player={x:-1,z:15,yaw:0,speed:0,name:saved?.name||"Wanderer",avatar:saved?.avatar||"person-male-a",tint:saved?.tint||0};
let cameraYaw=0,cameraPitch=.22,walkClock=0,worldTime=0,dayTime=.24,lastSave=0;
const keys={},joystick={x:0,y:0,active:false};
const discovered=new Set(saved?.discovered||["quarter"]);
const foundKeepsakes=new Set(saved?.keepsakes||[]);
const questStates=new Map(QUESTS.map(q=>[q.id,{status:saved?.quests?.[q.id]?.status||"available",progress:saved?.quests?.[q.id]?.progress||0}]));
const inventory=new Map(Object.entries(saved?.inventory||{}));
let activeQuestId=saved?.activeQuestId||"postcard",coins=saved?.coins||0,toastTimer=0,interaction=null;
const world=new World(scene,(ratio,label)=>{
  const p=Math.round(ratio*100);$("loading-progress").style.width=p+"%";$("loading-percent").textContent=p+"%";
  $("loading-copy").textContent=label==="World assets ready"?"Putting the finishing touches on the island…":"Gathering the island's little details…";
});

function addPlayerModel(parent,name,tint=0){
  const source=world.models.get(name);if(!source)return null;
  const model=source.clone(true);model.updateMatrixWorld(true);
  const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3());
  const factor=2.1/Math.max(size.y,.001);model.scale.multiplyScalar(factor);model.position.y-=box.min.y*factor;
  model.traverse(o=>{
    if(o.isMesh){
      o.castShadow=true;o.receiveShadow=true;
      if(o.material){
        o.material=o.material.clone();
        if(tint&&o.material.color)o.material.color.offsetHSL(0,0,tint);
      }
    }
  });
  parent.add(model);return model;
}
function createPlayer(){
  playerActor=new THREE.Group();scene.add(playerActor);
  playerModel=addPlayerModel(playerActor,player.avatar,player.tint);
  if(!playerModel){
    const fallback=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.9,5,8),new THREE.MeshStandardMaterial({color:0x879e7e}));fallback.position.y=.8;playerActor.add(fallback);playerModel=fallback;
  }
  playerActor.position.set(player.x,world.heightAt(player.x,player.z),player.z);
}
function setAvatar(name){
  player.avatar=name;
  if(playerModel){playerActor.remove(playerModel);playerModel.traverse?.(o=>{if(o.geometry)o.geometry.dispose();});}
  playerModel=addPlayerModel(playerActor,name,player.tint);
  if(!playerModel){playerModel=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.9,5,8),new THREE.MeshStandardMaterial({color:0x879e7e}));playerModel.position.y=.8;playerActor.add(playerModel);}
  if(previewActor){while(previewActor.children.length)previewActor.remove(previewActor.children[0]);addPlayerModel(previewActor,name,player.tint);}
}
function setTint(value){
  player.tint=value;
  setAvatar(player.avatar);
}
function makePreview(){
  const canvas=$("wardrobe-canvas");if(!canvas)return;
  previewRenderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  previewRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));previewRenderer.setSize(94,94,false);
  previewRenderer.outputColorSpace=THREE.SRGBColorSpace;
  previewScene=new THREE.Scene();
  previewScene.add(new THREE.HemisphereLight(0xf7f5e6,0x71856c,2.2));
  const light=new THREE.DirectionalLight(0xffe7c2,2.1);light.position.set(-3,6,4);previewScene.add(light);
  previewCamera=new THREE.PerspectiveCamera(30,1,.1,20);previewCamera.position.set(0,1.55,5.9);previewCamera.lookAt(0,1,0);
  previewActor=new THREE.Group();previewScene.add(previewActor);addPlayerModel(previewActor,player.avatar,player.tint);
}
function loadingError(message){
  $("loading-copy").textContent=message;$("loading-copy").style.color="#9d6f61";
}

async function initialise(){
  await world.loadAssets();
  world.build();
  if(saved?.position&&world.onLand(saved.position.x,saved.position.z)){player.x=saved.position.x;player.z=saved.position.z;}
  createPlayer();makePreview();
  world.pickups.forEach(p=>{if(saved?.pickups?.includes(p.id))p.found=true,p.group.visible=false;});
  world.keepsakes.forEach(k=>{if(foundKeepsakes.has(k.id))k.found=true,k.group.visible=false;});
  world.keepsakes.forEach(k=>{if(k.found)k.group.visible=false;});
  discovered.forEach(id=>{const r=REGIONS.find(x=>x.id===id);if(r)r.discovered=true;});
  buildRegionStrip();updateQuestUI();updatePlayerHUD();updateRegion();
  $("loading").classList.add("done");
  setTimeout(()=>$("loading").remove(),800);
  requestAnimationFrame(loop);
}
initialise().catch(error=>{console.error(error);loadingError("The island could not finish loading. Refresh to try again.");});

function saveGame(show=false){
  const state={
    position:{x:player.x,z:player.z},name:player.name,avatar:player.avatar,tint:player.tint,
    discovered:[...discovered],keepsakes:[...foundKeepsakes],coins,activeQuestId,
    quests:Object.fromEntries([...questStates.entries()]),
    inventory:Object.fromEntries(inventory.entries()),
    pickups:world.pickups.filter(p=>p.found).map(p=>p.id)
  };
  try{localStorage.setItem("morrowvale-save",JSON.stringify(state));lastSave=worldTime;if(show){$("save-toast").classList.add("show");setTimeout(()=>$("save-toast").classList.remove("show"),1300);}}catch(e){console.warn("Save failed",e);}
}
window.addEventListener("beforeunload",()=>saveGame());
function addInventory(name,count=1){inventory.set(name,(inventory.get(name)||0)+count);}
function removeInventory(name,count=1){const n=(inventory.get(name)||0)-count;if(n>0)inventory.set(name,n);else inventory.delete(name);}
function questState(id){return questStates.get(id);}
function activeQuest(){return questStates.get(activeQuestId)?.status==="active"||questStates.get(activeQuestId)?.status==="ready"?QUESTS.find(q=>q.id===activeQuestId):null;}
function updateQuestUI(){
  let q=activeQuest();
  if(!q)q=QUESTS.find(x=>questState(x.id).status==="active"||questState(x.id).status==="ready");
  if(!q){$("objective-title").textContent=QUESTS.every(x=>questState(x.id).status==="complete")?"The island knows your footsteps":"A world of little stories";$("objective-description").textContent=QUESTS.every(x=>questState(x.id).status==="complete")?"Every story has found its way home. Keep wandering.":"Meet the people of Morrowvale. Every path leads somewhere."; $("objective-fill").style.width="0%";$("objective-status").textContent="NO STORY IN A HURRY";return;}
  activeQuestId=q.id;const s=questState(q.id);
  $("objective-title").textContent=q.title;
  $("objective-description").textContent=s.status==="ready"?"Return to "+NPC_DATA.find(n=>n.id===q.target).name+" and tell them what you found.":q.shortObjective;
  const amount=q.amount||1;const progress=q.kind==="delivery"?(s.status==="ready"?1:0):Math.min(s.progress,amount);
  $("objective-fill").style.width=(progress/amount*100)+"%";
  $("objective-status").textContent=s.status==="ready"?"READY TO BRING HOME":q.kind==="delivery"?"A LETTER TO CARRY":progress+" / "+amount+" FOUND";
}
function startQuest(q){
  if(q.requires&&questState(q.requires).status!=="complete"){showToast("There is another little story to finish first.");return;}
  const s=questState(q.id);if(s.status!=="available")return;
  s.status="active";s.progress=0;activeQuestId=q.id;
  if(q.item)addInventory(q.item);
  updateQuestUI();saveGame(true);showToast("A new story is yours to carry.");
}
function completeQuest(q){
  const s=questState(q.id);if(s.status==="complete")return;
  s.status="complete";coins+=q.reward;activeQuestId=QUESTS.find(x=>questState(x.id).status==="active"||questState(x.id).status==="ready")?.id||"";
  if(q.item)removeInventory(q.item);
  if(q.kind==="collect")removeInventory(q.item);
  updateQuestUI();updatePlayerHUD();saveGame(true);
  showToast("Story complete · "+q.reward+" shell coins");
}
function showToast(message){
  const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove("show"),2600);
}
function showDialog(npc,line,actions){
  $("dialogue-name").textContent=npc.name;$("dialogue-role").textContent=npc.role.toUpperCase();
  $("dialogue-mood").textContent=npc.mood;$("dialogue-portrait").textContent=npc.portrait;
  $("dialogue-context").textContent=REGIONS.find(r=>r.id===npc.region)?.short||"MORROWVALE";
  $("dialogue-text").textContent=line;
  const container=$("dialogue-actions");container.replaceChildren();
  actions.forEach(({label,primary=true,onClick})=>{
    const button=document.createElement("button");button.className=primary?"primary-button":"secondary-button";button.textContent=label;
    button.addEventListener("click",()=>{onClick();});container.append(button);
  });
  openOverlay("dialogue-overlay");
}
function npcInteraction(npc){
  const targetQuest=QUESTS.find(q=>q.target===npc.id&&["active","ready"].includes(questState(q.id).status));
  if(targetQuest){
    const state=questState(targetQuest.id);
    if(targetQuest.kind==="delivery"||state.status==="ready"){
      showDialog(npc,"You brought it all this way. Thank you. Some things only become important because someone takes the time to carry them.",[
        {label:"THAT'S WHAT THE PATHS ARE FOR",onClick:()=>{completeQuest(targetQuest);closeOverlay("dialogue-overlay");}},
        {label:"A LITTLE MORE",primary:false,onClick:()=>closeOverlay("dialogue-overlay")}
      ]);return;
    }
    const remaining=Math.max(0,(targetQuest.amount||1)-state.progress);
    showDialog(npc,remaining+" more little "+(targetQuest.kind==="collect"?"finds":"step")+(remaining===1?"":"s")+" and this story can find its way home.",[
      {label:"I'LL KEEP LOOKING",onClick:()=>closeOverlay("dialogue-overlay")}
    ]);return;
  }
  const q=QUESTS.find(q=>q.giver===npc.id);
  if(q){
    const state=questState(q.id);
    if(state.status==="available"){
      if(q.requires&&questState(q.requires).status!=="complete"){
        showDialog(npc,"I have something I'd like your help with. But first, there is another letter that needs to reach the harbour. One path at a time.",[{label:"I'LL COME BACK",onClick:()=>closeOverlay("dialogue-overlay")}]);return;
      }
      showDialog(npc,npc.greeting+" "+q.description,[
        {label:"I'D LIKE TO HELP",onClick:()=>{startQuest(q);closeOverlay("dialogue-overlay");}},
        {label:"MAYBE LATER",primary:false,onClick:()=>closeOverlay("dialogue-overlay")}
      ]);return;
    }
    if(state.status==="active"){
      if(q.kind==="delivery"){
        showDialog(npc,"The letter is safe with you. Maren is keeping the lighthouse at Saltwind Harbour. Follow the coast path east.",[{label:"ON MY WAY",onClick:()=>closeOverlay("dialogue-overlay")}]);return;
      }
      const ready=state.progress>=(q.amount||1);
      showDialog(npc,ready?"You found everything. Come a little closer. I want to see what the island sent back.":q.description+" You've found "+state.progress+" of "+q.amount+".",[
        {label:ready?"LET'S FINISH THIS":"I'LL KEEP LOOKING",onClick:()=>{if(ready)completeQuest(q);closeOverlay("dialogue-overlay");}},
        {label:"SEE YOU",primary:false,onClick:()=>closeOverlay("dialogue-overlay")}
      ]);return;
    }
    showDialog(npc,"You did a kind thing. I hope the island has been kind to you in return.",[{label:"UNTIL NEXT TIME",onClick:()=>closeOverlay("dialogue-overlay")}]);return;
  }
  showDialog(npc,npc.greeting,[{label:"SIT A MOMENT",onClick:()=>{closeOverlay("dialogue-overlay");showToast("You shared a quiet moment with "+npc.name+".");}}]);
}
function pickupInteraction(item){
  if(item.found)return;
  item.found=true;item.group.visible=false;
  const q=QUESTS.find(q=>q.pickupType===item.type&&["active","ready"].includes(questState(q.id).status));
  if(q){
    const s=questState(q.id);s.progress++;addInventory(q.item,1);
    if(s.progress>=q.amount)s.status="ready";
    updateQuestUI();showToast(q.item+" found · "+s.progress+" / "+q.amount);
  }else showToast(item.label+" found");
  saveGame(true);
}
let catRecovered=false;
function petInteraction(pet){
  const q=QUESTS.find(q=>q.id==="kitten"),s=questState("kitten");
  if(pet.id==="cat"&&s.status==="active"&&!catRecovered){
    catRecovered=true;s.status="ready";s.progress=1;addInventory(q.item);
    showToast("The little cat decides to follow you.");
    updateQuestUI();saveGame(true);return;
  }
  showToast(pet.id==="cat"?"A small purr.":"The animal watches you quietly.");
}
function keepsakeInteraction(item){
  if(item.found)return;item.found=true;item.group.visible=false;foundKeepsakes.add(item.id);coins+=8;
  addInventory(item.name);$("keepsake-count").textContent=foundKeepsakes.size;updatePlayerHUD();
  showToast("Keepsake found · "+item.name);saveGame(true);
}
function closestInteraction(){
  const p={x:player.x,z:player.z};let best=null,bestD=5.1;
  for(const npc of world.npcs.values()){const d=dist(p,{x:npc.root.position.x,z:npc.root.position.z});if(d<bestD){bestD=d;best={type:"npc",entity:npc,d};}}
  for(const item of world.pickups){if(item.found)continue;const q=QUESTS.find(q=>q.pickupType===item.type&&["active","ready"].includes(questState(q.id).status));if(!q)continue;const d=dist(p,item);if(d<bestD){bestD=d;best={type:"pickup",entity:item,d};}}
  for(const item of world.keepsakes){if(item.found)continue;const d=dist(p,item);if(d<bestD){bestD=d;best={type:"keepsake",entity:item,d};}}
  const cat=world.pets.get("cat");if(cat&&questState("kitten").status==="active"&&!catRecovered){const d=dist(p,{x:cat.model.position.x,z:cat.model.position.z});if(d<bestD){bestD=d;best={type:"pet",entity:cat,d};}}
  return best;
}
function interact(){
  if(!started||paused)return;
  const near=closestInteraction();if(!near){showToast("Just the breeze, and a little more path.");return;}
  if(near.type==="npc")npcInteraction(near.entity);
  else if(near.type==="pickup")pickupInteraction(near.entity);
  else if(near.type==="keepsake")keepsakeInteraction(near.entity);
  else if(near.type==="pet")petInteraction(near.entity);
}

function updatePlayerHUD(){
  $("player-display-name").textContent=player.name;$("player-avatar").textContent=player.name.slice(0,1).toUpperCase();
  $("keepsake-count").textContent=foundKeepsakes.size;$("level-label").textContent="WANDERER "+(Math.floor((coins+foundKeepsakes.size*8)/80)+1);
}
function updateRegion(){
  let nearest=REGIONS[0],best=1e9;
  for(const r of REGIONS){const d=dist(player,r);if(d<best){best=d;nearest=r;}}
  if(best<58&&!discovered.has(nearest.id)){
    discovered.add(nearest.id);showToast("A new place found · "+nearest.name);saveGame(true);
  }
  if(best<61){
    $("location-name").textContent=nearest.name;$("header-region").textContent=nearest.short;
  }
}

function openOverlay(id){
  $(id).classList.add("open");$(id).setAttribute("aria-hidden","false");modalOpen=true;
}
function closeOverlay(id){
  $(id).classList.remove("open");$(id).setAttribute("aria-hidden","true");
  modalOpen=!!document.querySelector(".overlay.open");
}
document.querySelectorAll("[data-close]").forEach(btn=>btn.addEventListener("click",()=>closeOverlay(btn.dataset.close)));
$("begin").addEventListener("click",()=>{
  started=true;$("title-screen").classList.add("hidden");
  ["game-header","location-card","objective-card","minimap-shell","player-status","control-hint","quick-actions"].forEach(id=>$(id).classList.add("visible"));
  saveGame();showToast("The path begins wherever you are.");
});
function openJournal(tab="stories"){renderJournal(tab);openOverlay("journal-overlay");}
$("journal-open").onclick=$("quick-journal").onclick=()=>openJournal();
$("map-open").onclick=$("quick-map").onclick=()=>{drawWorldMap();openOverlay("map-overlay");};
$("wardrobe-open").onclick=()=>{renderWardrobe();openOverlay("wardrobe-overlay");};
$("pause-open").onclick=()=>openOverlay("pause-overlay");
$("resume").onclick=()=>closeOverlay("pause-overlay");
$("mobile-interact").onclick=interact;
$("reset-save").onclick=()=>{
  if(confirm("Start a brand new journey? Your saved stories and keepsakes will be cleared.")){
    localStorage.removeItem("morrowvale-save");location.reload();
  }
};

function renderJournal(tab="stories"){
  document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  const body=$("journal-body");body.replaceChildren();
  if(tab==="stories"){
    QUESTS.forEach(q=>{
      const s=questState(q.id),row=document.createElement("div");row.className="journal-entry";
      const icon=document.createElement("div");icon.className="journal-entry-icon";icon.textContent=s.status==="complete"?"✓":s.status==="ready"?"✦":"✉";
      const copy=document.createElement("div"),title=document.createElement("strong"),desc=document.createElement("p");
      title.textContent=q.title;desc.textContent=s.status==="complete"?q.lore:s.status==="available"?q.description:q.shortObjective+" "+(q.amount?s.progress+" / "+q.amount+" found.":"");
      copy.append(title,desc);const status=document.createElement("span");status.className="entry-status";status.textContent=s.status==="complete"?"COMPLETE":s.status==="ready"?"RETURN":s.status==="active"?"IN PROGRESS":"WAITING";
      row.append(icon,copy,status);body.append(row);
    });
  }else if(tab==="people"){
    NPC_DATA.forEach(n=>{
      const row=document.createElement("div");row.className="journal-entry";
      const icon=document.createElement("div");icon.className="journal-entry-icon";icon.textContent=n.portrait;
      const copy=document.createElement("div"),title=document.createElement("strong"),desc=document.createElement("p");
      title.textContent=n.name;desc.textContent=n.role+" · "+(discovered.has(n.region)?"Somewhere on the island":"A resident you have yet to meet");
      copy.append(title,desc);row.append(icon,copy);body.append(row);
    });
  }else{
    if(!foundKeepsakes.size&&!inventory.size){const p=document.createElement("p");p.className="journal-entry";p.textContent="Your pockets are still light. The island has hidden small treasures along the shore and beneath the trees.";body.append(p);}
    for(const k of KEEPSAKES.filter(x=>foundKeepsakes.has(x.id))){
      const row=document.createElement("div");row.className="journal-entry";const icon=document.createElement("div");icon.className="journal-entry-icon";icon.textContent="✦";
      const copy=document.createElement("div"),title=document.createElement("strong"),desc=document.createElement("p");title.textContent=k.name;desc.textContent=k.note;copy.append(title,desc);row.append(icon,copy);body.append(row);
    }
    inventory.forEach((count,name)=>{const row=document.createElement("div");row.className="journal-entry";const icon=document.createElement("div");icon.className="journal-entry-icon";icon.textContent="◇";const copy=document.createElement("div"),title=document.createElement("strong"),desc=document.createElement("p");title.textContent=name;desc.textContent="In your satchel · "+count;copy.append(title,desc);row.append(icon,copy);body.append(row);});
  }
  $("journal-count").textContent=QUESTS.filter(q=>questState(q.id).status==="complete").length+" / "+QUESTS.length+" STORIES FOUND";
}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>renderJournal(b.dataset.tab)));
function buildRegionStrip(){
  $("region-strip").replaceChildren();
  REGIONS.forEach(r=>{
    const b=document.createElement("button");b.className="region-chip";b.innerHTML="<span></span>";
    const title=document.createElement("span");title.textContent=r.name;const note=document.createElement("small");note.textContent=discovered.has(r.id)?r.tag:"NOT YET DISCOVERED";b.replaceChildren(title,note);
    b.addEventListener("click",()=>{showToast(r.description);});$("region-strip").append(b);
  });
}
function mapPosition(ctx,x,z,w,h){return {x:(x+160)/320*w,y:(z+145)/290*h};}
function drawMapTo(canvas,minimal=false){
  const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
  ctx.fillStyle="#d3e2dc";ctx.fillRect(0,0,w,h);
  ctx.save();ctx.translate(w/2,h/2);ctx.scale(w/760,h/540);
  ctx.fillStyle="#8ab5b1";ctx.beginPath();ctx.ellipse(0,0,335,248,0,0,Math.PI*2);ctx.fill();
  const points=[];for(let i=0;i<130;i++){const a=i/130*Math.PI*2,r=1+.018*Math.sin(i*.69)+.012*Math.cos(i*.31);points.push([Math.cos(a)*310*r,Math.sin(a)*228*r]);}
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
  const grad=ctx.createLinearGradient(-230,-190,210,190);grad.addColorStop(0,"#b5c69e");grad.addColorStop(.46,"#8fae83");grad.addColorStop(1,"#819c80");ctx.fillStyle=grad;ctx.fill();
  ctx.strokeStyle="#f4e9cf";ctx.lineWidth=7;ctx.stroke();
  ctx.strokeStyle="#dfd1ac";ctx.lineWidth=8;ctx.lineCap="round";ctx.beginPath();
  [[-5,5],[-30,16],[-55,39],[-73,49]].forEach(([x,z],i)=>{const p=mapPosition(ctx,x,z,760,540);if(!i)ctx.moveTo(p.x-380,p.y-270);else ctx.lineTo(p.x-380,p.y-270);});ctx.stroke();
  ctx.strokeStyle="#78aaa9";ctx.lineWidth=11;ctx.beginPath();[[-111,5],[-82,10],[-60,18],[-38,35],[-18,44],[7,44],[28,38],[45,28]].forEach(([x,z],i)=>{const p=mapPosition(ctx,x,z,760,540);if(!i)ctx.moveTo(p.x-380,p.y-270);else ctx.lineTo(p.x-380,p.y-270);});ctx.stroke();
  REGIONS.forEach(r=>{
    const p=mapPosition(ctx,r.x,r.z,760,540),x=p.x-380,y=p.y-270;
    ctx.fillStyle=discovered.has(r.id)?"#f2e9d4":"#b5c5a8";ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#627f66";ctx.lineWidth=1.3;ctx.stroke();
    if(!minimal){ctx.fillStyle="#536c56";ctx.font="700 9px Manrope";ctx.textAlign="center";ctx.fillText(discovered.has(r.id)?r.short:"?",x,y-12);}
  });
  const me=mapPosition(ctx,player.x,player.z,760,540),mx=me.x-380,my=me.y-270;
  ctx.fillStyle="#9b674e";ctx.beginPath();ctx.arc(mx,my,8,0,Math.PI*2);ctx.fill();ctx.strokeStyle="#fff9e9";ctx.lineWidth=2;ctx.stroke();
  if(!minimal){ctx.fillStyle="#715c4d";ctx.font="700 8px Manrope";ctx.textAlign="left";ctx.fillText("YOU",mx+11,my+3);}
  ctx.restore();
}
function drawWorldMap(){drawMapTo($("world-map"),false);}
function drawMiniMap(){drawMapTo($("minimap"),true);}
function renderWardrobe(){
  $("name-field").value=player.name;$("wardrobe-name-preview").textContent="A traveller with no particular hurry.";
  const avatars=[["person-male-a","THE QUIET ONE"],["person-female-a","THE WAYFINDER"],["person-male-b","THE STORYKEEPER"],["person-female-c","THE WILD HEART"]];
  const choices=$("avatar-choices");choices.replaceChildren();
  avatars.forEach(([id,label])=>{const b=document.createElement("button");b.className="avatar-choice"+(player.avatar===id?" active":"");b.textContent=label;b.onclick=()=>{document.querySelectorAll(".avatar-choice").forEach(x=>x.classList.remove("active"));b.classList.add("active");setAvatar(id);};choices.append(b);});
  const colours=["#819a78","#c28d78","#7897a5","#c1a56f","#9385a7"],values=[0,-.08,.04,.1,-.04];const box=$("colour-choices");box.replaceChildren();
  colours.forEach((c,i)=>{const b=document.createElement("button");b.className="colour-choice"+(player.tint===values[i]?" active":"");b.style.background=c;b.onclick=()=>{player.tint=values[i];setAvatar(player.avatar);renderWardrobe();};box.append(b);});
}
$("save-wardrobe").onclick=()=>{player.name=$("name-field").value.trim()||"Wanderer";updatePlayerHUD();closeOverlay("wardrobe-overlay");saveGame(true);showToast("A new look for another little journey.");};

function updateInteraction(){
  interaction=closestInteraction();
  const prompt=$("interaction-prompt");
  if(!started||paused||!interaction){prompt.classList.remove("visible");return;}
  const names={npc:"Speak with "+interaction.entity.name,pickup:"Gather "+interaction.entity.label,keepsake:"Pick up "+interaction.entity.name,pet:"Call the little cat"};
  $("interaction-text").textContent=names[interaction.type]||"Interact";prompt.classList.add("visible");
}
function updatePetFollow(dt){
  if(!catRecovered)return;const pet=world.pets.get("cat");if(!pet)return;
  const x=player.x+Math.sin(player.yaw)*1.5,z=player.z+Math.cos(player.yaw)*1.5;
  pet.model.position.x+=(x-pet.model.position.x)*Math.min(1,dt*1.7);
  pet.model.position.z+=(z-pet.model.position.z)*Math.min(1,dt*1.7);
  pet.model.position.y=world.heightAt(pet.model.position.x,pet.model.position.z);
}
function collision(x,z){
  if(!world.onLand(x,z))return true;
  for(const o of world.obstacles)if(Math.hypot(x-o.x,z-o.z)<o.r+0.8)return true;
  return false;
}
function movePlayer(dt){
  let f=(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0)-joystick.y;
  let s=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0)+joystick.x;
  const length=Math.hypot(f,s);
  if(length>.08){
    f/=Math.max(1,length);s/=Math.max(1,length);
    const forward=new THREE.Vector3(Math.sin(cameraYaw),0,-Math.cos(cameraYaw));
    const right=new THREE.Vector3(Math.cos(cameraYaw),0,Math.sin(cameraYaw));
    const dir=forward.multiplyScalar(f).add(right.multiplyScalar(s)).normalize();
    const speed=keys.shift?12.2:8.2,step=speed*dt;
    const nx=player.x+dir.x*step,nz=player.z+dir.z*step;
    if(!collision(nx,nz)){player.x=nx;player.z=nz;}
    player.yaw=Math.atan2(dir.x,dir.z);player.speed=speed;walkClock+=dt*10;
    playerActor.position.y=world.heightAt(player.x,player.z)+Math.abs(Math.sin(walkClock))*.08;
    playerActor.rotation.y=player.yaw;
    if(playerModel)playerModel.position.y=Math.sin(walkClock)*.035;
  }else{
    player.speed=0;playerActor.position.y=world.heightAt(player.x,player.z);
    if(playerModel)playerModel.position.y+=(0-playerModel.position.y)*Math.min(1,dt*8);
  }
  playerActor.position.x=player.x;playerActor.position.z=player.z;
}
const desiredCamera=new THREE.Vector3(),lookAt=new THREE.Vector3();
function updateCamera(dt){
  const distance=10.8;
  const horizontal=Math.cos(cameraPitch)*distance;
  desiredCamera.set(player.x+Math.sin(cameraYaw)*horizontal,world.heightAt(player.x,player.z)+2.3+Math.sin(cameraPitch)*distance,player.z+Math.cos(cameraYaw)*horizontal);
  const targetY=world.heightAt(player.x,player.z)+1.4;
  lookAt.set(player.x,targetY,player.z);
  camera.position.lerp(desiredCamera,1-Math.exp(-dt*4.4));camera.lookAt(lookAt);
}
function animateDay(dt){
  dayTime=(dayTime+dt/950)*1%1;
  const morning=.25,phase=Math.sin((dayTime-.08)*Math.PI*2);
  const warm=clamp((phase+.1)*.55+.5,.35,1);
  sun.intensity=1.65+warm*.9;hemi.intensity=1.35+warm*.45;
  sun.position.set(-75+Math.cos(dayTime*Math.PI*2)*40,90+phase*18,55);
  if(dayTime<.33)$("day-label").textContent="EARLY MORNING";
  else if(dayTime<.66)$("day-label").textContent="LATE MORNING";
  else $("day-label").textContent="GOLDEN AFTERNOON";
}
function updateLocationAndDiscovery(){
  const before=discovered.size;let best=REGIONS[0],bd=Infinity;
  REGIONS.forEach(r=>{const d=dist(player,r);if(d<bd){bd=d;best=r;}});
  if(bd<52){discovered.add(best.id);$("location-name").textContent=best.name;$("header-region").textContent=best.short;}
  if(discovered.size!==before){buildRegionStrip();saveGame(true);}
}
function loop(){
  requestAnimationFrame(loop);
  const dt=Math.min(.04,clock.getDelta());worldTime+=dt;
  if(started&&!paused&&!modalOpen){
    movePlayer(dt);updateCamera(dt);updateInteraction();updateLocationAndDiscovery();updatePetFollow(dt);
    if(worldTime-lastSave>16)saveGame();
  }
  world.update(dt,worldTime);animateDay(dt);drawMiniMap();
  renderer.render(scene,camera);
  if(previewRenderer&&previewScene){if(previewActor)previewActor.rotation.y=worldTime*.35;previewRenderer.render(previewScene,previewCamera);}
}
const clock=new THREE.Clock();

function setupInput(){
  window.addEventListener("keydown",e=>{
    const key=e.key.toLowerCase();keys[key]=true;
    if(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(key))e.preventDefault();
    if(key==="e")interact();
    if(key==="m"&&started){drawWorldMap();openOverlay("map-overlay");}
    if(key==="j"&&started)openJournal();
    if(key==="escape"&&started){if(modalOpen){document.querySelectorAll(".overlay.open").forEach(x=>closeOverlay(x.id));}else openOverlay("pause-overlay");}
  });
  window.addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
  let dragging=false,lastX=0,lastY=0;
  renderer.domElement.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
  renderer.domElement.addEventListener("pointermove",e=>{
    if(!dragging)return;cameraYaw-=(e.clientX-lastX)*.004;cameraPitch=clamp(cameraPitch+(e.clientY-lastY)*.0026,-.08,.52);lastX=e.clientX;lastY=e.clientY;
  });
  renderer.domElement.addEventListener("pointerup",()=>dragging=false);
  renderer.domElement.addEventListener("pointercancel",()=>dragging=false);
  const area=$("joystick"),knob=$("joystick-knob");
  function moveStick(e){
    const r=area.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,l=Math.hypot(x,y),m=34;
    const nx=l>m?x/l*m:x,ny=l>m?y/l*m:y;joystick.x=nx/m;joystick.y=ny/m;knob.style.transform="translate("+nx+"px,"+ny+"px)";
  }
  function endStick(){joystick.active=false;joystick.x=0;joystick.y=0;knob.style.transform="translate(0,0)";}
  area.addEventListener("pointerdown",e=>{joystick.active=true;area.setPointerCapture(e.pointerId);moveStick(e);});
  area.addEventListener("pointermove",e=>{if(joystick.active)moveStick(e);});
  area.addEventListener("pointerup",endStick);area.addEventListener("pointercancel",endStick);
  window.addEventListener("resize",()=>{
    camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));
    if(previewRenderer)previewRenderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  });
}
setupInput();
