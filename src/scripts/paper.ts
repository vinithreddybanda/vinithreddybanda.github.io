const canvas = document.querySelector<HTMLCanvasElement>("[data-dot-field]");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
if (canvas) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (ctx) {
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const SPACING = 34, DOT_R = 2.4, REST_ALPHA = .2, VEL_PUSH = .16;
    const WAVE = 2.4, RIPPLE_SPEED = 620, RIPPLE_WIDTH = 90, RIPPLE_PUSH = 3.4;
    const REPEL_R = 116, PUSH = .9, BLOOM = 2.1, SPRING = .055, DAMPING = .18;
    type Dot = { hx:number; hy:number; x:number; y:number; vx:number; vy:number; appear:number };
    type Ripple = { x:number; y:number; radius:number; strength:number };
    const dots: Dot[] = [];
    const ripples: Ripple[] = [];
    const mouse = { x:0, y:0, px:0, py:0, vx:0, vy:0, active:false };
    let width=0, height=0, dpr=1, cols=0, rows=0, raf=0, last=0, visible=true;
    let ink=[30,30,30];
    const resolveInk=()=>{
      const probe=document.createElement("span");
      probe.style.cssText="position:absolute;visibility:hidden;color:var(--ink)";
      document.body.append(probe);
      const values=getComputedStyle(probe).color.match(/\d+/g);
      probe.remove();
      if(values) ink=values.slice(0,3).map(Number);
    };
    const measure=()=>{
      width=innerWidth; height=innerHeight; dpr=Math.min(devicePixelRatio||1,2);
      canvas!.width=Math.round(width*dpr); canvas!.height=Math.round(height*dpr);
      canvas!.style.width=width+"px"; canvas!.style.height=height+"px";
      ctx!.setTransform(dpr,0,0,dpr,0,0);
      const pitch=clamp(Math.min(width,height)/18,26,44);
      const nextCols=Math.max(2,Math.round(width/pitch));
      const nextRows=Math.max(2,Math.round(height/pitch));
      if(nextCols===cols&&nextRows===rows&&dots.length){
        const gapX=width/cols,gapY=height/rows;
        dots.forEach((d,i)=>{const hx=gapX*(i%cols+.5),hy=gapY*(Math.floor(i/cols)+.5);d.x+=hx-d.hx;d.y+=hy-d.hy;d.hx=hx;d.hy=hy;});
        return;
      }
      cols=nextCols; rows=nextRows; dots.length=0;
      const gapX=width/cols,gapY=height/rows;
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
        const x=gapX*(c+.5),y=gapY*(r+.5);
        dots.push({hx:x,hy:y,x,y,vx:0,vy:0,appear:reduced.matches?1:0});
      }
      dots.forEach(d=>d.appear=1);
    };
    const draw=(time:number,dtMs:number)=>{
      const dt=Math.min(dtMs,40)/1000||.016;
      const radius2=REPEL_R*REPEL_R;
      mouse.vx=mouse.x-mouse.px; mouse.vy=mouse.y-mouse.py;
      mouse.px=mouse.x; mouse.py=mouse.y;
      for(let i=ripples.length-1;i>=0;i--){
        const ripple=ripples[i]; ripple.radius+=RIPPLE_SPEED*dt;
        ripple.strength*=Math.pow(.955,dt*60);
        if(ripple.strength<.05||ripple.radius>Math.hypot(width,height)) ripples.splice(i,1);
      }
      ctx!.clearRect(0,0,width,height);
      const [r,g,b]=ink;
      for(const d of dots){
        const hx=reduced.matches?d.hx:d.hx+Math.sin(d.hy*.02+time*.0012)*WAVE;
        const hy=reduced.matches?d.hy:d.hy+Math.cos(d.hx*.02+time*.001)*WAVE;
        let ax=(hx-d.x)*SPRING, ay=(hy-d.y)*SPRING, bloom=0;
        if(mouse.active&&!reduced.matches){
          const dx=d.x-mouse.x,dy=d.y-mouse.y,dd=dx*dx+dy*dy;
          if(dd<radius2){
            const dist=Math.sqrt(dd)||1,f=1-dist/REPEL_R;
            ax+=dx/dist*f*PUSH+mouse.vx*f*VEL_PUSH;
            ay+=dy/dist*f*PUSH+mouse.vy*f*VEL_PUSH;
            bloom=f;
          }
        }
        for(const ripple of ripples){
          const dx=d.x-ripple.x,dy=d.y-ripple.y,dist=Math.hypot(dx,dy)||1;
          const edge=Math.abs(dist-ripple.radius);
          if(edge<RIPPLE_WIDTH){
            const force=(1-edge/RIPPLE_WIDTH)*ripple.strength;
            ax+=dx/dist*force; ay+=dy/dist*force;
            bloom=Math.max(bloom,Math.min(1,force*.4));
          }
        }
        const keep=1-DAMPING;
        d.vx=(d.vx+ax)*keep; d.vy=(d.vy+ay)*keep;
        d.x+=d.vx; d.y+=d.vy;
        const appear=reduced.matches?1:d.appear;
        const rad=DOT_R*(.4+.6*appear)*(1+bloom*BLOOM);
        const alpha=appear*(REST_ALPHA+bloom*(1-REST_ALPHA));
        if(alpha<.004||rad<.1) continue;
        ctx!.beginPath(); ctx!.arc(d.x,d.y,rad,0,Math.PI*2);
        ctx!.fillStyle="rgba("+r+","+g+","+b+","+alpha+")"; ctx!.fill();
      }
    };
    const tick=(time:number)=>{
      raf=0; if(!visible) return;
      const dt=last?time-last:16.67; last=time; draw(time,dt);
      if(!reduced.matches||ripples.length||mouse.active) raf=requestAnimationFrame(tick);
    };
    function wake(){ if(!raf&&visible&&!reduced.matches) raf=requestAnimationFrame(tick); }
    const point=(e:PointerEvent)=>({x:e.clientX,y:e.clientY});
    window.addEventListener("pointermove",e=>{
      const p=point(e); mouse.x=p.x; mouse.y=p.y;
      if(!mouse.active){mouse.px=p.x;mouse.py=p.y;}
      mouse.active=true; wake();
    },{passive:true});
    window.addEventListener("pointerout",e=>{if(!e.relatedTarget){mouse.active=false;wake();}});
    window.addEventListener("pointerdown",e=>{
      if(reduced.matches) return;
      const p=point(e); ripples.push({x:p.x,y:p.y,radius:0,strength:RIPPLE_PUSH}); wake();
    },{passive:true});
    window.addEventListener("resize",()=>{measure();wake();},{passive:true});
    document.addEventListener("visibilitychange",()=>{
      visible=document.visibilityState==="visible";
      if(!visible&&raf){cancelAnimationFrame(raf);raf=0;} else {last=0;wake();}
    });
    new MutationObserver(()=>{resolveInk();wake();}).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
    reduced.addEventListener("change",()=>{measure();wake();});
    resolveInk(); measure(); wake();
  }
}
