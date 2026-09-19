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
  const uniforms={
   uTime:{value:0},
   uRes:{value:new THREE.Vector2(window.innerWidth,window.innerHeight)},
   uPointer:{value:new THREE.Vector2(.5,.5)}
  }

  const material=new THREE.ShaderMaterial({
   transparent:false,
   depthWrite:false,
   depthTest:false,
   blending:THREE.AdditiveBlending,
   uniforms,
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}',
   fragmentShader:`precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uRes,uPointer;

float hash21(vec2 p){
 p=fract(p*vec2(127.1,311.7));
 p+=dot(p,p+74.7);
 return fract(p.x*p.y);
}
float noise(vec2 p){
 vec2 i=floor(p),f=fract(p);
 f=f*f*(3.-2.*f);
 return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),f.x),
            mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),f.x),f.y);
}
float fbm(vec2 p){
 float v=0.,a=.5;
 for(int i=0;i<5;i++){
  v+=a*noise(p);
  p=p*2.02+9.1;
  a*=.5;
 }
 return v;
}

float glitter(vec2 p,float scale,float radius,float threshold,float speed,float strength){
 vec2 g=p*scale;
 vec2 cell=floor(g);
 vec2 f=fract(g);
 float seed=hash21(cell);
 vec2 jitter=vec2(hash21(cell+17.3),hash21(cell+53.7))-.5;
 float d=length(f-.5-jitter*.72);

 float visible=step(threshold,seed);
 float core=smoothstep(radius,0.,d);

 // Each particle breathes slowly and independently.
 float phase=seed*6.2831853;
 float pulse=.76+.24*sin(uTime*speed+phase);

 return core*visible*pulse*strength;
}

void main(){
 float ar=uRes.x/uRes.y;
 vec2 p=(vUv-.5)*vec2(ar,1.);

 // Slow atmospheric drift. No fast travelling particles.
 float t=uTime*.0032;

 vec2 pointer=(uPointer-.5)*vec2(.045,.030);

 vec2 flow=vec2(
  fbm(p*1.65+vec2(t*.35,-t*.20)),
  fbm(p*1.65+vec2(-t*.24,t*.30))
 )-.5;

 vec2 q=p+pointer+flow*.055;

 // Almost imperceptible breathing of the whole field.
 q+=.0035*vec2(
  sin(q.y*6.0+t*1.4),
  cos(q.x*5.5-t*1.2)
 );

 float cloud=fbm(q*2.35+vec2(t*.055,-t*.035));

 float stars=0.;

 // Dense particle field at several scales. Very low motion speeds.
 stars+=glitter(q,100.,.080,.012,.035,.62);
 stars+=glitter(q+vec2(.13,-.07),190.,.067,.032,.044,.52);
 stars+=glitter(q-vec2(.09,.12),350.,.055,.068,.054,.43);
 stars+=glitter(q+vec2(.06,.16),660.,.045,.13,.066,.35);
 stars+=glitter(q-vec2(.15,.05),1180.,.036,.21,.078,.28);
 stars+=glitter(q+vec2(.18,-.13),2050.,.029,.30,.090,.22);
 stars+=glitter(q-vec2(.18,.10),3350.,.024,.40,.105,.17);
 stars+=glitter(q+vec2(.11,.20),5100.,.020,.50,.120,.13);

 float dust=noise(q*24.0+t*.004)*noise(q*52.0-t*.003);
 float density=.72+.90*smoothstep(.12,.88,cloud);
 stars*=density*(.92+.28*dust);

 // Explicit halo around every lit particle.
 float halo=pow(max(stars,0.),1.18)*6.0;
 float bloom=pow(max(stars,0.),.42)*3.1;
 float core=pow(max(stars,0.),.72)*2.4;

 vec3 bg=vec3(.007,.0085,.012);
 vec3 red=vec3(1.0,.055,.018);
 vec3 orange=vec3(1.0,.255,.035);
 vec3 amber=vec3(1.0,.56,.085);

 float warm=smoothstep(.16,.80,cloud);
 vec3 col=mix(red,orange,warm);
 col=mix(col,amber,smoothstep(.55,1.,cloud)*.18);

 float haze=pow(max(cloud-.35,0.),2.4)*.026;

 vec3 rgb=bg+col*(halo+bloom+core+haze);
 gl_FragColor=vec4(rgb,1.0);
}`
  })

  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),material)
  scene.add(mesh)

  let tx=.5,ty=.5,x=.5,y=.5,frame

  const onPointer=e=>{
   tx=e.clientX/window.innerWidth
   ty=e.clientY/window.innerHeight
  }

  const onOrientation=e=>{
   if(Number.isFinite(e.gamma)&&Number.isFinite(e.beta)){
    tx=.5+e.gamma/180
    ty=.5+(e.beta-45)/240
   }
  }

  const onResize=()=>{
   renderer.setSize(window.innerWidth,window.innerHeight,false)
   uniforms.uRes.value.set(window.innerWidth,window.innerHeight)
  }

  window.addEventListener('pointermove',onPointer,{passive:true})
  window.addEventListener('deviceorientation',onOrientation,{passive:true})
  window.addEventListener('resize',onResize)

  const clock=new THREE.Clock()

  const render=()=>{
   const elapsed=clock.getElapsedTime()
   // Smooth, very slow response to pointer/gyroscope.
   x+=(tx-x)*.004
   y+=(ty-y)*.004
   uniforms.uPointer.value.set(x,y)
   uniforms.uTime.value=elapsed
   renderer.render(scene,camera)
   frame=requestAnimationFrame(render)
  }

  render()

  return()=>{
   cancelAnimationFrame(frame)
   window.removeEventListener('pointermove',onPointer)
   window.removeEventListener('deviceorientation',onOrientation)
   window.removeEventListener('resize',onResize)
   mesh.geometry.dispose()
   material.dispose()
   renderer.dispose()
  }
 },[])

 return <canvas ref={ref} className="fusion-bg" aria-hidden="true"/>
}
