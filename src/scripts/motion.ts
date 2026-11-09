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

  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
    gsap.from(element, { y: 34, autoAlpha: 0, filter: "blur(7px)", duration: 0.78, ease: "power3.out", clearProps: "filter,transform,opacity,visibility", scrollTrigger: { trigger: element, start: "top 87%", once: true } });
  });

  gsap.utils.toArray<HTMLElement>("[data-project-scene]").forEach((scene) => {
    const world = scene.querySelector<HTMLElement>(".chapter-atmosphere");
    const copy = scene.querySelector<HTMLElement>(".chapter-copy");
    const art = scene.querySelectorAll<HTMLElement>(".journal-seed,.signal-beacon,.memory-orb");
    const rings = scene.querySelectorAll<HTMLElement>(".journal-orbit,.signal-ring,.memory-ribbon");
    if (world) gsap.to(world, { yPercent: 9, scale: 1.12, ease: "none", scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1.1 } });
    if (copy) gsap.from(copy, { y: 52, autoAlpha: 0, filter: "blur(12px)", duration: 1, ease: "power3.out", clearProps: "filter,transform,opacity,visibility", scrollTrigger: { trigger: scene, start: "top 65%", once: true } });
    if (art.length) gsap.fromTo(art, { scale: 0.72, autoAlpha: 0, filter: "blur(22px)" }, { scale: 1, autoAlpha: 1, filter: "blur(0px)", duration: 1.35, stagger: 0.12, ease: "expo.out", clearProps: "filter,opacity,visibility,transform", scrollTrigger: { trigger: scene, start: "top 68%", once: true } });
    if (rings.length) gsap.fromTo(rings, { scale: 0.84, rotate: -8, autoAlpha: 0.25 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.5, stagger: 0.08, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: { trigger: scene, start: "top 70%", once: true } });
  });
});
window.addEventListener("pagehide", () => context.revert(), { once: true });
