import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>("[data-site-header]");
const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");

if (header) {
  ScrollTrigger.create({
    start: 24,
    onEnter: () => header.classList.add("is-scrolled"),
    onLeaveBack: () => header.classList.remove("is-scrolled"),
  });
}
if (progress) {
  gsap.to(progress, {
    scaleX: 1, ease: "none",
    scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.25 },
  });
}

if (!reduce) {
  const ctx = gsap.context(() => {
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro.fromTo("[data-hero-top]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .7 })
      .fromTo("[data-hero-title] .hero-line", { autoAlpha: 0, yPercent: 115, rotate: 2 }, { autoAlpha: 1, yPercent: 0, rotate: 0, duration: .95, stagger: .13, clearProps: "transform" }, "-=.35")
      .fromTo("[data-hero-bottom]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: .7 }, "-=.45");
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((node) => {
      gsap.fromTo(node, { autoAlpha: 0, y: 24, filter: "blur(5px)" }, {
        autoAlpha: 1, y: 0, filter: "blur(0px)", duration: .85, ease: "power3.out",
        clearProps: "transform,opacity,visibility,filter",
        scrollTrigger: { trigger: node, start: "top 86%", once: true },
      });
    });
    gsap.utils.toArray<HTMLElement>(".project-art").forEach((art) => {
      gsap.fromTo(art, { scale: .96 }, { scale: 1, ease: "none", scrollTrigger: { trigger: art, start: "top bottom", end: "bottom top", scrub: .6 } });
    });
  });
  window.addEventListener("pagehide", () => ctx.revert(), { once: true });
}
