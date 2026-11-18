import { createStore } from "./store";

type Theme = "dark" | "light";
const themeStore = createStore<Theme>("dark");

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
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  themeColor?.setAttribute("content", theme === "dark" ? "#090a0c" : "#f4f4f6");
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
        try { localStorage.setItem("portfolio-theme", next); } catch {}
      };
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if ("startViewTransition" in document && !reduceMotion) {
        (document as Document & { startViewTransition: (callback: () => void) => unknown }).startViewTransition(change);
      } else change();
    });
  });
}

function initialiseHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;
  let previousState = false;
  const update = () => {
    const nextState = window.scrollY > 18;
    if (nextState === previousState) return;
    previousState = nextState;
    header.classList.toggle("is-scrolled", nextState);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initialiseReveals() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!nodes.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
  nodes.forEach((node) => observer.observe(node));
}

document.documentElement.classList.add("js");
initialiseTheme();
initialiseHeader();
initialiseReveals();