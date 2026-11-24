import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ASSET_NAMES, REGIONS, NPC_DATA, PICKUPS, KEEPSAKES, MODEL_URL } from "./data.js";

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smoothstep=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const seeded=(seed)=>()=>{let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};

export class World {
  constructor(scene,onProgress=()=>{}) {
    this.scene=scene;this.onProgress=onProgress;this.models=new Map();this.npcs=new Map();this.pets=new Map();
    this.pickups=[];this.keepsakes=[];this.clouds=[];this.windObjects=[];this.clock=0;this.seed=seeded(804219);
    this.obstacles=[];this.regionLabels=[];this.ocean=null;
  }
  async loadAssets() {
    const loader=new GLTFLoader();let loaded=0;
    const results=await Promise.allSettled(ASSET_NAMES.map(async name=>{
      const gltf=await loader.loadAsync(MODEL_URL(name));
      this.models.set(name,gltf.scene);loaded++;this.onProgress(loaded/ASSET_NAMES.length,name);return name;
    }));
    const failed=results.filter(x=>x.status==="rejected");
    this.onProgress(1,failed.length?failed.length+" models unavailable":"World assets ready");
    return {loaded:this.models.size,failed:failed.length};
  }
  heightAt(x,z) {
    const d=Math.sqrt((x/150)**2+(z/136)**2);
    const island=1-smoothstep(.82,1.015,d);
    const hills=
      5.2*Math.exp(-(((x-16)/34)**2+((z+106)/26)**2))+
      3.2*Math.exp(-(((x+105)/26)**2+((z+50)/25)**2))+
      2.4*Math.exp(-(((x-62)/30)**2+((z+68)/34)**2));
    const rolling=(Math.sin(x*.047+z*.021)*.9+Math.cos(z*.052-x*.018)*.72+Math.sin((x+z)*.09)*.3)*island;
    return -1.65+island*7.1+hills*island+rolling;
  }
  onLand(x,z) {
    return Math.sqrt((x/150)**2+(z/136)**2)<.975 && this.heightAt(x,z)>.02;
  }
  build() {
    this.buildOcean();this.buildTerrain();this.buildPaths();this.buildLandmarks();this.buildNature();this.buildPeople();this.buildKeepsakes();
    this.buildRegionSigns();
  }
  buildOcean() {
    const geo=new THREE.PlaneGeometry(1200,1200,1,1);geo.rotateX(-Math.PI/2);
    const mat=new THREE.MeshStandardMaterial({color:0x79a9a7,roughness:.24,metalness:.08,transparent:true,opacity:.96});
    this.ocean=new THREE.Mesh(geo,mat);this.ocean.position.y=-.28;this.ocean.receiveShadow=true;this.scene.add(this.ocean);
    const seabed=new THREE.Mesh(new THREE.PlaneGeometry(1200,1200),new THREE.MeshBasicMaterial({color:0x6f9991}));
    seabed.rotation.x=-Math.PI/2;seabed.position.y=-2;this.scene.add(seabed);
    const horizon=new THREE.Mesh(new THREE.SphereGeometry(650,36,20),new THREE.MeshBasicMaterial({color:0xc6d9d1,side:THREE.BackSide}));
    horizon.position.y=30;this.scene.add(horizon);
    const cloudMat=new THREE.MeshStandardMaterial({color:0xf5f3e8,roughness:1,transparent:true,opacity:.72});
    for(let i=0;i<13;i++){
      const cloud=new THREE.Group(),count=3+Math.floor(this.seed()*4);
      for(let j=0;j<count;j++){const puff=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1+this.seed()*2.2,1),cloudMat);puff.position.set((this.seed()-.5)*8,(this.seed()-.5)*1.3,(this.seed()-.5)*3);cloud.add(puff);}
      cloud.position.set((this.seed()-.5)*360,28+this.seed()*18,(this.seed()-.5)*300);cloud.scale.setScalar(.8+this.seed()*.8);this.scene.add(cloud);this.clouds.push(cloud);
    }
  }
  buildTerrain() {
    const nx=190,nz=174,w=320,d=292,positions=[],colors=[],indices=[];
    const low=new THREE.Color(0x8ea981),meadow=new THREE.Color(0xa6bb89),forest=new THREE.Color(0x789879),high=new THREE.Color(0x9b9e8c),shore=new THREE.Color(0xcbbd96);
    for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){
      const x=-w/2+w*ix/nx,z=-d/2+d*iz/nz,y=this.heightAt(x,z);
      positions.push(x,y,z);
      const radial=Math.sqrt((x/150)**2+(z/136)**2),noise=(Math.sin(x*.08)*Math.cos(z*.06)+1)*.025;
      let c=low.clone();
      if(x<-30&&z>5)c.lerp(meadow,.48);
      if(x>15&&z<-20)c.lerp(forest,.54);
      if(y>8)c.lerp(high,clamp((y-8)/8,0,.8));
      if(radial>.85)c.lerp(shore,smoothstep(.84,.97,radial));
      c.offsetHSL(0,0,noise-.014);colors.push(c.r,c.g,c.b);
      if(ix<nx&&iz<nz){const a=iz*(nx+1)+ix,b=a+1,c1=a+nx+1,d1=c1+1;indices.push(a,c1,b,b,c1,d1);}
    }
    const geo=new THREE.BufferGeometry();geo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geo.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();
    const mat=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0});const ground=new THREE.Mesh(geo,mat);ground.receiveShadow=true;ground.castShadow=false;this.scene.add(ground);this.terrain=ground;
    const shoreRing=new THREE.Mesh(new THREE.TorusGeometry(144,1.15,5,180),new THREE.MeshStandardMaterial({color:0xe4ddc3,roughness:1,transparent:true,opacity:.6}));
    shoreRing.rotation.x=Math.PI/2;shoreRing.scale.set(1,.91,1);shoreRing.position.y=.05;this.scene.add(shoreRing);
  }
  point(x,z,lift=.08){return new THREE.Vector3(x,this.heightAt(x,z)+lift,z);}
  makePath(points,radius=.72,color=0xd9c9a1,opacity=1){
    const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>this.point(x,z,.13)),false,"catmullrom",.24);
    const geo=new THREE.TubeGeometry(curve,Math.max(36,points.length*22),radius,7,false);
    const mat=new THREE.MeshStandardMaterial({color,roughness:1,transparent:opacity<1,opacity});const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;this.scene.add(mesh);return mesh;
  }
  buildPaths(){
    this.makePath([[-5,5],[-30,16],[-55,39],[-73,50]],.78,0xd9c89e);
    this.makePath([[-2,6],[30,10],[62,22],[92,33]],.85,0xd5c69c);
    this.makePath([[0,0],[22,-29],[43,-53],[58,-75]],.9,0xd6c69d);
    this.makePath([[0,-4],[13,-48],[16,-82],[15,-111]],.8,0xd1c19a);
    this.makePath([[-8,-2],[-50,-20],[-82,-40],[-108,-52]],.78,0xd7c79f);
    this.makePath([[-71,48],[-43,31],[-20,22],[-4,5],[28,4],[62,12],[93,34]],.48,0xe2d3af,.9);
    const river=new THREE.CatmullRomCurve3([[-111,5],[-82,10],[-60,18],[-38,35],[-18,44],[7,44],[28,38],[45,28]].map(([x,z])=>this.point(x,z,.04)));
    const riverGeo=new THREE.TubeGeometry(river,130,2.15,9,false);
    const riverMat=new THREE.MeshPhysicalMaterial({color:0x77aaa9,roughness:.2,metalness:.08,clearcoat:.5,transparent:true,opacity:.93});
    const riverMesh=new THREE.Mesh(riverGeo,riverMat);this.scene.add(riverMesh);
    const bridge=this.placeModel("bridge-wood",-24,42,4.8,Math.PI/2);if(bridge)bridge.position.y=this.heightAt(-24,42)+.2;
  }
  placeModel(name,x,z,height=5,rotation=0,options={}) {
    const source=this.models.get(name);if(!source)return null;
    const root=new THREE.Group(),model=source.clone(true);model.updateMatrixWorld(true);
    const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());
    const factor=height/Math.max(size.y,.01);model.scale.multiplyScalar(factor);model.position.y-=bounds.min.y*factor;
    model.traverse(obj=>{if(obj.isMesh){obj.castShadow=options.castShadow!==false;obj.receiveShadow=true;obj.frustumCulled=true;if(obj.material){obj.material.side=THREE.FrontSide;}}});
    root.add(model);root.position.set(x,this.heightAt(x,z)+(options.lift||0),z);root.rotation.y=rotation;root.userData.model=name;this.scene.add(root);
    if(options.solid)this.obstacles.push({x,z,r:options.radius||2.2});
    if(options.wind)this.windObjects.push({root,phase:this.seed()*Math.PI*2,amount:options.wind});
    return root;
  }
  addLantern(x,z){
    const g=new THREE.Group(),post=new THREE.Mesh(new THREE.CylinderGeometry(.08,.13,2.35,7),new THREE.MeshStandardMaterial({color:0x7e7056,roughness:1}));post.position.y=1.15;g.add(post);
    const glass=new THREE.Mesh(new THREE.SphereGeometry(.29,10,8),new THREE.MeshBasicMaterial({color:0xf4d89a}));glass.position.y=2.38;g.add(glass);
    const light=new THREE.PointLight(0xffd99b,.55,9);light.position.y=2.4;g.add(light);g.position.set(x,this.heightAt(x,z),z);this.scene.add(g);
  }
  addPlazaDetails(){
    const matStone=new THREE.MeshStandardMaterial({color:0xbeb79f,roughness:1}),matWater=new THREE.MeshStandardMaterial({color:0x86b4b0,roughness:.25});
    const fountain=new THREE.Group(),base=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.5,.5,12),matStone);base.position.y=.25;fountain.add(base);
    const basin=new THREE.Mesh(new THREE.CylinderGeometry(2.8,2.8,.24,16),matWater);basin.position.y=.55;fountain.add(basin);
    const column=new THREE.Mesh(new THREE.CylinderGeometry(.38,.54,1.7,8),matStone);column.position.y=1.3;fountain.add(column);
    const orb=new THREE.Mesh(new THREE.SphereGeometry(.48,12,10),matWater);orb.position.y=2.28;fountain.add(orb);fountain.position.set(0,this.heightAt(0,0),0);this.scene.add(fountain);
    for(const [x,z] of [[-20,-8],[20,-9],[-22,16],[20,18],[-12,27],[12,28]])this.addLantern(x,z);
    for(const [x,z] of [[-18,4],[18,4],[-15,-16],[15,-16]])this.placeModel("planter",x,z,1.5,this.seed()*6);
    this.placeModel("house-a",-15,9,8,-.4,{solid:true,radius:4});
    this.placeModel("house-b",15,12,9,.55,{solid:true,radius:4});
    this.placeModel("house-f",-20,-13,8,.9,{solid:true,radius:4});
    this.placeModel("house-j",18,-14,8,-.8,{solid:true,radius:4});
    this.placeModel("house-m",-4,28,8,.1,{solid:true,radius:4});
    this.placeModel("house-a",27,25,7,2.1,{solid:true,radius:3});
    this.placeModel("house-f",-31,26,7,-1.7,{solid:true,radius:3});
    this.placeModel("house-j",31,-24,7,.4,{solid:true,radius:3});
    this.placeModel("house-b",-32,-25,7,2.8,{solid:true,radius:3});
    this.placeModel("house-m",2,-30,7,Math.PI,{solid:true,radius:3});
    this.placeModel("house-a",-5,-42,7,Math.PI/2,{solid:true,radius:3});
  }
  buildLandmarks(){
    this.addPlazaDetails();
    this.placeModel("dock",101,34,7,Math.PI/2);
    this.placeModel("ship",115,41,8,-.3);
    this.placeModel("ship",89,55,6,.7);
    this.placeModel("lighthouse",108,16,16,-.1,{solid:true,radius:4});
    this.placeModel("tent",56,-49,4.4,-.6);
    this.placeModel("campfire",51,-55,1.2,0);
    this.placeModel("house-b",69,-81,7,1.1,{solid:true,radius:4});
    this.placeModel("house-m",-98,-55,7,.2,{solid:true,radius:4});
    this.placeModel("house-f",-115,-68,6,-1.2,{solid:true,radius:3});
    this.placeModel("house-a",-118,-34,6,1.8,{solid:true,radius:3});
    this.placeModel("lighthouse",-105,-50,10,0);
    for(let i=0;i<7;i++){
      const a=i*Math.PI*2/7,x=-106+Math.cos(a)*13,z=-52+Math.sin(a)*13;
      const pillar=new THREE.Group(),stone=new THREE.Mesh(new THREE.CylinderGeometry(.65,.85,5.3,7),new THREE.MeshStandardMaterial({color:0x999788,roughness:1}));stone.position.y=2.65;pillar.add(stone);
      const cap=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.4,7),new THREE.MeshStandardMaterial({color:0xb8b29f,roughness:1}));cap.position.y=5.35;pillar.add(cap);pillar.position.set(x,this.heightAt(x,z),z);pillar.rotation.z=(i%2?-.12:.12);this.scene.add(pillar);
    }
    const observatory=new THREE.Group(),dome=new THREE.Mesh(new THREE.SphereGeometry(5,16,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x8f9b85,roughness:.8}));dome.position.y=8;observatory.add(dome);
    const tower=new THREE.Mesh(new THREE.CylinderGeometry(4,4,8,12),new THREE.MeshStandardMaterial({color:0xc4b99e,roughness:1}));tower.position.y=4;observatory.add(tower);
    const slit=new THREE.Mesh(new THREE.BoxGeometry(1.2,5,.2),new THREE.MeshStandardMaterial({color:0x59695a}));slit.position.set(0,8.3,4.1);observatory.add(slit);observatory.position.set(-105,this.heightAt(-105,-52),-80);this.scene.add(observatory);
  }
  buildNature(){
    const rnd=this.seed;
    for(let i=0;i<60;i++){
      const x=18+rnd()*84,z=-110+rnd()*78;if(!this.onLand(x,z))continue;
      const name=rnd()>.58?"tree-pine":rnd()>.5?"tree-tall-pine":"tree-oak";
      this.placeModel(name,x,z,7+rnd()*4,rnd()*Math.PI*2,{wind:.014});
    }
    for(let i=0;i<54;i++){
      const x=47+(rnd()-.5)*96,z=-78+(rnd()-.5)*82;if(!this.onLand(x,z))continue;
      if(Math.abs(x-69)<8&&Math.abs(z+80)<10)continue;
      this.placeModel(rnd()>.5?"tree-round":"tree-oak",x,z,5.8+rnd()*3.2,rnd()*Math.PI*2,{wind:.01});
    }
    for(let i=0;i<50;i++){
      const x=-86+(rnd()-.5)*62,z=48+(rnd()-.5)*44;if(!this.onLand(x,z))continue;
      this.placeModel(["flower-purple","flower-red","flower-yellow"][Math.floor(rnd()*3)],x,z,.8+rnd()*.45,rnd()*Math.PI*2,{wind:.045});
    }
    for(let i=0;i<35;i++){
      const x=-83+(rnd()-.5)*70,z=42+(rnd()-.5)*54;if(!this.onLand(x,z))continue;
      this.placeModel("bush-detailed",x,z,1.3+rnd()*1.3,rnd()*Math.PI*2,{wind:.025});
    }
    for(let i=0;i<21;i++){
      const x=12+(rnd()-.5)*70,z=-112+(rnd()-.5)*35;if(!this.onLand(x,z))continue;
      this.placeModel("rock-large",x,z,1.8+rnd()*3.2,rnd()*Math.PI*2);
    }
    for(let i=0;i<28;i++){
      const x=55+(rnd()-.5)*94,z=-73+(rnd()-.5)*88;if(!this.onLand(x,z))continue;
      this.placeModel("bush-detailed",x,z,1.1+rnd()*.9,rnd()*Math.PI*2);
    }
    for(let i=0;i<14;i++){
      const x=-112+(rnd()-.5)*44,z=-52+(rnd()-.5)*38;if(!this.onLand(x,z))continue;
      this.placeModel("rock-large",x,z,2+rnd()*3,rnd()*Math.PI*2);
    }
    for(let i=0;i<16;i++){
      const x=-80+(rnd()-.5)*55,z=-6+(rnd()-.5)*36;if(!this.onLand(x,z))continue;
      this.placeModel("tree-round",x,z,4.5+rnd()*2.2,rnd()*Math.PI*2);
    }
    for(let i=0;i<13;i++){
      const x=82+(rnd()-.5)*58,z=32+(rnd()-.5)*48;if(!this.onLand(x,z))continue;
      this.placeModel("rock-large",x,z,1.2+rnd()*2,rnd()*Math.PI*2);
    }
    for(const [x,z] of [[-90,40],[-59,67],[-53,31],[45,-102],[82,-92],[33,-47]])this.placeModel("tree-tall-pine",x,z,8, rnd()*Math.PI*2,{wind:.018});
    const deer=this.placeModel("deer",82,-69,2.4,0),bunny=this.placeModel("bunny",-83,58,1,0),cat=this.placeModel("cat",24,-16,1.1,0);
    if(deer)this.pets.set("deer",{id:"deer",model:deer,home:{x:82,z:-69},kind:"ambient",phase:1});
    if(bunny)this.pets.set("bunny",{id:"bunny",model:bunny,home:{x:-83,z:58},kind:"ambient",phase:2});
    if(cat)this.pets.set("cat",{id:"cat",model:cat,home:{x:24,z:-16},kind:"quest",phase:0});
  }
  buildPeople(){
    for(const data of NPC_DATA){
      const root=this.placeModel(data.asset,data.x,data.z,2.05,Math.PI, {lift:.025});
      if(!root)continue;root.userData.actor=data.id;
      const ring=new THREE.Mesh(new THREE.TorusGeometry(.47,.026,6,32),new THREE.MeshBasicMaterial({color:0xecd7a2,transparent:true,opacity:.55}));
      ring.rotation.x=-Math.PI/2;ring.position.y=.045;root.add(ring);
      const marker=new THREE.Group(),orb=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),new THREE.MeshBasicMaterial({color:0xf4d89b}));
      const halo=new THREE.Mesh(new THREE.TorusGeometry(.23,.014,5,24),new THREE.MeshBasicMaterial({color:0xf4d89b,transparent:true,opacity:.8}));halo.rotation.x=Math.PI/2;
      marker.add(orb,halo);marker.position.y=3.0;root.add(marker);
      this.npcs.set(data.id,{...data,root,marker,ring,baseY:this.heightAt(data.x,data.z),phase:this.seed()*6});
    }
  }
  addPickup(data,index) {
    const group=new THREE.Group(),colour={seed:0xb8cb8a,shard:0x9fd2cd,mushroom:0xd8a7a0,relic:0xd1b98c}[data.type]||0xe7d28f;
    const core=new THREE.Mesh(new THREE.OctahedronGeometry(data.type==="relic"?.48:.32,1),new THREE.MeshStandardMaterial({color:colour,emissive:colour,emissiveIntensity:.24,metalness:.18,roughness:.28}));
    core.position.y=.72;group.add(core);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.55,.022,6,28),new THREE.MeshBasicMaterial({color:0xf4e5b6,transparent:true,opacity:.76}));ring.rotation.x=Math.PI/2;ring.position.y=.35;group.add(ring);
    const halo=new THREE.PointLight(colour,.3,5);halo.position.y=.8;group.add(halo);
    group.position.set(data.x,this.heightAt(data.x,data.z),data.z);this.scene.add(group);
    this.pickups.push({...data,group,phase:index*.91,found:false});
  }
  buildPickups(){PICKUPS.forEach((p,i)=>this.addPickup(p,i));}
  buildKeepsakes(){
    KEEPSAKES.forEach((data,i)=>{
      const group=new THREE.Group(),gem=new THREE.Mesh(new THREE.DodecahedronGeometry(.31,0),new THREE.MeshStandardMaterial({color:0xf1d895,emissive:0x85672e,emissiveIntensity:.28,roughness:.3}));
      gem.position.y=.9;group.add(gem);const ring=new THREE.Mesh(new THREE.TorusGeometry(.47,.017,5,24),new THREE.MeshBasicMaterial({color:0xffe9b2,transparent:true,opacity:.8}));ring.rotation.x=Math.PI/2;ring.position.y=.55;group.add(ring);
      const light=new THREE.PointLight(0xf0d39a,.35,4);light.position.y=1;group.add(light);group.position.set(data.x,this.heightAt(data.x,data.z),data.z);this.scene.add(group);
      this.keepsakes.push({...data,group,phase:i*.8,found:false});
    });
  }
  buildRegionSigns(){
    for(const region of REGIONS){
      const canvas=document.createElement("canvas");canvas.width=512;canvas.height=128;const ctx=canvas.getContext("2d");
      ctx.fillStyle="rgba(238,237,218,.9)";ctx.fillRect(0,0,512,128);ctx.strokeStyle="rgba(87,111,88,.55)";ctx.strokeRect(7,7,498,114);
      ctx.fillStyle="#526c54";ctx.font="700 25px sans-serif";ctx.textAlign="center";ctx.fillText(region.name.toUpperCase(),256,73);
      const texture=new THREE.CanvasTexture(canvas),sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));
      sprite.scale.set(8,2,1);sprite.position.set(region.x,this.heightAt(region.x,region.z)+9,region.z);this.scene.add(sprite);this.regionLabels.push(sprite);
    }
  }
  addQuestMarkers(){this.buildPickups();}
  update(dt,time) {
    this.clock=time;
    this.clouds.forEach((c,i)=>{c.position.x+=dt*(.32+(i%4)*.12);if(c.position.x>220)c.position.x=-220;});
    this.windObjects.forEach(o=>{o.root.rotation.z=Math.sin(time*.75+o.phase)*o.amount;});
    this.npcs.forEach(n=>{n.marker.position.y=3+Math.sin(time*2+n.phase)*.12;n.ring.material.opacity=.37+Math.sin(time*2)*.12;});
    this.pickups.forEach(p=>{if(!p.found){p.group.rotation.y+=dt*.45;p.group.position.y=this.heightAt(p.x,p.z)+Math.sin(time*2+p.phase)*.12;}});
    this.keepsakes.forEach(p=>{if(!p.found){p.group.rotation.y+=dt*.5;p.group.position.y=this.heightAt(p.x,p.z)+Math.sin(time*1.7+p.phase)*.16;}});
    this.pets.forEach(p=>{if(p.kind==="ambient"){const x=p.home.x+Math.sin(time*.28+p.phase)*2.1,z=p.home.z+Math.cos(time*.22+p.phase)*1.6;p.model.position.x=x;p.model.position.z=z;p.model.position.y=this.heightAt(x,z);p.model.rotation.y=Math.sin(time*.3+p.phase)*.3;}});
  }
  dispose(){}
}
