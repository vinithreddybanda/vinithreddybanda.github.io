const canvas=document.querySelector<HTMLCanvasElement>("[data-paper-canvas]");
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
if(canvas){const ctx=canvas.getContext("2d",{alpha:true});if(ctx){
let width=0,height=0,dpr=1,raf=0,visible=true;
const cell=12, ripples:{x:number;y:number;at:number}[]=[];
const resize=()=>{dpr=Math.min(devicePixelRatio||1,1.5);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw(performance.now());};
const draw=(now:number)=>{ctx.clearRect(0,0,width,height);ctx.fillStyle="rgba(23,24,23,.045)";for(let x=0;x<width;x+=cell)for(let y=0;y<height;y+=cell)ctx.fillRect(x,y,1,1);
for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];const age=(now-r.at)/1000;if(age>1.05){ripples.splice(i,1);continue;}const radius=age*210,fade=1-age/1.05;const cx=Math.round(r.x/cell)*cell,cy=Math.round(r.y/cell)*cell;const reach=Math.ceil(radius/cell);for(let gx=-reach;gx<=reach;gx++){for(let gy=-reach;gy<=reach;gy++){const dist=Math.hypot(gx*cell,gy*cell);const band=Math.abs(dist-radius);if(band<cell*1.35){const strength=(1-band/(cell*1.35))*fade;ctx.globalAlpha=strength*.7;ctx.fillStyle=(gx+gy)%5===0?"#a5d63f":"#20231e";ctx.fillRect(cx+gx*cell-4,cy+gy*cell-4,8,8);}}}ctx.globalAlpha=1;}
if(ripples.length&&!reduced.matches)raf=requestAnimationFrame(draw);else raf=0;};
const ripple=(x:number,y:number)=>{ripples.push({x,y,at:performance.now()});if(!raf&&!reduced.matches)raf=requestAnimationFrame(draw);else draw(performance.now());};
window.addEventListener("resize",resize,{passive:true});window.addEventListener("pointerdown",e=>ripple(e.clientX,e.clientY),{passive:true});document.addEventListener("visibilitychange",()=>{visible=document.visibilityState==="visible";if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}else if(visible&&ripples.length&&!raf&&!reduced.matches)raf=requestAnimationFrame(draw);});reduced.addEventListener("change",()=>{if(reduced.matches&&raf){cancelAnimationFrame(raf);raf=0;draw(performance.now());}});resize();
}}