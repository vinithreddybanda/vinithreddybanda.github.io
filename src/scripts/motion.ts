import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const nav = document.querySelector<HTMLElement>("[data-floating-nav]");
const hero = document.querySelector<HTMLElement>("[data-hero-scene]");

const context = gsap.context(() => {
  if (nav) {
    ScrollTrigger.create({
      start: 24,
      onEnter: () => nav.classList.add("is-scrolled"),
      onLeaveBack: () => nav.classList.remove("is-scrolled"),
    });
  }

  if (reducedMotion) return;

  if (hero) {
    gsap.from("[data-hero-in]", {
      y: 24,
      autoAlpha: 0,
      filter: "blur(7px)",
      duration: 0.9,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "filter,transform,opacity,visibility",
    });
    gsap.to("[data-hero-photo]", {
      yPercent: 8,
      scale: 1.08,
      ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 1 },
    });
  }

  gsap.utils.toArray<HTMLElement>("[data-reveal], [data-project-row]").forEach((element) => {
    gsap.from(element, {
      y: 26,
      autoAlpha: 0,
      filter: "blur(5px)",
      duration: 0.8,
      ease: "power3.out",
      clearProps: "filter,transform,opacity,visibility",
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
  });

  gsap.utils.toArray<HTMLElement>(".project-art").forEach((art) => {
    gsap.from(art, {
      scale: 0.94,
      rotate: -3,
      autoAlpha: 0,
      duration: 1,
      ease: "power3.out",
      clearProps: "transform,opacity,visibility",
      scrollTrigger: { trigger: art, start: "top 88%", once: true },
    });
  });
});

window.addEventListener("pagehide", () => context.revert(), { once: true });
