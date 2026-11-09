import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header=document.querySelector<HTMLElement>("[data-site-header]");
if(!reduce){
 const ctx=gsap.context(()=>{
  gsap.fromTo(".hero-top, .hero-kicker, .hero h1, .hero-bottom, .hero-rule",{autoAlpha:0,y:18,filter:"blur(5px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:.75,stagger:.09,ease:"power3.out",clearProps:"all"});
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(node=>gsap.fromTo(node,{autoAlpha:0,y:18,filter:"blur(4px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:.7,ease:"power2.out",clearProps:"all",scrollTrigger:{trigger:node,start:"top 91%",once:true}}));
 });
 window.addEventListener("pagehide",()=>ctx.revert(),{once:true});
}
if(header) ScrollTrigger.create({start:30,onEnter:()=>header.classList.add("is-scrolled"),onLeaveBack:()=>header.classList.remove("is-scrolled")});
