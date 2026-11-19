import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
const host="http://127.0.0.1:4321";
const server=spawn("npm",["run","preview","--","--host","127.0.0.1","--port","4321"],{stdio:"ignore",shell:process.platform==="win32"});
let browser;
try{
 let ready=false;for(let i=0;i<40;i++){try{const r=await fetch(host);if(r.ok){ready=true;break}}catch{}await delay(500)}
 if(!ready)throw new Error("Astro preview did not start.");
 browser=await chromium.launch({headless:true});
 const routes=["/","/about/","/lab/","/writing/","/studio/","/contact/","/studio/simp-music/","/studio/status-saver/","/studio/journal-ai/","/studio/care-schedule/","/studio/livevoicex/","/studio/nexus-ai/"];
 const widths=[320,360,375,390,430,768,820,1024,1440],failures=[];
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,isMobile:width<=430,hasTouch:width<=430});
  for(const route of routes){
   const response=await page.goto(host+route,{waitUntil:"domcontentloaded"});
   if(!response?.ok()){failures.push(width+"px "+route+": HTTP "+response?.status());continue}
   await page.waitForTimeout(150);
   const m=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
   if(m.document>m.viewport+1||m.body>m.viewport+1){
    failures.push(width+"px "+route+": horizontal overflow (viewport="+m.viewport+", document="+m.document+", body="+m.body+")");
    await page.screenshot({path:"responsive-failure-"+width+"-"+route.replaceAll("/","_")+".png",fullPage:true});
   }
  }
  await page.close();
 }
 if(failures.length)throw new Error("Responsive layout failures:\n"+failures.join("\n"));
 console.log("Responsive check passed: "+routes.length+" routes × "+widths.length+" viewport widths.");
}finally{await browser?.close();server.kill()}
