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
 const cases=[{width:320,route:"/about/"},{width:360,route:"/about/"},{width:375,route:"/about/"},{width:390,route:"/about/"},{width:1024,route:"/"},{width:1440,route:"/"}];
 const failures=[];
 for(const {width,route} of cases){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1,isMobile:width<=430,hasTouch:width<=430});
  await page.goto(host+route,{waitUntil:"domcontentloaded"});await page.waitForTimeout(200);
  const report=await page.evaluate(()=>{const vw=document.documentElement.clientWidth;const offenders=[...document.querySelectorAll("body *")].map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return {tag:el.tagName.toLowerCase(),className:typeof el.className==="string"?el.className:"",id:el.id,left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),position:s.position,transform:s.transform,overflow:s.overflowX}}).filter(x=>x.right>vw+1||x.left< -1).sort((a,b)=>(b.right-vw)-(a.right-vw)).slice(0,30);return {viewport:vw,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,offenders}});
  if(report.document>width+1||report.body>width+1){failures.push({width,route,...report});await page.screenshot({path:"responsive-debug-"+width+".png",fullPage:true})}
  await page.close();
 }
 if(failures.length)throw new Error(JSON.stringify(failures,null,2));
 console.log("Diagnostic widths passed.");
}finally{await browser?.close();server.kill()}
