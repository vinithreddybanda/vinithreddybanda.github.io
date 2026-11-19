const canvas=document.querySelector<HTMLCanvasElement>("[data-dot-field]");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
if(canvas){
 const ctx=canvas.getContext("2d",{alpha:true});
 if(ctx){
  const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
  const SPACING=34,DOT_R=2.4,REST_ALPHA=.2,VEL_PUSH=.16,WAVE=2.4,RIPPLE_SPEED=620,RIPPLE_WIDTH=90,RIPPLE_PUSH=3.4;
  const SPRING=.055,FRICTION=.82,REPEL_R=116,PUSH=.9,BLOOM=2.1;
  type Dot={hx:number;hy:number;x:number;y:number;vx:number;vy:number};
  const dots:Dot[]=[];const ripples:{x:number;y:number;radius:number;strength:number}[]=[];
  const mouse={x:0,y:0,px:0,py:0,vx:0,vy:0,active:false};
  let w=0,h=0,dpr=1,raf=0,last=0,ink="237,237,235",visible=true;
  const resolveInk=()=>{const probe=document.createElement("span");probe.style.cssText="position:absolute;visibility:hidden;color:var(--ink)";document.body.append(probe);const values=getComputedStyle(probe).color.match(/\d+/g);probe.remove();if(values)ink=values.slice(0,3).join(",");};
  const measure=()=>{w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas!.width=Math.round(w*dpr);canvas!.height=Math.round(h*dpr);ctx!.setTransform(dpr,0,0,dpr,0,0);dots.length=0;const pitch=clamp(Math.min(w,h)/18,26,44),cols=Math.max(2,Math.round(w/pitch)),rows=Math.max(2,Math.round(h/pitch)),gapX=w/cols,gapY=h/rows;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=gapX*(c+.5),y=gapY*(r+.5);dots.push({hx:x,hy:y,x,y,vx:0,vy:0});}draw(performance.now(),16.67);};
  const draw=(now:number,dtMs:number)=>{if(!ctx)return;const dt=Math.min(dtMs,40)/1000||.016;const r2=REPEL_R*REPEL_R;mouse.vx=mouse.x-mouse.px;mouse.vy=mouse.y-mouse.py;mouse.px=mouse.x;mouse.py=mouse.y;for(let i=ripples.length-1;i>=0;i--){const rp=ripples[i];rp.radius+=RIPPLE_SPEED*dt;rp.strength*=Math.pow(.955,dt*60);if(rp.strength<.05||rp.radius>Math.hypot(w,h))ripples.splice(i,1);}ctx.clearRect(0,0,w,h);const [ir,ig,ib]=ink.split(",").map(Number);
   for(const d of dots){const hx=reduced.matches?d.hx:d.hx+Math.sin(d.hy*.02+now*.0012)*WAVE,hy=reduced.matches?d.hy:d.hy+Math.cos(d.hx*.02+now*.001)*WAVE;let ax=(hx-d.x)*SPRING,ay=(hy-d.y)*SPRING,bloom=0;
    if(mouse.active&&!reduced.matches){const dx=d.x-mouse.x,dy=d.y-mouse.y,dd=dx*dx+dy*dy;if(dd<r2){const dist=Math.sqrt(dd)||1,f=1-dist/REPEL_R;ax+=dx/dist*f*PUSH+mouse.vx*f*VEL_PUSH;ay+=dy/dist*f*PUSH+mouse.vy*f*VEL_PUSH;bloom=f;}}
    for(const rp of ripples){const dx=d.x-rp.x,dy=d.y-rp.y,dist=Math.hypot(dx,dy)||1,edge=Math.abs(dist-rp.radius);if(edge<RIPPLE_WIDTH){const f=(1-edge/RIPPLE_WIDTH)*rp.strength;ax+=dx/dist*f;ay+=dy/dist*f;bloom=Math.max(bloom,Math.min(1,f*.4));}}
    const keep=Math.pow(FRICTION,dt*60);d.vx=(d.vx+ax*dt*60)*keep;d.vy=(d.vy+ay*dt*60)*keep;d.x+=d.vx*dt*60;d.y+=d.vy*dt*60;const radius=DOT_R*(1+bloom*BLOOM),alpha=REST_ALPHA+bloom*(1-REST_ALPHA);ctx.beginPath();ctx.arc(d.x,d.y,radius,0,Math.PI*2);ctx.fillStyle="rgba("+ir+","+ig+","+ib+","+alpha+")";ctx.fill();
   }
  };
  const tick=(now:number)=>{raf=0;if(!visible)return;const dt=last?now-last:16.67;last=now;draw(now,dt);if(!reduced.matches||ripples.length)raf=requestAnimationFrame(tick);};
  const wake=()=>{if(!raf&&visible)raf=requestAnimationFrame(tick);};
  window.addEventListener("pointermove",e=>{mouse.x=e.clientX;mouse.y=e.clientY;if(!mouse.active){mouse.px=mouse.x;mouse.py=mouse.y;}mouse.active=true;wake();},{passive:true});
  window.addEventListener("pointerout",e=>{if(!e.relatedTarget)mouse.active=false;});
  window.addEventListener("pointerdown",e=>{if(reduced.matches)return;ripples.push({x:e.clientX,y:e.clientY,radius:0,strength:RIPPLE_PUSH});wake();},{passive:true});
  window.addEventListener("resize",measure,{passive:true});document.addEventListener("visibilitychange",()=>{visible=document.visibilityState==="visible";if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else wake();});
  new MutationObserver(()=>{resolveInk();wake();}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  reduced.addEventListener("change",()=>{if(!reduced.matches)wake();else{if(raf)cancelAnimationFrame(raf);raf=0;draw(performance.now(),16.67);}});
  resolveInk();measure();wake();
 }
}