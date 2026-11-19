const root = document.documentElement;
const clock = document.querySelector("#local-clock");
const progress = document.querySelector("#read-progress");
const themeButton = document.querySelector(".theme-toggle");
const overlay = document.querySelector("#command-overlay");
const commandInput = document.querySelector("#command-input");
const commandItems = [...document.querySelectorAll("[data-command-item]")];
let activeCommand = 0;
const savedTheme = (()=>{try{return localStorage.getItem("vinith-theme")}catch{return null}})();
if(savedTheme==="light"||savedTheme==="dark") root.dataset.theme=savedTheme;
themeButton?.addEventListener("click",()=>{const next=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=next;try{localStorage.setItem("vinith-theme",next)}catch{}});
function tick(){if(clock)clock.textContent=new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date())}
tick();setInterval(tick,1000);
function updateProgress(){if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+"%"}
addEventListener("scroll",updateProgress,{passive:true});updateProgress();
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".section-index,.intro-grid,.work-heading,.work-object,.manifesto-section,.now-grid,.contact-slab,.profile-file,.letter-layout,.record-row,.skill-cloud span,.recognition-list>div,.lab-row,.writing-row,.studio-row,.case-visual,.case-description,.case-highlights>div,.contact-primary,.contact-details>a").forEach(el=>{el.classList.add("reveal");revealObserver.observe(el)});
function openCommand(){if(!overlay)return;overlay.classList.add("open");overlay.setAttribute("aria-hidden","false");commandInput?.focus();filterCommands()}
function closeCommand(){if(!overlay)return;overlay.classList.remove("open");overlay.setAttribute("aria-hidden","true");if(commandInput)commandInput.value="";filterCommands()}
document.querySelector(".command-trigger")?.addEventListener("click",openCommand);
overlay?.addEventListener("click",e=>{if(e.target===overlay)closeCommand()});
function filterCommands(){const q=(commandInput?.value||"").toLowerCase();let first=-1;commandItems.forEach((item,i)=>{const show=item.textContent.toLowerCase().includes(q);item.hidden=!show;if(show&&first<0)first=i});activeCommand=first<0?0:first;markCommand()}
function markCommand(){const visible=commandItems.filter(x=>!x.hidden);visible.forEach((x,i)=>x.classList.toggle("selected",i===Math.max(0,visible.indexOf(commandItems[activeCommand]))))}
commandInput?.addEventListener("input",filterCommands);
commandInput?.addEventListener("keydown",e=>{const visible=commandItems.filter(x=>!x.hidden);if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const idx=Math.max(0,visible.indexOf(commandItems[activeCommand]));activeCommand=visible[(idx+(e.key==="ArrowDown"?1:-1)+visible.length)%visible.length]===undefined?0:commandItems.indexOf(visible[(idx+(e.key==="ArrowDown"?1:-1)+visible.length)%visible.length]);markCommand()}if(e.key==="Enter"){e.preventDefault();visible.find(x=>x.classList.contains("selected"))?.click()}if(e.key==="Escape")closeCommand()});
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openCommand()}if(e.key==="Escape")closeCommand()});
const wheel=document.querySelector("#work-wheel");
if(wheel){const cards=[...wheel.querySelectorAll("[data-wheel-item]")];const count=document.querySelector("#wheel-count");const controlCount=document.querySelector(".wheel-controls span");let down=false,startX=0,scrollStart=0;const updateWheel=()=>{const center=wheel.scrollLeft+wheel.clientWidth/2;let closest=0,dist=Infinity;cards.forEach((card,i)=>{const d=Math.abs(card.offsetLeft+card.offsetWidth/2-center);if(d<dist){dist=d;closest=i}});const label=String(closest+1).padStart(2,"0")+" / "+String(cards.length).padStart(2,"0");if(count)count.textContent=label;if(controlCount)controlCount.textContent=label};wheel.addEventListener("scroll",()=>requestAnimationFrame(updateWheel),{passive:true});wheel.addEventListener("pointerdown",e=>{down=true;startX=e.clientX;scrollStart=wheel.scrollLeft;wheel.classList.add("dragging");wheel.setPointerCapture(e.pointerId)});wheel.addEventListener("pointermove",e=>{if(down)wheel.scrollLeft=scrollStart-(e.clientX-startX)});const release=()=>{down=false;wheel.classList.remove("dragging")};wheel.addEventListener("pointerup",release);wheel.addEventListener("pointercancel",release);document.querySelector("#wheel-next")?.addEventListener("click",()=>wheel.scrollBy({left:wheel.clientWidth*.78,behavior:"smooth"}));document.querySelector("#wheel-prev")?.addEventListener("click",()=>wheel.scrollBy({left:-wheel.clientWidth*.78,behavior:"smooth"}));updateWheel()}
document.querySelectorAll(".press-wheel").forEach(el=>{let start=0,rotation=0,active=false;el.addEventListener("pointerdown",e=>{active=true;start=e.clientX;el.setPointerCapture(e.pointerId);el.style.animation="none"});el.addEventListener("pointermove",e=>{if(!active)return;rotation+=(e.clientX-start)*.45;start=e.clientX;el.style.transform="rotateX(58deg) rotateZ("+rotation+"deg)"});const stop=()=>{active=false};el.addEventListener("pointerup",stop);el.addEventListener("pointercancel",stop)});
