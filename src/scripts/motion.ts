import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.querySelector<HTMLElement>("[data-floating-nav]");
const hero = document.querySelector<HTMLElement>("[data-hero-scene]");

const context = gsap.context(() => {
  if (nav) ScrollTrigger.create({ start: 24, onEnter: () => nav.classList.add("is-scrolled"), onLeaveBack: () => nav.classList.remove("is-scrolled") });
  if (reducedMotion) return;
  if (hero) {
    gsap.from("[data-hero-in]", { y: 30, autoAlpha: 0, filter: "blur(9px)", duration: 1.05, stagger: 0.13, ease: "power3.out", clearProps: "filter,transform,opacity,visibility" });
    gsap.to("[data-hero-photo]", { yPercent: 13, scale: 1.12, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.8 } });
  }
  gsap.utils.toArray<HTMLElement>("[data-reveal], [data-project]").forEach((element) => {
    gsap.from(element, { y: 34, autoAlpha: 0, filter: "blur(7px)", duration: 0.78, ease: "power3.out", clearProps: "filter,transform,opacity,visibility", scrollTrigger: { trigger: element, start: "top 87%", once: true } });
  });
  gsap.utils.toArray<HTMLElement>(".project-visual").forEach((element) => {
    gsap.fromTo(element, { y: 22, scale: 0.97 }, { y: -12, scale: 1, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: 1 } });
  });
});
window.addEventListener("pagehide", () => context.revert(), { once: true });
