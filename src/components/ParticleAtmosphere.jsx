import React,{useEffect,useRef}from'react'
import*as THREE from'three'

export function ParticleAtmosphere(){
 const ref=useRef(null)
 useEffect(()=>{
  const canvas=ref.current
  let renderer
  try{
   renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:true,powerPreference:'high-performance'})
  }catch{
   canvas.style.display='none'
   return
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5))
  renderer.setSize(window.innerWidth,window.innerHeight,false)
  const scene=new THREE.Scene()
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1)
  const uniforms={uTime:{value:0},uRes:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)},uPointer:{value:new THREE.Vector2(.5,.5)}}
  const material=new THREE.ShaderMaterial({
   transparent:false,depthWrite:false,depthTest:false,blending:THREE.NormalBlending,uniforms,
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}',
   fragmentShader:`precision highp float;
varying vec2 vUv;uniform float uTime;uniform vec2 uRes,uPointer;
float hash21(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+74.7);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+11.7;a*=.5;}return v;}
float dots(vec2 p,float scale,float radius,float gate){vec2 g=p*scale;vec2 c=floor(g);vec2 f=fract(g);vec2 j=vec2(hash21(c+13.1),hash21(c+71.3))-.5;float d=length(f-.5-j*.74);float live=step(gate,hash21(c));return smoothstep(radius,0.,d)*live;}
void main(){
 float ar=uRes.x/uRes.y;vec2 p=(vUv-.5)*vec2(ar,1.);float t=uTime*.035;
 vec2 pointer=(uPointer-.5)*vec2(.13,.09);
 vec2 flow=vec2(fbm(p*2.5+vec2(t*.45,-t*.22)),fbm(p*2.5+vec2(-t*.31,t*.41)))-.5;
 vec2 q=p+pointer+flow*.18;
 q+=.018*vec2(sin(q.y*10.+t*2.),cos(q.x*9.-t*1.5));
 float cloud=fbm(q*3.2+vec2(t*.18,-t*.10));
 float d=0.;
 d+=dots(q,110.,.070,.06)*.38;
 d+=dots(q+vec2(.11,-.07),225.,.058,.18)*.30;
 d+=dots(q-vec2(.08,.13),460.,.049,.34)*.20;
 d+=dots(q*1.01+vec2(.03),820.,.040,.48)*.13;
 d+=dots(q*1.02-vec2(.11),1450.,.032,.62)*.085;
 d+=dots(q*1.04+vec2(.19),2450.,.026,.73)*.055;
 d+=dots(q*1.06-vec2(.17,.04),3900.,.021,.82)*.035;
 d*=.82+.95*smoothstep(.15,.92,cloud);
 float halo=pow(max(0.,1.-length(p+pointer*.2)*1.12),8.)*.06;
 vec3 warm=vec3(1.0,.55,.19);vec3 pale=vec3(1.0,.92,.70);vec3 violet=vec3(.60,.48,1.0);
 vec3 col=mix(warm,pale,smoothstep(.28,.82,cloud));
 col=mix(col,violet,.05+.07*noise(q*3.0));
 vec3 bg=vec3(.025,.028,.038);
 vec3 rgb=bg+col*(pow(max(d,0.),.58)*4.9+halo);
 float a=1.0;
 gl_FragColor=vec4(rgb,a);
}`
  })
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material)
  scene.add(mesh)
  let tx=.5,ty=.5,x=.5,y=.5,frame
  const onPointer=e=>{tx=e.clientX/window.innerWidth;ty=e.clientY/window.innerHeight}
  const onOrientation=e=>{if(Number.isFinite(e.gamma)&&Number.isFinite(e.beta)){tx=.5+e.gamma/180;ty=.5+(e.beta-45)/240}}
  const onResize=()=>{renderer.setSize(window.innerWidth,window.innerHeight,false);uniforms.uRes.value.set(window.innerWidth,window.innerHeight)}
  window.addEventListener('pointermove',onPointer,{passive:true})
  window.addEventListener('deviceorientation',onOrientation,{passive:true})
  window.addEventListener('resize',onResize)
  const clock=new THREE.Clock()
  const render=()=>{const t=clock.getElapsedTime();x+=(tx-x)*.02;y+=(ty-y)*.02;uniforms.uPointer.value.set(x,y);uniforms.uTime.value=t;renderer.render(scene,camera);frame=requestAnimationFrame(render)}
  render()
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',onPointer);window.removeEventListener('deviceorientation',onOrientation);window.removeEventListener('resize',onResize);mesh.geometry.dispose();material.dispose();renderer.dispose()}
 },[])
 return <canvas ref={ref} className="fusion-bg" aria-hidden="true"/>
}
