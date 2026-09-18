import React,{useEffect,useRef}from'react'
import*as THREE from'three'

export function ParticleAtmosphere(){
 const ref=useRef(null)
 useEffect(()=>{
  const canvas=ref.current
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'high-performance'})
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5))
  renderer.setSize(window.innerWidth,window.innerHeight,false)
  const scene=new THREE.Scene()
  const camera=new THREE.OrthographicCamera(-1,1,1,-1,0,1)
  const uniforms={uTime:{value:0},uRes:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)},uPointer:{value:new THREE.Vector2(.5,.5)}}
  const material=new THREE.ShaderMaterial({
   transparent:true,depthWrite:false,depthTest:false,blending:THREE.AdditiveBlending,uniforms,
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}',
   fragmentShader:`precision highp float;varying vec2 vUv;uniform float uTime;uniform vec2 uRes,uPointer;
float hash21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+1.);return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.02+17.3;a*=.52;}return v;}
float particleLayer(vec2 p,float s,float threshold,float radius){vec2 g=p*s;vec2 cell=floor(g);vec2 f=fract(g);float seed=hash21(cell);vec2 jitter=vec2(hash21(cell+11.7),hash21(cell+37.2))-.5;float d=length(f-.5-jitter*.76);float visible=step(threshold,seed);return smoothstep(radius,0.,d)*visible;}
void main(){
 float ar=uRes.x/uRes.y;vec2 p=(vUv-.5)*vec2(ar,1.);float t=uTime*.018;
 vec2 pointer=(uPointer-.5)*vec2(.12,.08);
 vec2 flow=vec2(fbm(p*2.2+vec2(t*.7,-t*.28)),fbm(p*2.2+vec2(-t*.35,t*.46)))-.5;
 vec2 q=p+flow*.22+pointer;
 q+=.025*vec2(sin(q.y*7.0+t*2.0),cos(q.x*6.0-t*1.7));
 float cloud=fbm(q*3.0+vec2(t*.25,-t*.12));
 float d=0.;
 d+=particleLayer(q,125.,.10,.055)*.30;
 d+=particleLayer(q+vec2(.13,-.08),250.,.23,.048)*.24;
 d+=particleLayer(q-vec2(.09,.12),500.,.42,.040)*.19;
 d+=particleLayer(q*1.015+vec2(.04),900.,.59,.034)*.14;
 d+=particleLayer(q*1.03-vec2(.08),1650.,.72,.027)*.09;
 d+=particleLayer(q*1.07+vec2(.17),2900.,.81,.021)*.05;
 d*=.72+.9*smoothstep(.18,.92,cloud);
 float haze=smoothstep(.15,.95,fbm(q*1.35-vec2(t*.09))) *.16;
 vec3 hot=vec3(1.0,.76,.50);vec3 white=vec3(1.0,.96,.86);vec3 violet=vec3(.68,.58,1.0);
 vec3 col=mix(hot,white,smoothstep(.35,.9,cloud));col=mix(col,violet,.08+noise(q*4.0)*.08);
 float glow=pow(max(d,.0),.62);float alpha=min(1.,d*1.9+haze*.55);
 gl_FragColor=vec4(col*(glow*4.8+haze*.22),alpha);
 }`
  })
  const quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material)
  scene.add(quad)
  let tx=.5,ty=.5,x=.5,y=.5
  const onPointer=e=>{tx=e.clientX/window.innerWidth;ty=e.clientY/window.innerHeight}
  const onOrientation=e=>{if(Number.isFinite(e.gamma)&&Number.isFinite(e.beta)){tx=.5+e.gamma/180;ty=.5+(e.beta-45)/240}}
  const onResize=()=>{renderer.setSize(window.innerWidth,window.innerHeight,false);uniforms.uRes.value.set(window.innerWidth,window.innerHeight)}
  window.addEventListener('pointermove',onPointer,{passive:true})
  window.addEventListener('deviceorientation',onOrientation,{passive:true})
  window.addEventListener('resize',onResize)
  const clock=new THREE.Clock()
  let frame
  const render=()=>{const elapsed=clock.getElapsedTime();x+=(tx-x)*.02;y+=(ty-y)*.02;uniforms.uPointer.value.set(x,y);uniforms.uTime.value=elapsed;renderer.render(scene,camera);frame=requestAnimationFrame(render)}
  render()
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('pointermove',onPointer);window.removeEventListener('deviceorientation',onOrientation);window.removeEventListener('resize',onResize);quad.geometry.dispose();material.dispose();renderer.dispose()}
 },[])
 return <canvas ref={ref} className="fusion-bg" aria-hidden="true"/>
}