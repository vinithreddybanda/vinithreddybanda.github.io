const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");

type AstroNavigationEvent = Event & {
  direction?: "forward" | "back";
  navigationType?: string;
  newDocument?: Document;
};

function initPage() {
  const reveal = document.querySelectorAll<HTMLElement>(
    ".project-card, .about-strip-inner, .stack-section, .contact-banner, .about-story, .simple-section, .play-card, .contact-options a"
  );

  if (motionQuery.matches || !("IntersectionObserver" in window)) {
    reveal.forEach(el => el.classList.add("in-view"));
  } else {
    reveal.forEach(el => {
      if (el.dataset.revealReady) return;
      el.dataset.revealReady = "true";
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      observer.observe(el);
    });
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
      card.style.setProperty("--tilt-x", `${-y * 1.5}deg`);
      card.style.setProperty("--tilt-y", `${x * 1.8}deg`);
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

document.addEventListener("astro:before-preparation", event => {
  const navigation = event as AstroNavigationEvent;
  document.documentElement.dataset.navDirection = navigation.direction === "back" ? "back" : "forward";
});

document.addEventListener("astro:before-swap", event => {
  const navigation = event as AstroNavigationEvent;
  const newDocument = navigation.newDocument;
  if (!newDocument) return;

  let savedTheme: string | null = null;
  try { savedTheme = localStorage.getItem("vinith-theme"); } catch {}
  if (savedTheme === "dark" || savedTheme === "light") {
    newDocument.documentElement.dataset.theme = savedTheme;
  }
  newDocument.documentElement.dataset.navDirection =
    navigation.direction === "back" ? "back" : document.documentElement.dataset.navDirection || "forward";
});

document.addEventListener("astro:page-load", initPage);
if (document.readyState === "complete") initPage();
