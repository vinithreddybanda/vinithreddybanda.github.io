import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rail = document.querySelector<HTMLElement>("[data-site-rail]");
const garden = document.querySelector<HTMLElement>(".garden");
const canvas = document.querySelector<HTMLCanvasElement>(".wind-canvas");

const context = gsap.context(() => {
  if (rail) {
    ScrollTrigger.create({ start: 42, onEnter: () => rail.classList.add("is-scrolled"), onLeaveBack: () => rail.classList.remove("is-scrolled") });
  }

  if (!reducedMotion && garden) {
    gsap.from(".garden-copy [data-intro]", { autoAlpha: 0, y: 28, duration: 1.1, stagger: 0.14, ease: "power4.out", clearProps: "opacity,visibility,transform" });
    const camera = gsap.timeline({ scrollTrigger: { trigger: garden, start: "top top", end: "bottom bottom", scrub: 1.15 } });
    camera
      .to(".forest-layer--far", { scale: 1.42, yPercent: -7, ease: "none" }, 0)
      .to(".forest-layer--focus", { scale: 1.27, yPercent: -11, ease: "none" }, 0)
      .to(".forest-foreground", { yPercent: 19, scale: 1.08, transformOrigin: "center bottom", ease: "none" }, 0)
      .to(".forest-light", { scale: 1.2, yPercent: -8, ease: "none" }, 0)
      .to(".garden-copy", { yPercent: -48, autoAlpha: 0, ease: "none" }, 0)
      .to(".garden-coordinate, .garden-scroll", { autoAlpha: 0, ease: "none" }, 0.12);
  }

  gsap.utils.toArray<HTMLElement>("[data-reveal], [data-project]").forEach((element) => {
    if (reducedMotion) return;
    gsap.from(element, { autoAlpha: 0, y: 26, duration: 0.82, ease: "power3.out", clearProps: "opacity,visibility,transform", scrollTrigger: { trigger: element, start: "top 86%", once: true } });
  });

  if (!reducedMotion && !window.matchMedia("(pointer: coarse)").matches) {
    const world = document.querySelector<HTMLElement>("[data-forest-world]");
    const focusLayer = document.querySelector<HTMLElement>("[data-camera='focus']");
    if (world && focusLayer) {
      const moveX = gsap.quickTo(focusLayer, "x", { duration: 1.4, ease: "power3.out" });
      const moveY = gsap.quickTo(focusLayer, "y", { duration: 1.4, ease: "power3.out" });
      world.addEventListener("pointermove", (event) => {
        const bounds = world.getBoundingClientRect();
        moveX(((event.clientX - bounds.left) / bounds.width - 0.5) * -16);
        moveY(((event.clientY - bounds.top) / bounds.height - 0.5) * -12);
      }, { passive: true });
      world.addEventListener("pointerleave", () => { moveX(0); moveY(0); }, { passive: true });
    }
  }
});

if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (ctx) {
    let width = 0, height = 0, frame = 0, active = false;
    const count = window.matchMedia("(max-width: 700px)").matches ? 12 : 24;
    const leaves = Array.from({ length: count }, () => ({ x: Math.random(), y: Math.random(), size: 3 + Math.random() * 5, speed: 0.00045 + Math.random() * 0.0007, drift: 0.00025 + Math.random() * 0.00045, rotation: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.012, phase: Math.random() * Math.PI * 2 }));
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = bounds.width; height = bounds.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = () => {
      if (!active) return;
      ctx.clearRect(0, 0, width, height);
      for (const leaf of leaves) {
        leaf.y += leaf.speed;
        leaf.x += leaf.drift + Math.sin(leaf.phase + leaf.y * 8) * 0.00035;
        leaf.rotation += leaf.spin;
        if (leaf.y > 1.08) { leaf.y = -0.08; leaf.x = Math.random(); }
        if (leaf.x > 1.08) leaf.x = -0.08;
        if (leaf.x < -0.08) leaf.x = 1.08;
        ctx.save(); ctx.translate(leaf.x * width, leaf.y * height); ctx.rotate(leaf.rotation);
        ctx.globalAlpha = 0.18 + (1 - leaf.y) * 0.22; ctx.fillStyle = "#d6dfb4";
        ctx.beginPath(); ctx.moveTo(0, -leaf.size * 1.7); ctx.quadraticCurveTo(leaf.size * 1.8, -leaf.size * 0.4, 0, leaf.size * 1.7); ctx.quadraticCurveTo(-leaf.size * 1.8, -leaf.size * 0.4, 0, -leaf.size * 1.7); ctx.fill(); ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !frame) draw();
      if (!active && frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: 0 });
    resize(); observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => { observer.disconnect(); cancelAnimationFrame(frame); }, { once: true });
  }
}
window.addEventListener("pagehide", () => context.revert(), { once: true });
