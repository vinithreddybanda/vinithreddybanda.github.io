const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const reveal = document.querySelectorAll<HTMLElement>(".project-card, .about-strip-inner, .stack-section, .contact-banner, .about-story, .simple-section, .play-card, .contact-options a");
if (!reduce && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  reveal.forEach(el => observer.observe(el));
} else reveal.forEach(el => el.classList.add("in-view"));
document.querySelectorAll<HTMLElement>(".project-card").forEach(card => {
  card.addEventListener("pointermove", event => {
    if (reduce || matchMedia("(pointer: coarse)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.setProperty("--tilt-x", String(-y * 2.5) + "deg");
    card.style.setProperty("--tilt-y", String(x * 3) + "deg");
  });
  card.addEventListener("pointerleave", () => { card.style.setProperty("--tilt-x","0deg"); card.style.setProperty("--tilt-y","0deg"); });
});
const themeToggle = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
const root = document.documentElement;
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const applyTheme = (theme: "light" | "dark") => {
  root.dataset.theme = theme;
  themeColor?.setAttribute("content", theme === "dark" ? "#141612" : "#f3f2ed");
  if (themeToggle) {
    const next = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${next} mode`);
    themeToggle.setAttribute("title", `Switch to ${next} mode`);
  }
};
applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("vinith-theme", next); } catch {}
});
