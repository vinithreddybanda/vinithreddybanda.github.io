import { createStore } from "./store";

type Theme = "dark" | "light";
const themeStore = createStore<Theme>("dark");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll<HTMLElement>("[data-theme-label]").forEach((label) => {
    label.textContent = theme === "dark" ? "Light" : "Dark";
  });
  document.querySelectorAll<HTMLElement>("[data-theme-icon]").forEach((icon) => {
    icon.textContent = theme === "dark" ? "☼" : "☾";
  });
  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light appearance" : "Switch to dark appearance");
  });
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#090a0c" : "#f4f5f2");
}

function initialiseTheme() {
  let saved: Theme | null = null;
  try {
    const value = localStorage.getItem("portfolio-theme");
    if (value === "dark" || value === "light") saved = value;
  } catch { saved = null; }
  const preferred: Theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  themeStore.set(saved ?? preferred);
  applyTheme(themeStore.get());

  document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = themeStore.get() === "dark" ? "light" : "dark";
      const change = () => {
        themeStore.set(next);
        applyTheme(next);
        try { localStorage.setItem("portfolio-theme", next); } catch { /* Storage can be unavailable. */ }
      };
      const transitionDocument = document as Document & { startViewTransition?: (callback: () => void) => unknown };
      if (transitionDocument.startViewTransition && !reduceMotion.matches) transitionDocument.startViewTransition(change);
      else change();
    });
  });
}

function initialiseDock() {
  const dock = document.querySelector<HTMLElement>("[data-dock]");
  if (!dock) return;

  let lastY = window.scrollY;
  let frame = 0;
  const show = () => dock.classList.remove("is-hidden");
  const update = () => {
    const y = Math.max(0, window.scrollY);
    const delta = y - lastY;
    if (y < 100 || delta < -5) show();
    else if (delta > 7 && y > 150) dock.classList.add("is-hidden");
    lastY = y;
    frame = 0;
  };
  window.addEventListener("scroll", () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  }, { passive: true });
  dock.addEventListener("focusin", show);
  dock.addEventListener("pointerenter", show);
  dock.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => link.addEventListener("click", show));
}

function initialiseReveals() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!nodes.length) return;
  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  nodes.forEach((node) => observer.observe(node));
}

document.documentElement.classList.add("js");
initialiseTheme();
initialiseDock();
initialiseReveals();
