const canvas=document.querySelector<HTMLCanvasElement>("[data-dot-field]");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
if(canvas){
  const ctx=canvas.getContext("2d",{alpha:true});
  if(ctx){
    const SPACING=12,PIXEL_SIZE=1.9;
    const RIPPLE_SPEED=560,RIPPLE_WIDTH=64,RIPPLE_DECAY=.972,RIPPLE_HEIGHT=17;
    const SPRING=.062,FRICTION=.84;
    type Pixel={x:number;y:number;homeX:number;homeY:number;vx:number;vy:number};
    type Ripple={x:number;y:number;radius:number;strength:number};
    const pixels:Pixel[]=[];
    const ripples:Ripple[]=[];
    let width=0,height=0,dpr=1,cols=0,rows=0,raf=0,last=0,visible=true;
    let ink=[237,237,235];
    const resolveInk=()=>{
      const probe=document.createElement("span");
      probe.style.cssText="position:absolute;visibility:hidden;color:var(--ink)";
      document.body.append(probe);
      const rgb=getComputedStyle(probe).color.match(/\d+/g);
      probe.remove();
      if(rgb)ink=rgb.slice(0,3).map(Number);
    };
    const measure=()=>{
      width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
      canvas!.width=Math.round(width*dpr);canvas!.height=Math.round(height*dpr);
      canvas!.style.width=width+"px";canvas!.style.height=height+"px";
      ctx!.setTransform(dpr,0,0,dpr,0,0);
      const nextCols=Math.ceil(width/SPACING)+1,nextRows=Math.ceil(height/SPACING)+1;
      if(nextCols===cols&&nextRows===rows&&pixels.length)return;
      cols=nextCols;rows=nextRows;pixels.length=0;
      for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
        const hx=x*SPACING,hy=y*SPACING;
        pixels.push({x:hx,y:hy,homeX:hx,homeY:hy,vx:0,vy:0});
      }
      ripples.length=0;ctx!.clearRect(0,0,width,height);
    };
    const draw=(dtMs:number)=>{
      const dt=Math.min(dtMs,40)/1000||.016;
      ctx!.clearRect(0,0,width,height);
      const [r,g,b]=ink;
      for(let i=ripples.length-1;i>=0;i--){
        const wave=ripples[i];
        wave.radius+=RIPPLE_SPEED*dt;
        wave.strength*=Math.pow(RIPPLE_DECAY,dt*60);
        if(wave.strength<.025||wave.radius>Math.hypot(width,height)+RIPPLE_WIDTH)ripples.splice(i,1);
      }
      for(const p of pixels){
        let dx=0,dy=0,depth=0,light=0;
        for(const wave of ripples){
          const x=p.homeX-wave.x,y=p.homeY-wave.y,dist=Math.hypot(x,y)||1;
          const edge=dist-wave.radius;
          const envelope=Math.exp(-(edge*edge)/(2*RIPPLE_WIDTH*RIPPLE_WIDTH))*wave.strength;
          if(envelope<.012)continue;
          const crest=Math.sin(edge*.115),nx=x/dist,ny=y/dist;
          dx+=nx*crest*envelope*RIPPLE_HEIGHT;
          dy+=ny*crest*envelope*RIPPLE_HEIGHT;
          depth=Math.max(depth,envelope);
          light=Math.max(light,envelope*(.55+.45*Math.max(0,crest)));
        }
        const tx=p.homeX+dx,ty=p.homeY+dy;
        p.vx=(p.vx+(tx-p.x)*SPRING)*Math.pow(FRICTION,dt*60);
        p.vy=(p.vy+(ty-p.y)*SPRING)*Math.pow(FRICTION,dt*60);
        p.x+=p.vx;p.y+=p.vy;
        const alpha=Math.max(0,Math.min(.42,depth*.46));
        if(alpha<.018)continue;
        const size=PIXEL_SIZE+depth*1.25,x=p.x,y=p.y;
        ctx!.fillStyle="rgba("+r+","+g+","+b+","+alpha+")";
        ctx!.beginPath();ctx!.arc(x,y,size/2,0,Math.PI*2);ctx!.fill();
        if(depth>.16){
          ctx!.fillStyle="rgba(255,255,255,"+Math.min(.34,light*.38)+")";
          ctx!.beginPath();ctx!.arc(x-.25,y-.25,size*.28,0,Math.PI*2);ctx!.fill();
          ctx!.fillStyle="rgba(0,0,0,"+Math.min(.28,depth*.3)+")";
          ctx!.beginPath();ctx!.arc(x+.3,y+.35,size*.24,0,Math.PI*2);ctx!.fill();
        }
      }
    };
    const tick=(time:number)=>{
      raf=0;if(!visible)return;
      const dt=last?time-last:16.67;last=time;draw(dt);
      if(ripples.length)raf=requestAnimationFrame(tick);
      else{ctx!.clearRect(0,0,width,height);last=0;}
    };
    const wake=()=>{if(!raf&&visible&&!reduced.matches){last=0;raf=requestAnimationFrame(tick);}};
    window.addEventListener("pointerdown",e=>{
      if(reduced.matches)return;
      ripples.push({x:e.clientX,y:e.clientY,radius:0,strength:1});
      wake();
    },{passive:true});
    window.addEventListener("resize",()=>{measure();wake();},{passive:true});
    document.addEventListener("visibilitychange",()=>{
      visible=document.visibilityState==="visible";
      if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}
      else{last=0;wake();}
    });
    new MutationObserver(()=>resolveInk()).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
    reduced.addEventListener("change",()=>{if(reduced.matches){if(raf)cancelAnimationFrame(raf);raf=0;ctx!.clearRect(0,0,width,height);ripples.length=0;}});
    resolveInk();measure();
  }
}
