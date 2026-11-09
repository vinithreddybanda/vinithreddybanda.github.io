import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>("[data-site-header]");

if (header) {
  if (window.scrollY > 28) header.classList.add("is-scrolled");
  ScrollTrigger.create({
    start: 28,
    onEnter: () => header.classList.add("is-scrolled"),
    onLeaveBack: () => header.classList.remove("is-scrolled"),
  });
}

if (!reducedMotion) {
  const context = gsap.context(() => {
    const hero = gsap.timeline({ defaults: { ease: "power3.out" } });

    hero.fromTo(
      "[data-hero-top]",
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.68 },
    )
      .fromTo(
        "[data-hero-title] .line",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.82, stagger: 0.12 },
        "-=0.38",
      )
      .fromTo(
        "[data-hero-bottom]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.68 },
        "-=0.42",
      );

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
            invalidateOnRefresh: true,
          },
        },
      );
    });
  });

  window.addEventListener("pagehide", () => context.revert(), { once: true });
}