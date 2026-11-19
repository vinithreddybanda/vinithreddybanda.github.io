const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");

function initPage() {
  const reduce = motionQuery.matches;
  const reveal = document.querySelectorAll<HTMLElement>(
    ".project-card, .about-strip-inner, .stack-section, .contact-banner, .about-story, .simple-section, .play-card, .contact-options a"
  );

  if (!reduce && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveal.forEach(el => observer.observe(el));
  } else {
    reveal.forEach(el => el.classList.add("in-view"));
  }

  document.querySelectorAll<HTMLElement>(".project-card").forEach(card => {
    if (card.dataset.motionReady) return;
    card.dataset.motionReady = "true";
    card.addEventListener("pointermove", event => {
      if (motionQuery.matches || coarsePointer.matches) return;
      const pointer = event as PointerEvent;
      const rect = card.getBoundingClientRect();
      const x = (pointer.clientX - rect.left) / rect.width - 0.5;
      const y = (pointer.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${-y * 2.5}deg`);
      card.style.setProperty("--tilt-y", `${x * 3}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  const root = document.documentElement;
  const themeToggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const applyTheme = (theme: "light" | "dark") => {
    root.dataset.theme = theme;
    themeColor?.setAttribute("content", theme === "dark" ? "#171a16" : "#f3f2ed");
    if (themeToggle) {
      const next = theme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
      themeToggle.setAttribute("title", `Switch to ${next} mode`);
    }
  };
  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
  if (themeToggle && !themeToggle.dataset.motionReady) {
    themeToggle.dataset.motionReady = "true";
    themeToggle.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("vinith-theme", next); } catch {}
    });
  }
}

document.addEventListener("astro:page-load", initPage);
if (document.readyState === "complete") initPage();

const root = document.documentElement;
const heroArt = () => document.querySelector<HTMLElement>(".hero-art");
let lastScrollY = window.scrollY;
let lastScrollTime = performance.now();
let velocity = 0;
let direction = 1;
let frame = 0;
let currentBlur = 0;
let currentShift = 0;

function animateMotion() {
  frame = 0;
  const targetBlur = motionQuery.matches ? 0 : Math.min(3.2, Math.abs(velocity) * 0.075);
  const targetShift = motionQuery.matches ? 0 : Math.max(-34, Math.min(34, velocity * -0.42));
  currentBlur += (targetBlur - currentBlur) * 0.18;
  currentShift += (targetShift - currentShift) * 0.14;
  root.style.setProperty("--motion-blur", `${currentBlur.toFixed(2)}px`);
  const art = heroArt();
  if (art) art.style.setProperty("--art-scroll", `${currentShift.toFixed(2)}px`);
  velocity *= 0.82;
  if (Math.abs(velocity) > 0.08 || currentBlur > 0.04 || Math.abs(currentShift) > 0.2) {
    frame = requestAnimationFrame(animateMotion);
  } else {
    currentBlur = 0;
    currentShift = 0;
    root.style.setProperty("--motion-blur", "0px");
    if (art) art.style.setProperty("--art-scroll", "0px");
  }
}

window.addEventListener("scroll", () => {
  if (motionQuery.matches) return;
  const now = performance.now();
  const y = window.scrollY;
  const elapsed = Math.max(8, now - lastScrollTime);
  const delta = y - lastScrollY;
  direction = Math.sign(delta) || direction;
  const instantVelocity = (delta / elapsed) * 16;
  velocity = Math.max(-42, Math.min(42, instantVelocity));
  root.style.setProperty("--scroll-direction", String(direction));
  lastScrollY = y;
  lastScrollTime = now;
  if (!frame) frame = requestAnimationFrame(animateMotion);
}, { passive: true });

window.addEventListener("pointermove", event => {
  if (motionQuery.matches || coarsePointer.matches) return;
  const art = heroArt();
  if (!art) return;
  const rect = art.getBoundingClientRect();
  if (event.clientY < rect.top - 80 || event.clientY > rect.bottom + 80) return;
  const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
  const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
  art.style.setProperty("--pointer-x", `${x.toFixed(2)}px`);
  art.style.setProperty("--pointer-y", `${y.toFixed(2)}px`);
}, { passive: true });

window.addEventListener("pointerout", event => {
  if ((event as PointerEvent).relatedTarget) return;
  const art = heroArt();
  art?.style.setProperty("--pointer-x", "0px");
  art?.style.setProperty("--pointer-y", "0px");
});


const journeyRoot = document.querySelector<HTMLElement>("[data-shape-journey]");
const journeyPrimary = journeyRoot?.querySelector<HTMLElement>(".shape-journey__primary");
const journeySecondary = journeyRoot?.querySelector<HTMLElement>(".shape-journey__secondary");
const journeyOrbit = journeyRoot?.querySelector<HTMLElement>(".shape-journey__orbit");
const journeyFrames = [
  { p: 0, x: 78, y: 24, r: -24, s: 0.82, radius: "38% 62% 57% 43% / 48% 38% 62% 52%" },
  { p: 0.19, x: 18, y: 34, r: 28, s: 1.08, radius: "61% 39% 42% 58% / 43% 57% 38% 62%" },
  { p: 0.43, x: 83, y: 53, r: 76, s: 0.94, radius: "43% 57% 63% 37% / 58% 39% 61% 42%" },
  { p: 0.68, x: 24, y: 70, r: 132, s: 1.12, radius: "56% 44% 36% 64% / 39% 61% 42% 58%" },
  { p: 1, x: 76, y: 84, r: 205, s: 0.9, radius: "39% 61% 54% 46% / 62% 43% 57% 38%" }
];
let journeyProgress = 0;
let journeyTarget = 0;
let journeyRaf = 0;
let journeyPointerX = 0;
let journeyPointerY = 0;

function journeyState(progress: number) {
  let index = 0;
  while (index < journeyFrames.length - 2 && progress > journeyFrames[index + 1].p) index++;
  const from = journeyFrames[index];
  const to = journeyFrames[index + 1];
  const amount = Math.max(0, Math.min(1, (progress - from.p) / (to.p - from.p)));
  const eased = amount * amount * (3 - 2 * amount);
  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased,
    r: from.r + (to.r - from.r) * eased,
    s: from.s + (to.s - from.s) * eased,
    radius: amount < 0.5 ? from.radius : to.radius
  };
}

function renderShapeJourney() {
  journeyRaf = 0;
  if (!journeyRoot || !journeyPrimary || !journeySecondary || !journeyOrbit || motionQuery.matches) return;
  journeyProgress += (journeyTarget - journeyProgress) * 0.105;
  if (Math.abs(journeyTarget - journeyProgress) < 0.0005) journeyProgress = journeyTarget;
  const state = journeyState(journeyProgress);
  const speed = Math.min(1, Math.abs(velocity) / 34);
  const stretchX = 1 + speed * 0.2;
  const stretchY = 1 - speed * 0.13;
  journeyPrimary.style.transform = `translate3d(calc(${state.x}vw + ${journeyPointerX}px), calc(${state.y}vh + ${journeyPointerY}px), 0) translate(-50%, -50%) rotate(${state.r + velocity * 0.16}deg) scale(${state.s * stretchX}, ${state.s * stretchY})`;
  journeyPrimary.style.borderRadius = state.radius;
  journeySecondary.style.transform = `translate3d(calc(${state.x - 9}vw - ${journeyPointerX * 0.45}px), calc(${state.y + 8}vh - ${journeyPointerY * 0.45}px), 0) translate(-50%, -50%) rotate(${-state.r * 0.72}deg) scale(${state.s * 0.64}, ${state.s * 0.78})`;
  journeySecondary.style.borderRadius = state.radius.split(" / ").reverse().join(" / ");
  journeyOrbit.style.transform = `translate3d(${state.x}vw, ${state.y}vh, 0) translate(-50%, -50%) rotate(${state.r - 28}deg) scaleY(.42)`;
  journeyRoot.style.setProperty("--journey-speed", String(speed));
  if (journeyProgress !== journeyTarget) journeyRaf = requestAnimationFrame(renderShapeJourney);
}

function updateJourneyTarget() {
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  journeyTarget = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  if (!journeyRaf && !motionQuery.matches) journeyRaf = requestAnimationFrame(renderShapeJourney);
}

window.addEventListener("scroll", updateJourneyTarget, { passive: true });
window.addEventListener("resize", updateJourneyTarget, { passive: true });
window.addEventListener("pointermove", event => {
  if (motionQuery.matches || coarsePointer.matches || !journeyRoot) return;
  journeyPointerX = (event.clientX / window.innerWidth - 0.5) * 18;
  journeyPointerY = (event.clientY / window.innerHeight - 0.5) * 18;
  if (!journeyRaf) journeyRaf = requestAnimationFrame(renderShapeJourney);
}, { passive: true });
window.addEventListener("pointerout", event => {
  if ((event as PointerEvent).relatedTarget) return;
  journeyPointerX = 0;
  journeyPointerY = 0;
  if (!journeyRaf) journeyRaf = requestAnimationFrame(renderShapeJourney);
});
document.addEventListener("astro:page-load", updateJourneyTarget);
updateJourneyTarget();
