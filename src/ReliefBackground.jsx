import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
varying float vHeight;
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
void main(){vUv=uv;float h=relief(uv)*.58;vHeight=h;vec3 p=position;p.z+=h;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vHeight;
uniform vec2 uResolution;
uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
void main(){
 vec2 uv=vUv;
 float h=vHeight;
 vec3 normal=normalize(vec3(-dFdx(vHeight)*260.,-dFdy(vHeight)*260.,1.));
 // Organic vertical wavefront: the relief grows upward, then softly dissolves.
 float cycle=mod(uTime*.09,1.65)-.18;
 float warp=(fbm(uv*vec2(8.,13.)+vec2(0.,uTime*.10))-.5)*.20;
 float front=cycle+warp;
 float behind=uv.y-front;
 float folds=sin(uv.x*13.+uv.y*8.+uTime*.42)*.018
             +sin(uv.x*27.-uv.y*5.-uTime*.27)*.009;
 float distanceField=behind+folds+(fbm(uv*vec2(23.,31.)+vec2(0.,uTime*.16))-.5)*.055;
 float reveal=(1.-smoothstep(-.025,.075,distanceField))
             *(1.-smoothstep(1.12,1.42,cycle));
 float burnEdge=1.-smoothstep(.008,.065,abs(distanceField));
 vec3 lightDirection=normalize(vec3(-.62,.72,.58));
 float diffuse=max(dot(normal,lightDirection),0.);
 float grazing=pow(1.-max(dot(normal,lightDirection),0.),4.);
 vec3 halfVector=normalize(lightDirection+vec3(0.,0.,1.));
 float specular=pow(max(dot(normal,halfVector),0.),34.);
 float cavity=smoothstep(.018,.16,h);
 float reliefShade=clamp(.012+diffuse*.22+grazing*.12+specular*.24+cavity*.065,0.,.38);
 float fineEdge=pow(max(0.,1.-abs(h)*8.),3.)*.055;
 float ember=burnEdge*reveal*.075;
 vec3 stone=vec3((reliefShade+fineEdge)*reveal+ember);
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
  const uniforms={uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)},uTime:{value:0}};
  const geometry=new THREE.PlaneGeometry(2,2,256,256),material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms});
  scene.add(new THREE.Mesh(geometry,material));
  let frame=null;
  const clock=new THREE.Clock();
  const render=()=>{
   uniforms.uTime.value=clock.elapsedTime;
   renderer.render(scene,camera);
   frame=requestAnimationFrame(render);
  };
  render();
  const resize=()=>{
   renderer.setSize(innerWidth,innerHeight);
   uniforms.uResolution.value.set(innerWidth,innerHeight);
   if(frame===null) frame=requestAnimationFrame(render);
  };
  addEventListener("resize",resize);
  renderer.render(scene,camera);
  return()=>{cancelAnimationFrame(frame);removeEventListener("resize",resize);geometry.dispose();material.dispose();renderer.dispose();if(renderer.domElement.parentNode===el)el.removeChild(renderer.domElement);};
 },[]);
 return <div className="relief-background" ref={host} aria-hidden="true"/>;
}
