import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector<HTMLElement>("[data-site-header]");

if (header) {
  ScrollTrigger.create({
    start: 28,
    onEnter: () => header.classList.add("is-scrolled"),
    onLeaveBack: () => header.classList.remove("is-scrolled"),
  });
}

if (!reduceMotion) {
  const context = gsap.context(() => {
    gsap.from("[data-reveal]", {
      autoAlpha: 0,
      y: 22,
      duration: 0.72,
      stagger: 0.075,
      ease: "power3.out",
      clearProps: "opacity,visibility,transform",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        toggleActions: "play none none none",
      },
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]:not(.hero [data-reveal])").forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 18,
        duration: 0.68,
        ease: "power3.out",
        clearProps: "opacity,visibility,transform",
        scrollTrigger: {
          trigger: element,
          start: "top 88%",
          once: true,
        },
      });
    });

    const heroImage = document.querySelector<HTMLElement>(".hero-image img");
    if (heroImage) {
      gsap.fromTo(heroImage, { scale: 1.14 }, {
        scale: 1.035,
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }

    gsap.utils.toArray<HTMLElement>(".project-art").forEach((art) => {
      const object = art.querySelector<HTMLElement>(".art-object");
      if (!object) return;
      gsap.fromTo(object, { yPercent: 8, scale: 0.94 }, {
        yPercent: -5,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: art,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    });
  });

  window.addEventListener("pagehide", () => context.revert(), { once: true });
}

