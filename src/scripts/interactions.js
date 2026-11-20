const root=document.documentElement;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
let audioContext=null,radioOscillator=null,radioGain=null,frequency=88,sessionStart=Date.now(),rafId=0;
function initPortfolio(){
  if(root.dataset.interactionsReady==="true")return;root.dataset.interactionsReady="true";
  const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
  const clock=$("#local-clock"),progress=$("#read-progress"),overlay=$("#command-overlay"),input=$("#command-input");
  const items=$$("[data-command-item],[data-command-action]");let active=0;
  const themeSaved=(()=>{try{return localStorage.getItem("vinith-theme")}catch{return null}})();
  if(themeSaved==="light"||themeSaved==="dark"||themeSaved==="system")root.dataset.theme=themeSaved;
  const setTheme=mode=>{root.dataset.theme=mode;try{localStorage.setItem("vinith-theme",mode)}catch{};const meta=$('meta[name="theme-color"]');if(meta)meta.content=mode==="light"?"#e8e5db":mode==="system"&&matchMedia("(prefers-color-scheme: light)").matches?"#e8e5db":"#10110f"};
  const cycleTheme=()=>setTheme(root.dataset.theme==="dark"?"light":root.dataset.theme==="light"?"system":"dark");
  $(".theme-toggle")?.addEventListener("click",cycleTheme);
  const presence=$("#presence-toggle"),presenceLabel=$("#presence-label"),aboutPresence=$("#about-presence");
  let presenceSocket=null,remotePeers=new Map(),presenceActive=true;const presenceRoot=$("#remote-cursors"),presenceUrl=document.body.dataset.presenceUrl;const onlineCount=$("#online-count");
  const renderPeer=peer=>{if(!presenceRoot)return;let node=presenceRoot.querySelector(`[data-peer="${peer.id}"]`);if(!node){node=document.createElement("div");node.className="remote-cursor";node.dataset.peer=peer.id;node.innerHTML="<i></i><span></span>";presenceRoot.append(node)}node.style.transform="translate3d("+peer.x*innerWidth+"px,"+peer.y*innerHeight+"px,0)";node.querySelector("span").textContent=peer.name};
  const removePeer=id=>{presenceRoot?.querySelector(`[data-peer="${id}"]`)?.remove();remotePeers.delete(id);if(onlineCount)onlineCount.textContent=String(remotePeers.size+1)};
  const connectPresence=()=>{if(!presenceUrl||!presenceActive||presenceSocket)return;try{presenceSocket=new WebSocket(presenceUrl);window.__portfolioPresenceSocket=presenceSocket;presenceSocket.addEventListener("message",event=>{let data;try{data=JSON.parse(event.data)}catch{return}if(data.type==="welcome"){(data.peers||[]).forEach(p=>{remotePeers.set(p.id,p);renderPeer(p)});if(onlineCount)onlineCount.textContent=String(remotePeers.size+1)}if(data.type==="join"||data.type==="move"){remotePeers.set(data.peer.id,data.peer);renderPeer(data.peer);if(onlineCount)onlineCount.textContent=String(remotePeers.size+1)}if(data.type==="leave")removePeer(data.id)});presenceSocket.addEventListener("close",()=>{presenceSocket=null;window.__portfolioPresenceSocket=null;remotePeers.clear();if(presenceRoot)presenceRoot.replaceChildren();if(onlineCount)onlineCount.textContent="1"})}catch{presenceSocket=null}};
  connectPresence();let lastPresenceSend=0;addEventListener("pointermove",e=>{if(!presenceSocket||presenceSocket.readyState!==WebSocket.OPEN||!presenceActive)return;const now=performance.now();if(now-lastPresenceSend<50)return;lastPresenceSend=now;presenceSocket.send(JSON.stringify({type:"move",x:e.clientX/innerWidth,y:e.clientY/innerHeight}))},{passive:true});
  let present=true;
  const setPresence=()=>{present=!present;presenceActive=present;if(!present){presenceSocket?.close();presenceSocket=null;remotePeers.clear();if(presenceRoot)presenceRoot.replaceChildren();if(onlineCount)onlineCount.textContent="1"}else connectPresence();if(presenceLabel)presenceLabel.textContent=present?"HERE":"AWAY";if(aboutPresence)aboutPresence.textContent=present?"HERE / ONLINE":"AWAY / QUIET";presence?.classList.toggle("is-away",!present);$(".record-trigger")?.classList.toggle("is-active",present)};
  presence?.addEventListener("click",setPresence);$(".record-trigger")?.addEventListener("click",setPresence);
  const tick=()=>{const now=new Date();const value=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(now);if(clock)clock.textContent=value;const aboutClock=$("#about-clock");if(aboutClock)aboutClock.textContent=value;const session=$("#session-time");if(session){const seconds=Math.floor((Date.now()-sessionStart)/1000);session.textContent=String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")}};
  tick();clearInterval(window.__portfolioClock);window.__portfolioClock=setInterval(tick,1000);
  const updateProgress=()=>{if(progress){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform="scaleX("+(max>0?scrollY/max:0)+")"}};
  addEventListener("scroll",updateProgress,{passive:true});updateProgress();
  const reveal=()=>{
    const headings=$$("h1,h2,.section-title");
    headings.forEach(heading=>{if(heading.dataset.typeSplit)return;heading.dataset.typeSplit="true";const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())if(walker.currentNode.nodeValue.trim())nodes.push(walker.currentNode);let n=0;nodes.forEach(node=>{const frag=document.createDocumentFragment();for(const ch of node.nodeValue){const span=document.createElement("span");span.className=ch===" "?"glyph glyph-space":"glyph";span.style.setProperty("--glyph-delay",Math.min(n++,55)*16+"ms");span.textContent=ch===" "?" ":ch;frag.append(span)}node.parentNode.replaceChild(frag,node)});heading.setAttribute("aria-label",heading.textContent.replace(/\s+/g," ").trim())});
    const targets=$$("[data-reveal],.section-index,.hero-bottom-copy,.hero-object,.project-card,.record-row,.skill-cloud span,.recognition-list>div,.featured-row,.social-index a,.contact-primary,.contact-details>a,.case-visual,.case-description,.case-highlights>div,.inner-hero-foot,.profile-file,.letter-layout,.about-teaser-row,.github-repo,.projects-title,.github-compact-head,.studio-row");
    targets.forEach(el=>{if(!el.classList.contains("reveal"))el.classList.add("reveal")});
    if(reduced){targets.forEach(el=>el.classList.add("is-visible"));headings.forEach(el=>el.classList.add("type-in"));return}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");if(entry.target.matches("h1,h2,.section-title"))entry.target.classList.add("type-in");entry.target.querySelectorAll?.("h1,h2,.section-title").forEach(h=>h.classList.add("type-in"));observer.unobserve(entry.target)}}),{threshold:.12});
    targets.forEach(el=>observer.observe(el));headings.forEach(el=>observer.observe(el));
  };reveal();
  const openCommand=()=>{if(!overlay)return;overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");input?.focus();filter()};
  const closeCommand=()=>{overlay?.classList.remove("open");overlay?.setAttribute("aria-hidden","true");if(input)input.value="";filter()};
  const filter=()=>{const q=(input?.value||"").toLowerCase();let first=-1;items.forEach((el,i)=>{const show=el.textContent.toLowerCase().includes(q);el.hidden=!show;if(show&&first<0)first=i});active=first<0?0:first;mark()};
  const mark=()=>{const visible=items.filter(x=>!x.hidden);visible.forEach((el,i)=>el.classList.toggle("selected",i===Math.max(0,visible.indexOf(items[active]))))};
  $(".command-trigger")?.addEventListener("click",openCommand);overlay?.addEventListener("click",e=>{if(e.target===overlay)closeCommand()});input?.addEventListener("input",filter);
  input?.addEventListener("keydown",e=>{const visible=items.filter(x=>!x.hidden);if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const i=Math.max(0,visible.indexOf(items[active]));const next=visible[(i+(e.key==="ArrowDown"?1:-1)+visible.length)%visible.length];active=items.indexOf(next);mark()}if(e.key==="Enter"){e.preventDefault();visible.find(x=>x.classList.contains("selected"))?.click()}if(e.key==="Escape")closeCommand()});
  items.forEach(el=>el.addEventListener("click",()=>{const action=el.dataset.commandAction;if(action==="theme")cycleTheme();if(action==="presence")setPresence();closeCommand()}));
  document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCommand()}if(e.key==="Escape"){closeCommand()}});

  const wheel=$("#work-wheel");if(wheel){
    const originals=$$("[data-wheel-item]",wheel),baseCount=originals.length,count=$("#wheel-count"),control=$(".wheel-controls span");
    if(baseCount){
      const cloneSet=()=>originals.map(card=>{const clone=card.cloneNode(true);clone.setAttribute("aria-hidden","true");clone.querySelectorAll("a,button,[tabindex]").forEach(node=>node.setAttribute("tabindex","-1"));return clone});
      wheel.append(...cloneSet(),...cloneSet());
      let cycleWidth=wheel.children[baseCount].offsetLeft-wheel.children[0].offsetLeft,dragging=false,moved=false,startX=0,scrollStart=0;
      wheel.scrollLeft=cycleWidth;
      const update=()=>{
        if(wheel.scrollLeft<cycleWidth*.45)wheel.scrollLeft+=cycleWidth;
        else if(wheel.scrollLeft>cycleWidth*1.55)wheel.scrollLeft-=cycleWidth;
        const center=wheel.scrollLeft+wheel.clientWidth/2;let closest=0,dist=Infinity;
        $$("[data-wheel-item]",wheel).forEach((card,i)=>{const d=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(d<dist){dist=d;closest=i}});
        const label=String((closest%baseCount)+1).padStart(2,"0")+" / "+String(baseCount).padStart(2,"0");
        if(count)count.textContent=label;if(control)control.textContent=label;
      };
      wheel.addEventListener("scroll",()=>requestAnimationFrame(update),{passive:true});
      wheel.addEventListener("pointerdown",e=>{dragging=true;moved=false;startX=e.clientX;scrollStart=wheel.scrollLeft;wheel.classList.add("dragging");wheel.setPointerCapture(e.pointerId)});
      wheel.addEventListener("pointermove",e=>{if(!dragging)return;const delta=e.clientX-startX;if(Math.abs(delta)>5)moved=true;wheel.scrollLeft=scrollStart-delta});
      const release=()=>{dragging=false;wheel.classList.remove("dragging");if(moved){wheel.dataset.suppressClick="true";requestAnimationFrame(()=>delete wheel.dataset.suppressClick)}};
      wheel.addEventListener("pointerup",release);wheel.addEventListener("pointercancel",release);
      wheel.addEventListener("click",e=>{if(wheel.dataset.suppressClick==="true"){e.preventDefault();e.stopPropagation()}},true);
      $("#wheel-next")?.addEventListener("click",()=>wheel.scrollBy({left:wheel.clientWidth*.78,behavior:reduced?"auto":"smooth"}));
      $("#wheel-prev")?.addEventListener("click",()=>wheel.scrollBy({left:-wheel.clientWidth*.78,behavior:reduced?"auto":"smooth"}));
      addEventListener("resize",()=>{cycleWidth=wheel.children[baseCount].offsetLeft-wheel.children[0].offsetLeft;wheel.scrollLeft=cycleWidth},{passive:true});
      update();
    }
  }
  $$(".press-wheel").forEach(el=>{let start=0,rotation=0,active=false;el.addEventListener("pointerdown",e=>{active=true;start=e.clientX;el.setPointerCapture(e.pointerId);el.style.animation="none"});el.addEventListener("pointermove",e=>{if(!active)return;rotation+=(e.clientX-start)*.45;start=e.clientX;el.style.transform="rotateX(58deg) rotateZ("+rotation+"deg)"});const stop=()=>active=false;el.addEventListener("pointerup",stop);el.addEventListener("pointercancel",stop)});
  const githubPanel=$("#github-live"),aboutRepos=$("#about-repos"),aboutFollowers=$("#about-followers");
  if(githubPanel||aboutRepos||aboutFollowers){
    const sync=$("#github-sync"),repoHost=$("#github-repos"),cacheKey="vinith-github-public-v2";let snapshot=null;
    try{const cached=JSON.parse(localStorage.getItem(cacheKey)||"null");if(cached&&Date.now()-cached.savedAt<20*60*1000)snapshot=cached.data}catch{}
    const applyGithub=data=>{
      const profile=data.profile||{},repos=Array.isArray(data.repos)?data.repos:[];
      const stat=(name,value)=>{const node=githubPanel?.querySelector('[data-github-stat="'+name+'"]');if(node)node.textContent=Number(value||0).toLocaleString("en-IN")};
      stat("public_repos",profile.public_repos);stat("followers",profile.followers);
      stat("stars",repos.reduce((sum,r)=>sum+(r.stargazers_count||0),0));
      if(aboutRepos)aboutRepos.textContent=Number(profile.public_repos||0).toLocaleString("en-IN");
      if(aboutFollowers)aboutFollowers.textContent=Number(profile.followers||0).toLocaleString("en-IN");
      if(sync)sync.textContent=new Intl.DateTimeFormat("en-IN",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Kolkata"}).format(new Date());
      const selected=["SimpMusic","WhatsapStatusSaver","journalai","CareSchedule_cts"];
      const chosen=selected.map(name=>repos.find(r=>r.name.toLowerCase()===name.toLowerCase())).filter(Boolean);
      if(repoHost&&chosen.length){repoHost.replaceChildren();chosen.forEach(r=>{
        const a=document.createElement("a");a.className="github-repo";a.href=r.html_url;a.target="_blank";a.rel="noreferrer";
        const top=document.createElement("span");top.className="repo-top";const dot=document.createElement("i");top.append(dot,document.createTextNode(r.language||"SOURCE"));
        const title=document.createElement("b");title.textContent=r.name;const desc=document.createElement("p");desc.textContent=r.description||"Public repository and ongoing software work.";
        const meta=document.createElement("span");meta.className="repo-meta";const left=document.createElement("span");left.textContent="★ "+(r.stargazers_count||0)+"  FORKS "+(r.forks_count||0);
        const right=document.createElement("i");right.textContent="↗";meta.append(left,right);a.append(top,title,desc,meta);repoHost.append(a)
      })}
    };
    if(snapshot)applyGithub(snapshot);
    fetch("https://api.github.com/users/vinithreddybanda",{headers:{Accept:"application/vnd.github+json"},cache:"no-cache"})
      .then(async response=>{if(!response.ok)throw new Error("GitHub profile unavailable");const profile=await response.json();
        const reposResponse=await fetch("https://api.github.com/users/vinithreddybanda/repos?per_page=100&sort=updated",{headers:{Accept:"application/vnd.github+json"},cache:"no-cache"});
        if(!reposResponse.ok)throw new Error("GitHub repositories unavailable");const repos=await reposResponse.json();
        const data={profile,repos:repos.filter(r=>!r.private)};applyGithub(data);
        try{localStorage.setItem(cacheKey,JSON.stringify({savedAt:Date.now(),data}))}catch{}
      }).catch(()=>{if(!snapshot&&sync)sync.textContent="PROFILE LINK";const note=$("#github-footnote");if(note)note.textContent="Live GitHub data is temporarily unavailable. Repository links remain available."});
  }

  const activityGrid=$("#github-contributions"),activityMonths=$("#github-activity-months"),activityTotal=$("#github-contribution-total");
  if(activityGrid){
    const activityKey="vinith-github-contributions-v1";
    const renderActivity=data=>{
      const entries=Array.isArray(data?.contributions)?data.contributions:[];
      if(!entries.length)throw new Error("No contribution history returned");
      const byDate=new Map(entries.map(item=>[item.date,item]));
      const firstDate=new Date(entries[0].date+"T00:00:00Z"),lastDate=new Date(entries[entries.length-1].date+"T00:00:00Z");
      const startDate=new Date(firstDate);startDate.setUTCDate(startDate.getUTCDate()-((startDate.getUTCDay()+6)%7));
      const total=entries.reduce((sum,item)=>sum+(Number(item.count)||0),0);
      const weeks=53;activityGrid.replaceChildren();activityMonths?.replaceChildren();
      activityGrid.style.gridTemplateColumns="repeat("+weeks+",minmax(0,1fr))";
      if(activityMonths)activityMonths.style.gridTemplateColumns="repeat("+weeks+",minmax(0,1fr))";
      const monthLabels=new Map();
      for(let week=0;week<weeks;week++){
        const column=document.createElement("div");column.className="activity-week";
        for(let day=0;day<7;day++){
          const date=new Date(startDate);date.setUTCDate(startDate.getUTCDate()+week*7+day);
          const key=date.toISOString().slice(0,10),entry=byDate.get(key),cell=document.createElement("span");
          const inRange=date>=firstDate&&date<=lastDate;
          cell.className="activity-day";cell.dataset.level=entry?String(Math.max(0,Math.min(4,Number(entry.level)||0))):"0";
          if(inRange){const count=Number(entry?.count)||0;cell.title=key+": "+count+" contributions";cell.setAttribute("aria-label",cell.title);if(date.getUTCDate()===1)monthLabels.set(week,new Intl.DateTimeFormat("en",{month:"short",timeZone:"UTC"}).format(date))}
          else{cell.setAttribute("aria-hidden","true");cell.classList.add("is-empty")}
          column.append(cell);
        }
        activityGrid.append(column);
      }
      if(activityMonths)monthLabels.forEach((month,week)=>{const label=document.createElement("span");label.textContent=month;label.style.gridColumn=String(week+1);activityMonths.append(label)});
      if(activityTotal)activityTotal.textContent=total.toLocaleString("en-IN")+" CONTRIBUTIONS";
    };
    try{const cached=JSON.parse(localStorage.getItem(activityKey)||"null");if(cached&&Date.now()-cached.savedAt<60*60*1000)renderActivity(cached.data)}catch{}
    fetch("https://github-contributions-api.jogruber.de/v4/vinithreddybanda?y=last")
      .then(response=>{if(!response.ok)throw new Error("Contribution data unavailable");return response.json()})
      .then(data=>{renderActivity(data);try{localStorage.setItem(activityKey,JSON.stringify({savedAt:Date.now(),data}))}catch{}})
      .catch(()=>{if(!activityGrid.children.length){activityGrid.textContent="Contribution history is temporarily unavailable.";activityGrid.classList.add("activity-unavailable");if(activityTotal)activityTotal.textContent="VIEW ON GITHUB"}})
  }
  const cursor=$(".cursor-follower");if(cursor&&!reduced&&matchMedia("(pointer:fine)").matches){let x=0,y=0,tx=0,ty=0;addEventListener("pointermove",e=>{tx=e.clientX;ty=e.clientY},{passive:true});const move=()=>{x+=(tx-x)*.22;y+=(ty-y)*.22;cursor.style.transform="translate3d("+x+"px,"+y+"px,0)";rafId=requestAnimationFrame(move)};move();$$("a,button,[role=slider]").forEach(el=>{el.addEventListener("pointerenter",()=>cursor.classList.add("is-hover"));el.addEventListener("pointerleave",()=>cursor.classList.remove("is-hover"))})}
  if("PerformanceObserver"in window){try{new PerformanceObserver(list=>{const entry=list.getEntries().at(-1);const el=$("#lcp-value");if(el)el.textContent=(entry.startTime/1000).toFixed(2)+"s"}).observe({type:"largest-contentful-paint",buffered:true})}catch{}}
  let frames=0,last=performance.now();const fps=()=>{frames++;const now=performance.now();if(now-last>=1000){const el=$("#fps-value");if(el)el.textContent=Math.round(frames*1000/(now-last));frames=0;last=now}if(!reduced)requestAnimationFrame(fps)};if(!reduced)requestAnimationFrame(fps);
  const header=$(".masthead");let scrolled=false;addEventListener("scroll",()=>{const next=scrollY>30;if(next!==scrolled){scrolled=next;header?.classList.toggle("is-scrolled",scrolled)}},{passive:true});
  $$("a[href^='#']").forEach(a=>a.addEventListener("click",e=>{const target=$(a.getAttribute("href"));if(target){e.preventDefault();target.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"})}}));
}
document.addEventListener("astro:page-load",initPortfolio);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initPortfolio,{once:true});else initPortfolio();
document.addEventListener("astro:before-swap",()=>{root.dataset.interactionsReady="false";window.__portfolioPresenceSocket?.close();window.__portfolioPresenceSocket=null;if(radioOscillator){try{radioOscillator.stop()}catch{}radioOscillator=null}if(rafId)cancelAnimationFrame(rafId)});
