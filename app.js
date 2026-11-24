(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const menuButton = $(".menu-toggle");
  const mobileMenu = $(".mobile-menu");
  menuButton?.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  $$(".mobile-menu a").forEach(a => a.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }));

  $$(".work-trigger").forEach(trigger => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".work-item");
      const open = !item.classList.contains("open");
      $$(".work-item").forEach(other => {
        other.classList.remove("open");
        $(".work-trigger", other).setAttribute("aria-expanded", "false");
      });
      if (open) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        if (window.gsap && !reduced) gsap.fromTo($(".work-detail", item), {y:24}, {y:0,duration:.65,ease:"power3.out"});
      }
    });
  });

  const cursor = $(".cursor");
  if (matchMedia("(pointer:fine)").matches && cursor) {
    window.addEventListener("pointermove", e => {
      cursor.style.opacity = "1";
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }, {passive:true});
    $$("a,button,.shard,.fragment-piece").forEach(el => {
      el.addEventListener("pointerenter", () => cursor.classList.add("active"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("active"));
    });
  }

  const revealEls = $$(".reveal");
  if (!reduced && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), {threshold:.12});
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add("is-visible"));

  function setupMotion() {
    if (!window.gsap || !window.ScrollTrigger || reduced) {
      document.documentElement.classList.add("motion-fallback");
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(".hero-line", {y:0, duration:1.1, stagger:.12, ease:"power4.out", delay:.15});
    gsap.from(".hero-art .shard", {y:50, rotateX:20, rotateZ:-5, opacity:0, stagger:.1, duration:1.2, ease:"power3.out", delay:.25});
    gsap.from(".hero-art .shard-core", {scale:0, opacity:0, duration:1, ease:"back.out(1.8)", delay:.7});
    gsap.utils.toArray(".manifesto-title .line-mask > span").forEach((line,i) => {
      gsap.from(line, {yPercent:115, duration:1, ease:"power4.out", scrollTrigger:{trigger:line,start:"top 88%"}});
    });
    gsap.from(".manifesto-aside", {y:30, opacity:0, duration:.8, scrollTrigger:{trigger:".manifesto-aside",start:"top 88%"}});
    gsap.from(".approach-item", {y:35,opacity:0,stagger:.15,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".approach-grid",start:"top 82%"}});
    gsap.from(".about-copy", {y:35,opacity:0,duration:.8,scrollTrigger:{trigger:".about-copy",start:"top 85%"}});
    gsap.from(".recognition div", {y:20,opacity:0,stagger:.1,duration:.6,scrollTrigger:{trigger:".recognition",start:"top 90%"}});
    const stage = $("#fragment-visual");
    if (stage && !matchMedia("(max-width:640px)").matches) {
      const pieces = $$(".fragment-piece", stage);
      const count = $("#fragment-count");
      const tl = gsap.timeline({scrollTrigger:{trigger:".deconstruct",start:"top top",end:"+=1350",pin:".deconstruct-layout",scrub:1.1,invalidateOnRefresh:true}});
      tl.fromTo(pieces[0],{x:0,y:0,rotateZ:0},{x:-65,y:-55,rotateZ:-9,ease:"none"},0)
        .fromTo(pieces[1],{x:0,y:0,rotateZ:0},{x:75,y:-80,rotateZ:8,ease:"none"},0)
        .fromTo(pieces[2],{x:0,y:0,rotateZ:0},{x:-90,y:75,rotateZ:7,ease:"none"},0)
        .fromTo(pieces[3],{x:0,y:0,rotateZ:0},{x:90,y:85,rotateZ:-8,ease:"none"},0)
        .fromTo(pieces[4],{x:0,y:0,rotateZ:0},{x:0,y:-8,rotateZ:0,ease:"none"},0)
        .to(".fragment-center",{scale:1.5,opacity:.2,ease:"none"},0)
        .to(pieces,{rotateY:14,filter:"brightness(1.15)",stagger:.04,ease:"none"},.35);
      ScrollTrigger.create({trigger:".deconstruct",start:"top top",end:"+=1350",onUpdate:self=>{
        const n=Math.min(5,Math.max(1,Math.ceil(self.progress*5)));
        count.textContent=String(n).padStart(2,"0");
      }});
    } else if (stage) {
      gsap.from(".fragment-piece",{y:30,opacity:0,stagger:.12,duration:.8,scrollTrigger:{trigger:stage,start:"top 80%"}});
    }
    gsap.from(".work-item",{y:20,opacity:0,stagger:.07,duration:.6,ease:"power2.out",scrollTrigger:{trigger:".work-list",start:"top 82%"}});
    gsap.from(".stack-cloud span",{y:18,opacity:0,stagger:.025,duration:.45,scrollTrigger:{trigger:".stack-cloud",start:"top 88%"}});
    gsap.from(".contact-main > *",{y:35,opacity:0,stagger:.12,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".contact-main",start:"top 85%"}});
  }

  const style=document.createElement("style");
  style.textContent=".reveal.is-visible{opacity:1;transform:none;transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1)}.hero-line{transform:translateY(115%)}.motion-fallback .hero-line{transform:none}.motion-fallback .reveal{opacity:1;transform:none}";
  document.head.appendChild(style);
  const waitForGsap = () => {
    if (window.gsap && window.ScrollTrigger) setupMotion();
    else if (document.readyState !== "complete") window.addEventListener("load",setupMotion,{once:true});
    else setupMotion();
  };
  waitForGsap();
  window.addEventListener("load", () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }, {once:true});
})();