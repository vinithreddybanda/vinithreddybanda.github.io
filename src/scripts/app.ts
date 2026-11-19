type PressProject={slug:string;number:string;name:string;category:string;year:string;summary:string;stack:string[]};
declare global{interface Window{__pressProjects?:PressProject[]}}
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const projects=window.__pressProjects??[];
const $=<T extends Element>(s:string,r:ParentNode=document)=>r.querySelector<T>(s);
const $$=<T extends Element>(s:string,r:ParentNode=document)=>Array.from(r.querySelectorAll<T>(s));
function initTheme(){
  const root=document.documentElement,button=$<HTMLButtonElement>("[data-theme-toggle]");
  if(!button)return;
  const apply=(theme:"light"|"dark")=>{
    root.dataset.theme=theme;
    try{localStorage.setItem("vb-theme",theme);}catch{}
    button.setAttribute("aria-label",theme==="light"?"Switch to dark theme":"Switch to light theme");
    const label=$<HTMLElement>("[data-theme-label]");if(label)label.textContent=theme==="light"?"DARK":"LIGHT";
    const meta=$<HTMLMetaElement>('meta[name="theme-color"]');if(meta)meta.content=theme==="light"?"#e9e9e5":"#111111";
  };
  apply(root.dataset.theme==="light"?"light":"dark");
  button.addEventListener("click",()=>apply(root.dataset.theme==="light"?"dark":"light"));
}
function initClock(){
  const clock=$<HTMLElement>("[data-local-time]");if(!clock)return;
  const tick=()=>clock.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
  tick();window.setInterval(tick,30000);
}
function initPress(){
  const stage=$<HTMLElement>("[data-press-stage]"),ring=$<HTMLElement>("[data-press-ring]");
  if(!stage||!ring||!projects.length)return;
  const plates=$$<HTMLButtonElement>("[data-project-index]",ring);
  const viewButtons=$$<HTMLButtonElement>("[data-view]");
  const count=plates.length,slice=360/count;
  let angle=0,target=0,active=0,unwrapped=0,dragging=false,grid=false;
  let pointer=0,startX=0,lastX=0,lastMove=0,velocity=0,moved=false,raf=0,lastFrame=0;
  const mod=(n:number)=>((n%count)+count)%count;
  const radius=()=>Math.min(390,Math.max(180,stage.clientWidth*.34));
  const wheels=$$<HTMLElement>("[data-press-wheel]");
  const nearestStep=()=>Math.round(-target/slice);
  const sync=()=>{
    const step=Math.round(-angle/slice),index=mod(step);
    if(index!==active){active=index;updateCopy(index);}
    plates.forEach((plate,i)=>{
      const relative=((i-index+count+count/2)%count)-count/2;
      plate.classList.toggle("is-active",i===index);
      plate.classList.toggle("is-near",Math.abs(relative)===1);
      plate.setAttribute("aria-pressed",String(i===index));
    });
    const readout=$<HTMLElement>("[data-active-index]");if(readout)readout.textContent=String(index+1).padStart(2,"0");
  };
  const updateCopy=(index:number)=>{
    const p=projects[index];
    const set=(selector:string,value:string)=>{const el=$(selector);if(el)el.textContent=value;};
    set("[data-selected-number]",p.number);set("[data-selected-type]",p.category);
    set("[data-selected-name]",p.name);set("[data-selected-summary]",p.summary);
    const link=$<HTMLAnchorElement>("[data-selected-link]");if(link)link.href="/work/"+p.slug+"/";
  };
  const layout=()=>{
    const r=radius();
    plates.forEach((plate,i)=>{
      const rad=(i*slice+angle)*Math.PI/180;
      plate.style.setProperty("--plate-x",(Math.sin(rad)*r)+"px");
      plate.style.setProperty("--plate-z",(Math.cos(rad)*r)+"px");
    });
    wheels.forEach((wheel,i)=>wheel.style.transform="translateY(-50%) rotate("+((i===0?-1:1)*angle)+"deg)");
    sync();
  };
  const frame=(now:number)=>{
    raf=0;const dt=Math.min(40,now-(lastFrame||now));lastFrame=now;
    if(!dragging&&!grid&&!reduced){
      if(Math.abs(velocity)>.001){target+=velocity*dt;velocity*=Math.pow(.92,dt/16.67);}
      else velocity=0;
      target-=.004*dt;
    }
    angle+=(target-angle)*Math.min(1,dt*.012);
    if(Math.abs(target-angle)<.015)angle=target;
    layout();
    if(!reduced)raf=requestAnimationFrame(frame);
  };
  const wake=()=>{if(!raf&&!reduced){lastFrame=performance.now();raf=requestAnimationFrame(frame);}};
  const goSteps=(steps:number)=>{
    if(!steps)return;
    target-=steps*slice;unwrapped+=steps;wake();
  };
  const snap=()=>{
    const step=nearestStep();unwrapped=step;target=-step*slice;velocity=0;wake();
    if(reduced){angle=target;layout();}
  };
  const setView=(next:boolean)=>{
    if(grid===next)return;
    const before=plates.map(p=>p.getBoundingClientRect());
    grid=next;stage.dataset.view=grid?"grid":"ring";
    viewButtons.forEach(b=>b.setAttribute("aria-pressed",String((b.dataset.view==="grid")===grid)));
    requestAnimationFrame(()=>{
      plates.forEach((p,i)=>{
        const a=before[i],b=p.getBoundingClientRect();
        if(reduced)return;
        p.animate([
          {transform:"translate("+((a.left+a.width/2)-(b.left+b.width/2))+"px,"+((a.top+a.height/2)-(b.top+b.height/2))+"px) scale("+a.width/Math.max(1,b.width)+","+a.height/Math.max(1,b.height)+")"},
          {transform:"translate(0,0) scale(1,1)"}
        ],{duration:950,easing:"cubic-bezier(.16,1,.3,1)"});
      });
    });
    if(!grid){snap();}
  };
  viewButtons.forEach(b=>b.addEventListener("click",()=>setView(b.dataset.view==="grid")));
  stage.addEventListener("pointerdown",e=>{
    if(grid||(e.target as Element).closest(".view-switch"))return;
    dragging=true;pointer=e.pointerId;startX=lastX=e.clientX;lastMove=performance.now();velocity=0;moved=false;
    stage.setPointerCapture(pointer);stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove",e=>{
    if(!dragging||e.pointerId!==pointer)return;
    const dx=e.clientX-lastX,now=performance.now(),elapsed=Math.max(1,now-lastMove);
    if(Math.abs(e.clientX-startX)>5)moved=true;
    target+=dx*.22;velocity=(dx*.22)/elapsed;lastX=e.clientX;lastMove=now;
    angle=target;layout();
  });
  const end=(e:PointerEvent)=>{
    if(!dragging||e.pointerId!==pointer)return;
    dragging=false;stage.classList.remove("is-dragging");
    if(Math.abs(velocity)>.02)target+=Math.sign(velocity)*Math.min(1.6,Math.abs(velocity)*18)*slice;
    snap();
    window.setTimeout(()=>{moved=false;},80);
  };
  stage.addEventListener("pointerup",end);stage.addEventListener("pointercancel",end);
  plates.forEach((plate,i)=>plate.addEventListener("click",()=>{
    if(moved)return;
    const current=nearestStep(),currentIndex=mod(current);
    let delta=i-currentIndex;
    if(delta>count/2)delta-=count;if(delta< -count/2)delta+=count;
    goSteps(delta);snap();
  }));
  stage.addEventListener("wheel",e=>{
    if(grid)return;
    const delta=Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX;
    if(Math.abs(delta)<2)return;
    e.preventDefault();goSteps(delta>0?1:-1);snap();
  },{passive:false});
  stage.addEventListener("keydown",e=>{
    if(e.key==="ArrowRight"){e.preventDefault();goSteps(1);snap();}
    if(e.key==="ArrowLeft"){e.preventDefault();goSteps(-1);snap();}
  });
  layout();updateCopy(0);
  if(!reduced)wake();
  window.addEventListener("resize",layout,{passive:true});
}
function initReveals(){
  if(reduced)return;
  const items=$$<HTMLElement>("[data-reveal]");
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
  }),{threshold:.08});
  items.forEach(el=>observer.observe(el));
}
initTheme();initClock();initPress();initReveals();
