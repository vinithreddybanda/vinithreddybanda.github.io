import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>("[data-site-header]");
if (header) ScrollTrigger.create({start: 24,onEnter:()=>header.classList.add("is-scrolled"),onLeaveBack:()=>header.classList.remove("is-scrolled")});
if (!reduce) {
  const ctx = gsap.context(() => {
    gsap.fromTo(".hero-copy > *",{autoAlpha:0,y:24,filter:"blur(8px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:.85,stagger:.12,ease:"power3.out",clearProps:"all"});
    gsap.fromTo(".hero-art",{autoAlpha:0,y:28,scale:.97,filter:"blur(10px)"},{autoAlpha:1,y:0,scale:1,filter:"blur(0px)",duration:1.1,delay:.25,ease:"power3.out",clearProps:"all"});
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node)=>{
      gsap.fromTo(node,{autoAlpha:0,y:24,filter:"blur(7px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:.8,ease:"power3.out",clearProps:"all",scrollTrigger:{trigger:node,start:"top 90%",once:true}});
    });
  });
  window.addEventListener("pagehide",()=>ctx.revert(),{once:true});
}
