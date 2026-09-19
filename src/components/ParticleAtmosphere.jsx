import React,{useEffect,useRef}from'react'
import*as THREE from'three'

export function ParticleAtmosphere(){
 const ref=useRef(null)
 useEffect(()=>{
  const canvas=ref.current
  let renderer
  try{renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'high-performance'})}catch{canvas.style.display='none';return}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6))
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
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+9.1;a*=.5;}return v;}
float sparkle(vec2 p,float scale,float radius,float threshold,float twinkle,float speed){
 vec2 g=p*scale;vec2 cell=floor(g);vec2 f=fract(g);float seed=hash21(cell);
 vec2 jitter=vec2(hash21(cell+17.3),hash21(cell+53.7))-.5;
 float d=length(f-.5-jitter*.72);
 float live=step(threshold,seed);
 float pulse=.55+.45*sin(uTime*speed+seed*20.0);
 return smoothstep(radius,0.,d)*live*(twinkle>0.?pulse:1.);
}
void main(){
 float ar=uRes.x/uRes.y;
 vec2 p=(vUv-.5)*vec2(ar,1.);
 float t=uTime*.022;
 vec2 pointer=(uPointer-.5)*vec2(.11,.075);
 vec2 flow=vec2(fbm(p*2.4+vec2(t*.45,-t*.20)),fbm(p*2.4+vec2(-t*.28,t*.36)))-.5;
 vec2 q=p+pointer+flow*.20;
 q+=.02*vec2(sin(q.y*8.5+t*1.7),cos(q.x*8.0-t*1.35));
 float cloud=fbm(q*3.0+vec2(t*.14,-t*.08));

 float fine=0.;
 fine+=sparkle(q,120.,.065,.05,1.,.32)*.38;
 fine+=sparkle(q+vec2(.12,-.06),250.,.052,.16,1.,.40)*.30;
 fine+=sparkle(q-vec2(.08,.11),480.,.044,.32,1.,.52)*.22;
 fine+=sparkle(q+vec2(.06,.16),900.,.036,.48,1.,.70)*.15;
 fine+=sparkle(q-vec2(.13,.04),1600.,.029,.61,1.,.90)*.10;
 fine+=sparkle(q+vec2(.18,-.12),2800.,.024,.70,1.,1.10)*.07;
 fine+=sparkle(q-vec2(.17,.09),4600.,.019,.78,1.,1.35)*.045;

 float dust=noise(q*28.0+t*.03)*noise(q*55.0-t*.02);
 float density=(.78+.95*smoothstep(.1,.94,cloud));
 float stars=fine*density*(1.0+.55*dust);

 vec3 bg=vec3(.010,.012,.016);
 vec3 red=vec3(1.0,.16,.045);
 vec3 orange=vec3(1.0,.47,.09);
 vec3 gold=vec3(1.0,.78,.25);
 float hot=smoothstep(.20,.92,cloud);
 vec3 col=mix(red,orange,hot);
 col=mix(col,gold,smoothstep(.55,1.,cloud)*.55);

 float glow=pow(max(stars,0.),.55);
 float haze=pow(max(cloud-.30,0.),2.0)*.085;
 vec3 rgb=bg+col*(glow*5.2+haze);
 gl_FragColor=vec4(rgb,1.0);
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
  const render=()=>{const elapsed=clock.getElapsedTime();x+=(tx-x)*.02;y+=(ty-y)*.02;uniforms.uPointer.value.set(x,y);uniforms.uTime.value=elapsed;renderer.render(scene,camera);frame=requestAnimationFrame(render)}
  render()
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',onPointer);window.removeEventListener('deviceorientation',onOrientation);window.removeEventListener('resize',onResize);mesh.geometry.dispose();material.dispose();renderer.dispose()}
 },[])
 return <canvas ref={ref} className="fusion-bg" aria-hidden="true"/>
}
