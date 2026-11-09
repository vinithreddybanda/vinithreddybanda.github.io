import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>("[data-site-header]");
if (header) ScrollTrigger.create({start: 36,onEnter:()=>header.classList.add("is-scrolled"),onLeaveBack:()=>header.classList.remove("is-scrolled")});
if (!reduce) {
  const ctx = gsap.context(() => {
    gsap.timeline({defaults:{ease:"power4.out"}})
      .fromTo("[data-hero-intro]",{autoAlpha:0,y:30,filter:"blur(12px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:.8})
      .fromTo("[data-hero-title]",{autoAlpha:0,yPercent:35,filter:"blur(18px)",scale:.97},{autoAlpha:1,yPercent:0,filter:"blur(0px)",scale:1,duration:1.25},"-=.4")
      .fromTo("[data-hero-bottom]",{autoAlpha:0,y:25,filter:"blur(8px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:.8},"-=.5");
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node)=>{
      gsap.fromTo(node,{autoAlpha:0,y:35,filter:"blur(10px)"},{autoAlpha:1,y:0,filter:"blur(0px)",duration:1,ease:"power3.out",clearProps:"all",scrollTrigger:{trigger:node,start:"top 88%",once:true}});
    });
    gsap.utils.toArray<HTMLElement>("[data-project]").forEach((node)=>{
      const visual=node.querySelector(".project-visual");
      if(visual) gsap.fromTo(visual,{clipPath:"inset(8% 5% 8% 5% round 2px)",filter:"blur(8px)"},{clipPath:"inset(0% 0% 0% 0% round 0px)",filter:"blur(0px)",duration:1.2,ease:"power3.out",scrollTrigger:{trigger:node,start:"top 78%",once:true}});
    });
    const manifesto=document.querySelector("[data-manifesto]");
    if(manifesto) gsap.fromTo(manifesto,{y:70,filter:"blur(15px)",autoAlpha:.3},{y:0,filter:"blur(0px)",autoAlpha:1,duration:1.2,ease:"power3.out",scrollTrigger:{trigger:manifesto,start:"top 82%",once:true}});
  });
  window.addEventListener("pagehide",()=>ctx.revert(),{once:true});
}
