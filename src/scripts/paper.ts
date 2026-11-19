const canvas=document.querySelector<HTMLCanvasElement>("[data-paper-canvas]");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
if(canvas){
 const ctx=canvas.getContext("2d",{alpha:true});
 if(ctx){
  const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
  const SPACING=32,DOT_R=1.35,REPEL_R=112,SPRING=.055,FRICTION=.82,REST_ALPHA=.2,BLOOM=2.15,RIPPLE_SPEED=620,RIPPLE_WIDTH=86;
  type Dot={hx:number;hy:number;x:number;y:number;vx:number;vy:number};
  const dots:Dot[]=[];const ripples:{x:number;y:number;radius:number;strength:number}[]=[];
  const mouse={x:0,y:0,px:0,py:0,vx:0,vy:0,active:false};
  let width=0,height=0,dpr=1,raf=0,last=0,ink="23,24,23",visible=true;
  const resolveInk=()=>{const raw=getComputedStyle(document.documentElement).getPropertyValue("--ink");const probe=document.createElement("span");probe.style.color=raw;document.body.append(probe);const m=getComputedStyle(probe).color.match(/\d+/g);probe.remove();if(m)ink=m.slice(0,3).join(",");};
  const measure=()=>{width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas!.width=Math.round(width*dpr);canvas!.height=Math.round(height*dpr);ctx!.setTransform(dpr,0,0,dpr,0,0);dots.length=0;for(let y=SPACING/2;y<height;y+=SPACING)for(let x=SPACING/2;x<width;x+=SPACING)dots.push({hx:x,hy:y,x,y,vx:0,vy:0});draw(performance.now(),16);};
  const draw=(now:number,dtMs:number)=>{if(!ctx)return;const dt=Math.min(dtMs,40)/16.67;const r2=REPEL_R*REPEL_R;mouse.vx=mouse.x-mouse.px;mouse.vy=mouse.y-mouse.py;mouse.px=mouse.x;mouse.py=mouse.y;
   for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];r.radius+=RIPPLE_SPEED*(dtMs/1000);r.strength*=Math.pow(.955,dt);if(r.strength<.04||r.radius>Math.hypot(width,height))ripples.splice(i,1);}
   ctx.clearRect(0,0,width,height);
   for(const d of dots){const hx=reduced.matches?d.hx:d.hx+Math.sin(d.hy*.02+now*.0012)*1.7;const hy=reduced.matches?d.hy:d.hy+Math.cos(d.hx*.02+now*.001)*1.7;let ax=(hx-d.x)*SPRING,ay=(hy-d.y)*SPRING,bloom=0;
    if(mouse.active&&!reduced.matches){const dx=d.x-mouse.x,dy=d.y-mouse.y,dd=dx*dx+dy*dy;if(dd<r2){const dist=Math.sqrt(dd)||1,f=1-dist/REPEL_R;ax+=dx/dist*f*.9+mouse.vx*f*.16;ay+=dy/dist*f*.9+mouse.vy*f*.16;bloom=f;}}
    for(const rp of ripples){const dx=d.x-rp.x,dy=d.y-rp.y,dist=Math.hypot(dx,dy)||1,edge=Math.abs(dist-rp.radius);if(edge<RIPPLE_WIDTH){const f=(1-edge/RIPPLE_WIDTH)*rp.strength;ax+=dx/dist*f*.035;ay+=dy/dist*f*.035;bloom=Math.max(bloom,Math.min(1,f*.22));}}
    d.vx=(d.vx+ax*dt)*Math.pow(FRICTION,dt);d.vy=(d.vy+ay*dt)*Math.pow(FRICTION,dt);d.x+=d.vx*dt;d.y+=d.vy*dt;
    const rad=DOT_R*(1+bloom*BLOOM),alpha=REST_ALPHA+bloom*(1-REST_ALPHA);ctx.beginPath();ctx.arc(d.x,d.y,rad,0,Math.PI*2);ctx.fillStyle="rgba("+ink+","+alpha+")";ctx.fill();
   }
  };
  const tick=(now:number)=>{raf=0;if(!visible)return;const dt=last?now-last:16.67;last=now;draw(now,dt);if(!reduced.matches)raf=requestAnimationFrame(tick);};
  const wake=()=>{if(!raf&&!reduced.matches&&visible)raf=requestAnimationFrame(tick);};
  canvas.addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;if(!mouse.active){mouse.px=mouse.x;mouse.py=mouse.y;}mouse.active=true;wake();},{passive:true});
  canvas.addEventListener("pointerleave",()=>mouse.active=false);
  window.addEventListener("pointerdown",e=>{if(reduced.matches)return;ripples.push({x:e.clientX,y:e.clientY,radius:0,strength:1});wake();},{passive:true});
  window.addEventListener("resize",measure,{passive:true});
  document.addEventListener("visibilitychange",()=>{visible=document.visibilityState==="visible";if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else wake();});
  new MutationObserver(()=>{resolveInk();wake();}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  reduced.addEventListener("change",()=>{if(raf){cancelAnimationFrame(raf);raf=0;}if(!reduced.matches)wake();else draw(performance.now(),16.67);});
  resolveInk();measure();if(!reduced.matches)wake();
 }
}