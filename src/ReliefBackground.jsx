import { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
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
void main(){vUv=uv;vec3 p=position;p.z+=relief(uv)*.42;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec2 uPointer;
uniform vec2 uResolution;
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
void main(){
 vec2 uv=vUv;float h=relief(uv);
 float hx=relief(uv+vec2(.0018,0.))-relief(uv-vec2(.0018,0.));
 float hy=relief(uv+vec2(0.,.0018))-relief(uv-vec2(0.,.0018));
 vec3 n=normalize(vec3(-hx*38.,-hy*38.,1.));
 vec3 light=normalize(vec3((uPointer.x-.5)*2.8,(uPointer.y-.5)*2.,1.6));
 float diffuse=max(dot(n,light),0.);
 float rim=pow(1.-max(n.z,0.),2.);
 float grain=noise(uv*uResolution*.72)*.045+fbm(uv*390.)*.08;
 float pool=exp(-length((uv-uPointer)*vec2(1.,.8))*3.);
 vec3 stone=vec3(.105,.105,.10)+vec3(.11,.108,.10)*diffuse*.95+vec3(.10,.095,.085)*rim+vec3(.045)*smoothstep(-.03,.24,h)+vec3(.10,.095,.08)*pool*diffuse*.55;
 stone-=vec3(grain);float vignette=1.-smoothstep(.18,.95,length((uv-.5)*vec2(.9,.8)));stone*=.60+vignette*.40;
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
  const uniforms={uPointer:{value:new THREE.Vector2(.52,.58)},uResolution:{value:new THREE.Vector2(innerWidth,innerHeight)}};
  const geometry=new THREE.PlaneGeometry(2,2,256,256),material=new THREE.ShaderMaterial({vertexShader,fragmentShader,uniforms});
  scene.add(new THREE.Mesh(geometry,material));
  const target=new THREE.Vector2(.52,.58);
  const move=e=>target.set(e.clientX/innerWidth,1-e.clientY/innerHeight);
  const resize=()=>{renderer.setSize(innerWidth,innerHeight);uniforms.uResolution.value.set(innerWidth,innerHeight);};
  addEventListener("pointermove",move,{passive:true});addEventListener("resize",resize);
  let frame;const render=()=>{frame=requestAnimationFrame(render);uniforms.uPointer.value.lerp(target,.055);renderer.render(scene,camera);};render();
  return()=>{cancelAnimationFrame(frame);removeEventListener("pointermove",move);removeEventListener("resize",resize);geometry.dispose();material.dispose();renderer.dispose();if(renderer.domElement.parentNode===el)el.removeChild(renderer.domElement);};
 },[]);
 return <div className="relief-background" ref={host} aria-hidden="true"/>;
}
