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
  let savedTheme: string | null = null;
  try { savedTheme = localStorage.getItem("vinith-theme"); } catch {}
  applyTheme(savedTheme === "dark" ? "dark" : savedTheme === "light" ? "light" : root.dataset.theme === "dark" ? "dark" : "light");
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



// Preserve the chosen theme before Astro swaps the document, preventing a light-theme flash.
document.addEventListener("astro:before-swap", event => {
  const swapEvent = event as Event & { newDocument: Document };
  let savedTheme: string | null = null;
  try { savedTheme = localStorage.getItem("vinith-theme"); } catch {}
  if (savedTheme === "dark" || savedTheme === "light") {
    swapEvent.newDocument.documentElement.dataset.theme = savedTheme;
  }
});
