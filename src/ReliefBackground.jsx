import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
varying float vHeight;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
float flower(vec2 p, float scale, float phase){
 p*=scale;
 float r=length(p), a=atan(p.y,p.x)+phase;
 float petals=0.;
 for(int ring=0;ring<4;ring++){
  float k=float(ring);
  float count=5.+k*3.;
  float angle=6.2831853/count;
  float aa=mod(a+k*.47+3.1415926,angle)-angle*.5;
  float rr=r-(.10+k*.105);
  float petal=exp(-pow(aa/(angle*.39),2.)*1.8-pow(rr/.105,2.)*1.5);
  petals=max(petals,petal*(1.-k*.13));
 }
 float heart=exp(-r*r*95.);
 float folds=sin(a*18.+r*48.)*.012*exp(-r*3.);
 return petals*.19+heart*.13+folds;
}
float leaf(vec2 p,float angle,float size){
 float c=cos(angle),s=sin(angle);
 p=mat2(c,s,-s,c)*p;
 float body=exp(-pow(p.x/(size*.24),2.)*1.3-pow(p.y/size,2.)*2.2);
 float ridge=exp(-pow(p.x/(size*.055),2.)*1.2-pow(p.y/size,2.)*1.6);
 float veins=sin(p.y*115.)*exp(-abs(p.x)*20.-abs(p.y)*3.)*.018;
 return body*.16+ridge*.07+veins;
}
float relief(vec2 uv){
 vec2 p=(uv-.5)*vec2(1.8,1.05);
 float h=fbm(p*13.)*.012+fbm(p*31.)*.004;
 // A sculpted botanical arrangement: three layered roses, curling stems and embossed leaves.
 h+=flower(p-vec2(-.43,.08),1.55,.2);
 h+=flower(p-vec2(.02,-.22),1.18,1.1)*.88;
 h+=flower(p-vec2(.48,.23),1.38,2.2)*.82;
 float stem1=abs(p.y-(.23*sin(p.x*3.4)-.12));
 float stem2=abs(p.y-(-.20*sin(p.x*3.1+.8)+.16));
 float stems=(1.-smoothstep(.012,.035,stem1))*.095+(1.-smoothstep(.009,.029,stem2))*.075;
 h+=stems;
 h+=leaf(p-vec2(-.60,-.18),-.55,.20);
 h+=leaf(p-vec2(-.18,.30),.75,.19);
 h+=leaf(p-vec2(.23,.28),-.8,.22);
 h+=leaf(p-vec2(.62,-.08),2.4,.19);
 h+=leaf(p-vec2(.08,-.42),2.0,.16);
 // Fine chisel marks and recessed channels give the surface a carved, not printed, finish.
 float grain=fbm(p*78.)-.5;
 h+=grain*.006;
 return h;
}
float cloth(vec2 uv){
 vec2 aspect=vec2(1.75,1.);
 vec2 d=(uv-uPointer)*aspect;
 float speed=clamp(length(uVelocity)*18.,0.,1.);
 float radius=length(d);
 float influence=exp(-radius*radius*34.);
 float wake=exp(-length(d+uVelocity*vec2(1.75,1.)*.10)*18.)*speed;
 float turbulence=fbm(uv*vec2(34.,22.)+uTime*.12);
 float ripple=sin(radius*72.-uTime*3.2+turbulence*5.)*exp(-radius*8.);
 float folds=sin((d.x+d.y*.7)*48.+turbulence*8.)*sin((d.y-d.x*.4)*31.);
 return (influence*(ripple*.018+folds*.009)+wake*folds*.018);
}
void main(){vUv=uv;float h=relief(uv)*.58+cloth(uv);vHeight=h;vec3 p=position;p.z+=h;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vHeight;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform vec2 uVelocity;
uniform float uTime;
uniform sampler2D uTrail;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
void main(){
 vec2 uv=vUv;
 float h=vHeight;
 vec3 normal=normalize(vec3(-dFdx(vHeight)*190.,-dFdy(vHeight)*190.,1.));
 vec4 trail=texture2D(uTrail,uv);
 float reveal=pow(clamp(trail.r,0.,1.),.72);
 vec3 lightDirection=normalize(vec3(-.62,.72,.58));
 float diffuse=max(dot(normal,lightDirection),0.);
 float grazing=pow(1.-max(dot(normal,lightDirection),0.),4.);
 vec3 halfVector=normalize(lightDirection+vec3(0.,0.,1.));
 float specular=pow(max(dot(normal,halfVector),0.),34.);
 float cavity=smoothstep(.018,.16,h);
 float reliefShade=clamp(.006+diffuse*.085+grazing*.035+specular*.10+cavity*.025,0.,.18);
 float fineEdge=pow(max(0.,1.-abs(h)*8.),3.)*reveal*.12;
 vec3 stone=vec3(reliefShade*reveal+fineEdge);
 gl_FragColor=vec4(stone,1.);
}`;

export default function ReliefBackground(){
 const host=useRef(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});}
  catch{el.classList.add("relief-fallback");return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.25));
  renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);camera.position.z=2.5;
  const trailCanvas=document.createElement("canvas");
  trailCanvas.width=512;trailCanvas.height=512;
  const trailCtx=trailCanvas.getContext("2d");
  trailCtx.fillStyle="#000";trailCtx.fillRect(0,0,512,512);
  const trailTexture=new THREE.CanvasTexture(trailCanvas);
  trailTexture.minFilter=THREE.LinearFilter;trailTexture.magFilter=THREE.LinearFilter;
  const uniforms={uPointer:{value:new THREE.Vector2(.52,.58)},uVelocity:{value:new THREE.Vector2(0,0)},uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)},uTime:{value:0},uTrail:{value:trailTexture}};
  const geometry=new THREE.PlaneGeometry(2,2,256,256),material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms});
  scene.add(new THREE.Mesh(geometry,material));
  const target=new THREE.Vector2(.52,.58);
  let lastTrailPoint=null;
  let trailLife=0;
  let frame=null;
  const clock=new THREE.Clock();
  const render=()=>{
   frame=null;
   const before=uniforms.uPointer.value.clone();
   uniforms.uPointer.value.lerp(target,.085);
   const delta=uniforms.uPointer.value.clone().sub(before);
   uniforms.uVelocity.value.lerp(delta.multiplyScalar(60),.12);
   uniforms.uVelocity.value.multiplyScalar(.94);
   uniforms.uTime.value=clock.elapsedTime;
   trailCtx.globalCompositeOperation="source-over";
   trailCtx.fillStyle="rgba(0,0,0,0.045)";
   trailCtx.fillRect(0,0,512,512);
   const px=uniforms.uPointer.value.x*512;
   const py=(1-uniforms.uPointer.value.y)*512;
   if(lastTrailPoint){
    const dx=px-lastTrailPoint.x,dy=py-lastTrailPoint.y;
    const distance=Math.hypot(dx,dy);
    if(distance>.15){
     const angle=Math.atan2(dy,dx),speed=Math.min(1,distance/24);
     trailCtx.globalCompositeOperation="lighter";
     for(let i=0;i<4;i++){
      const offset=(i-1.5)*3.8;
      const ox=Math.cos(angle+Math.PI/2)*offset,oy=Math.sin(angle+Math.PI/2)*offset;
      trailCtx.beginPath();
      trailCtx.moveTo(lastTrailPoint.x+ox,lastTrailPoint.y+oy);
      trailCtx.quadraticCurveTo((lastTrailPoint.x+px)*.5+ox+Math.sin(clock.elapsedTime*2+i)*2,(lastTrailPoint.y+py)*.5+oy+Math.cos(clock.elapsedTime*2+i)*2,px+ox,py+oy);
      trailCtx.lineWidth=5+speed*8-i;
      trailCtx.lineCap="round";
      trailCtx.strokeStyle="rgba(255,255,255,"+(0.10+speed*.12)+")";
      trailCtx.shadowColor="rgba(255,255,255,.7)";
      trailCtx.shadowBlur=9+speed*7;
      trailCtx.stroke();
     }
     trailCtx.shadowBlur=0;
    }
   }
   lastTrailPoint={x:px,y:py};
   trailTexture.needsUpdate=true;
   renderer.render(scene,camera);
   const moving=uniforms.uPointer.value.distanceToSquared(target)>.0000005;
   const fading=uniforms.uVelocity.value.lengthSq()>.00000008;
   if(trailLife>0) trailLife--;
   if(moving||fading||trailLife>0) frame=requestAnimationFrame(render);
  };
  const move=e=>{
   target.set(e.clientX/innerWidth,1-e.clientY/innerHeight);
   trailLife=90;
   if(frame===null) frame=requestAnimationFrame(render);
  };
  const resize=()=>{
   renderer.setSize(innerWidth,innerHeight);
   uniforms.uResolution.value.set(innerWidth,innerHeight);
   if(frame===null) frame=requestAnimationFrame(render);
  };
  addEventListener("pointermove",move,{passive:true});
  addEventListener("resize",resize);
  renderer.render(scene,camera);
  return()=>{cancelAnimationFrame(frame);removeEventListener("pointermove",move);removeEventListener("resize",resize);geometry.dispose();material.dispose();trailTexture.dispose();renderer.dispose();if(renderer.domElement.parentNode===el)el.removeChild(renderer.domElement);};
 },[]);
 return <div className="relief-background" ref={host} aria-hidden="true"/>;
}
