import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
float relief(vec2 uv){
 vec2 p=(uv-.5)*vec2(1.7,1.);
 float stone=fbm(p*8.)*.13+fbm(p*23.)*.035;
 float veins=pow(max(0.,1.-abs(sin(p.x*19.+sin(p.y*8.)*1.8+fbm(p*5.)*4.))),22.);
 float branches=0.;
 for(int i=0;i<4;i++){float fi=float(i),x=p.x+(fi-1.5)*.34;float c=p.y-(.18*sin(x*4.2+fi*1.7)+(fi-1.5)*.12);float trunk=1.-smoothstep(.012,.042,abs(c));float a=1.-smoothstep(.009,.026,abs(c-(x-(fi-1.5)*.34)*.72));float b=1.-smoothstep(.009,.026,abs(c+(x-(fi-1.5)*.34)*.72));branches=max(branches,max(trunk,max(a,b))*(1.-smoothstep(0.,.95,abs(x))));}
 float leaves=smoothstep(.68,.96,sin(p.x*34.+sin(p.y*15.)*2.)*cos(p.y*27.))*(1.-smoothstep(.1,.95,abs(p.x)));
 return stone+veins*.022+branches*.20+leaves*.10;
}
float cloth(vec2 uv){
 vec2 delta=(uv-uPointer)*vec2(1.75,1.);
 float d=length(delta);
 float speed=clamp(length(uVelocity)*22.,0.,1.);
 vec2 direction=normalize(uVelocity+vec2(.00001));
 float trailing=dot(delta,direction);
 float fold=sin(d*48.-uTime*5.5+trailing*13.)*exp(-d*7.5);
 float crossFold=sin(trailing*24.-uTime*3.)*exp(-d*5.2);
 float drape=exp(-d*8.5)*.075;
 return drape+speed*(fold*.028+crossFold*.012);
}
void main(){vUv=uv;vec3 p=position;p.z+=(relief(uv)*.58+cloth(uv));gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform vec2 uVelocity;
uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+17.1;a*=.5;}return v;}
float relief(vec2 uv){
 vec2 p=(uv-.5)*vec2(1.7,1.);
 float stone=fbm(p*8.)*.13+fbm(p*23.)*.035;
 float veins=pow(max(0.,1.-abs(sin(p.x*19.+sin(p.y*8.)*1.8+fbm(p*5.)*4.))),22.);
 float branches=0.;
 for(int i=0;i<4;i++){float fi=float(i),x=p.x+(fi-1.5)*.34;float c=p.y-(.18*sin(x*4.2+fi*1.7)+(fi-1.5)*.12);float trunk=1.-smoothstep(.012,.042,abs(c));float a=1.-smoothstep(.009,.026,abs(c-(x-(fi-1.5)*.34)*.72));float b=1.-smoothstep(.009,.026,abs(c+(x-(fi-1.5)*.34)*.72));branches=max(branches,max(trunk,max(a,b))*(1.-smoothstep(0.,.95,abs(x))));}
 float leaves=smoothstep(.68,.96,sin(p.x*34.+sin(p.y*15.)*2.)*cos(p.y*27.))*(1.-smoothstep(.1,.95,abs(p.x)));
 return stone+veins*.022+branches*.20+leaves*.10;
}
float cloth(vec2 uv){
 vec2 delta=(uv-uPointer)*vec2(1.75,1.);
 float d=length(delta);
 float speed=clamp(length(uVelocity)*22.,0.,1.);
 vec2 direction=normalize(uVelocity+vec2(.00001));
 float trailing=dot(delta,direction);
 float fold=sin(d*48.-uTime*5.5+trailing*13.)*exp(-d*7.5);
 float crossFold=sin(trailing*24.-uTime*3.)*exp(-d*5.2);
 return exp(-d*8.5)*.075+speed*(fold*.028+crossFold*.012);
}
float surface(vec2 uv){return relief(uv)+cloth(uv);}
void main(){
 vec2 uv=vUv;
 vec2 delta=(uv-uPointer)*vec2(uResolution.x/uResolution.y,1.);
 float distanceToCursor=length(delta);
 float reveal=1.-smoothstep(.12,.40,distanceToCursor);
 float h=surface(uv);
 float hx=surface(uv+vec2(.0015,0.))-surface(uv-vec2(.0015,0.));
 float hy=surface(uv+vec2(0.,.0015))-surface(uv-vec2(0.,.0015));
 vec3 n=normalize(vec3(-hx*115.,-hy*115.,1.));
 vec2 lightDelta=delta+vec2(.035,-.045);
 vec3 light=normalize(vec3(-lightDelta*3.2,0.72));
 float diffuse=max(dot(n,light),0.);
 float facing=pow(max(n.z,0.),5.);
 float grazing=pow(1.-max(dot(n,light),0.),2.);
 float grain=noise(uv*uResolution*.9)*.035+fbm(uv*520.)*.055;
 float highlight=exp(-dot(lightDelta,lightDelta)*34.);
 float cavity=smoothstep(.015,.16,h);
 float stoneLight=(.035+diffuse*.16+grazing*.035+facing*.018+cavity*.025+highlight*.055);
 stoneLight-=grain*.42;
 vec3 stone=vec3(max(stoneLight,0.))*reveal;
 float edge=1.-smoothstep(.24,.35,distanceToCursor);
 stone+=vec3(.008,.008,.008)*edge*(1.-reveal*.4);
 gl_FragColor=vec4(stone,1.);
}
`;

export default function ReliefBackground(){
 const host=useRef(null);
 useEffect(()=>{
  const el=host.current;if(!el)return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});}
  catch{el.classList.add("relief-fallback");return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;el.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,10);camera.position.z=2.5;
  const uniforms={uPointer:{value:new THREE.Vector2(.52,.58)},uVelocity:{value:new THREE.Vector2(0,0)},uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)},uTime:{value:0}};
  const geometry=new THREE.PlaneGeometry(2,2,256,256),material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms});
  scene.add(new THREE.Mesh(geometry,material));
  const target=new THREE.Vector2(.52,.58);
  const previous=new THREE.Vector2(.52,.58);
  const move=e=>target.set(e.clientX/innerWidth,1-e.clientY/innerHeight);
  const resize=()=>{renderer.setSize(innerWidth,innerHeight);uniforms.uResolution.value.set(innerWidth,innerHeight);};
  addEventListener("pointermove",move,{passive:true});addEventListener("resize",resize);
  const clock=new THREE.Clock();
  let frame;
  const render=()=>{
   frame=requestAnimationFrame(render);
   const before=uniforms.uPointer.value.clone();
   uniforms.uPointer.value.lerp(target,.085);
   const delta=uniforms.uPointer.value.clone().sub(before);
   uniforms.uVelocity.value.lerp(delta.multiplyScalar(60),.12);
   uniforms.uVelocity.value.multiplyScalar(.94);
   uniforms.uTime.value=clock.elapsedTime;
   renderer.render(scene,camera);
  };
  render();
  return()=>{cancelAnimationFrame(frame);removeEventListener("pointermove",move);removeEventListener("resize",resize);geometry.dispose();material.dispose();renderer.dispose();if(renderer.domElement.parentNode===el)el.removeChild(renderer.domElement);};
 },[]);
 return <div className="relief-background" ref={host} aria-hidden="true"/>;
}
