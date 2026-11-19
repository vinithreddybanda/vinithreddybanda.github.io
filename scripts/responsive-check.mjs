import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
const host="http://127.0.0.1:4321";
const server=spawn("npm",["run","preview","--","--host","127.0.0.1","--port","4321"],{stdio:"ignore"});
let browser;
try{
 let ready=false;for(let i=0;i<40;i++){try{const r=await fetch(host);if(r.ok){ready=true;break}}catch{}await delay(500)}
 if(!ready)throw new Error("Astro preview did not start.");
 browser=await chromium.launch({headless:true});
 const routes=["/","/about/","/lab/","/writing/","/studio/","/contact/","/studio/simp-music/","/studio/status-saver/","/studio/journal-ai/","/studio/care-schedule/","/studio/livevoicex/","/studio/nexus-ai/"];
 const widths=[320,360,375,390,430,768,820,900,1024,1280,1440],failures=[];let screenshotCaptured=false;
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,isMobile:width<=430,hasTouch:width<=430});
  for(const route of routes){
   const response=await page.goto(host+route,{waitUntil:"domcontentloaded"});
   if(!response?.ok()){failures.push(width+"px "+route+": HTTP "+response?.status());continue}
   await page.waitForTimeout(100);
   const report=await page.evaluate(()=>{const vw=document.documentElement.clientWidth;const offenders=[...document.querySelectorAll("body *")].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName.toLowerCase(),className:typeof el.className==="string"?el.className:"",id:el.id,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),position:s.position,overflow:s.overflowX}}).filter(x=>x.right>vw+1||x.left< -1).filter(x=>!x.className.includes("rotation-track")&&!x.className.includes("work-object")&&!x.className.includes("object-art")&&!x.className.includes("object-caption")&&!x.className.includes("remote-cursor")).slice(0,8);return {viewport:vw,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,offenders}});
   if(report.document>report.viewport+1||report.body>report.viewport+1){
    failures.push(width+"px "+route+": overflow "+report.document+"/"+report.body+"; "+JSON.stringify(report.offenders));
    if(!screenshotCaptured){await page.screenshot({path:"responsive-failure-"+width+".png",fullPage:true});screenshotCaptured=true}
   }
  }
  await page.close();
 }
 if(failures.length)throw new Error("Responsive layout failures:\n"+failures.join("\n"));
 console.log("Responsive check passed: "+routes.length+" routes × "+widths.length+" viewport widths.");
}finally{await browser?.close();server.kill()}
