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
 float speed=clamp(length(uVelocity)*24.,0.,1.);
 vec2 direction=normalize(vec2(uVelocity.x*1.75,uVelocity.y)+vec2(.00001));
 float along=dot(delta,direction);
 float across=delta.x*direction.y-delta.y*direction.x;
 float width=.004+speed*.009;
 float ribbon=exp(-pow(across/width,2.))*exp(-pow((along+.105)/.13,2.));
 float wave=sin(along*105.-uTime*5.)*exp(-abs(along)*8.);
 float crossWave=sin(across*240.+along*24.)*exp(-abs(across)/(.012+speed*.012));
 return speed*ribbon*(wave*.052+crossWave*.018);
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
 float speed=clamp(length(uVelocity)*24.,0.,1.);
 vec2 direction=normalize(vec2(uVelocity.x*1.75,uVelocity.y)+vec2(.00001));
 float along=dot(delta,direction);
 float across=delta.x*direction.y-delta.y*direction.x;
 float width=.004+speed*.009;
 float ribbon=exp(-pow(across/width,2.))*exp(-pow((along+.105)/.13,2.));
 float wave=sin(along*105.-uTime*5.)*exp(-abs(along)*8.);
 float crossWave=sin(across*240.+along*24.)*exp(-abs(across)/(.012+speed*.012));
 return speed*ribbon*(wave*.052+crossWave*.018);
}
float surface(vec2 uv){return relief(uv)+cloth(uv);}
void main(){
 vec2 uv=vUv;
 float h=surface(uv);
 float hx=surface(uv+vec2(.0012,0.))-surface(uv-vec2(.0012,0.));
 float hy=surface(uv+vec2(0.,.0012))-surface(uv-vec2(0.,.0012));
 vec3 normal=normalize(vec3(-hx*190.,-hy*190.,1.));

 // A narrow ribbon trails the pointer like air moving across a hanging curtain.
 vec2 delta=(uv-uPointer)*vec2(uResolution.x/uResolution.y,1.);
 vec2 direction=normalize(vec2(uVelocity.x*uResolution.x/uResolution.y,uVelocity.y)+vec2(.00001));
 float along=dot(delta,direction);
 float across=abs(delta.x*direction.y-delta.y*direction.x);
 float speed=clamp(length(uVelocity)*24.,0.,1.);
 float ribbonWidth=.0035+speed*.006;
 float ribbonAcross=exp(-pow(across/ribbonWidth,2.));
 float ribbonLength=smoothstep(-.30,-.24,along)*(1.-smoothstep(.012,.045,along));
 float reveal=ribbonAcross*ribbonLength*speed;

 // Directional grazing light reveals only the real raised and recessed surface.
 vec3 lightDirection=normalize(vec3(-.62,.72,.58));
 float diffuse=max(dot(normal,lightDirection),0.);
 float grazing=pow(1.-max(dot(normal,lightDirection),0.),4.);
 vec3 halfVector=normalize(lightDirection+vec3(0.,0.,1.));
 float specular=pow(max(dot(normal,halfVector),0.),34.);
 float cavity=smoothstep(.018,.16,h);
 float grain=noise(uv*uResolution*.9)*.012+fbm(uv*520.)*.018;
 float reliefShade=clamp(.008+diffuse*.045+grazing*.018+specular*.045+cavity*.012-grain*.12,0.,.11);
 float fineEdge=exp(-pow(across/(ribbonWidth*.42),2.))*ribbonLength*speed;
 vec3 stone=vec3(reliefShade*reveal+fineEdge*.035);
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
