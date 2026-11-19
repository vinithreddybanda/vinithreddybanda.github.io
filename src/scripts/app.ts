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