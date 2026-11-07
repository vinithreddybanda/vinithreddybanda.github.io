import { useEffect, useRef, useState } from "react";

const projects = [
  {
    id: "careschedule",
    number: "01",
    name: "CareSchedule",
    type: "Healthcare platform",
    context: "Cognizant · Internship",
    summary: "A clinic and hospital management platform built around reliable appointment operations.",
    detail: "Designed a six-layer Clean Architecture with .NET, Entity Framework Core, SQL Server, and React. The platform includes 148 REST APIs, 32 controllers, 33 domain entities, and six role-based workflows.",
    highlight: "Intelligent appointment slot generation",
    highlightDetail: "Resolves provider availability, holidays, leave, blackout periods, and resource constraints before publishing appointments, helping prevent double-booking.",
    stack: [".NET", "ASP.NET Core", "React", "EF Core", "SQL Server", "REST APIs"],
    featured: true,
  },
  {
    id: "journalai",
    number: "02",
    name: "JournalAI",
    type: "AI-powered product",
    context: "Personal project",
    summary: "A journaling experience that turns written reflections into structured mood insights.",
    detail: "Built with Next.js, TypeScript, Groq AI, and Supabase. The platform combines secure authentication with PostgreSQL persistence and a cloud deployment workflow.",
    highlight: "End-to-end delivery pipeline",
    highlightDetail: "Set up CI/CD workflows using GitHub Actions and Jenkins, with Docker and Kubernetes for testing, containerization, and deployment on Microsoft Azure.",
    stack: ["Next.js", "TypeScript", "Supabase", "Docker", "Kubernetes", "Azure", "Jenkins"],
  },
  {
    id: "activities",
    number: "03",
    name: "Activities for Discord",
    type: "Android · Native integration",
    context: "Personal project",
    summary: "An Android app that gives users mobile control over Discord Rich Presence.",
    detail: "Built an Android application that extends Rich Presence controls beyond the official Discord mobile client, using a native integration layer with the Discord Partner SDK.",
    highlight: "Persistent native SDK sessions",
    highlightDetail: "Implemented JNI integration for reliable real-time communication, alongside secure authentication, encrypted credential storage, image caching, and foreground/background services.",
    stack: ["Android", "Java", "C++", "JNI", "Discord Partner SDK"],
  },
];

const skillGroups = [
  { label: "Languages", values: ["C#", "Java", "Kotlin", "TypeScript", "JavaScript", "SQL"] },
  { label: "Frameworks", values: ["ASP.NET Core", ".NET", "EF Core", "React", "Next.js", "Node.js"] },
  { label: "Data", values: ["SQL Server", "PostgreSQL", "MongoDB", "Supabase"] },
  { label: "Cloud & delivery", values: ["Docker", "Kubernetes", "GitHub Actions", "Jenkins", "Azure"] },
];

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>;
}

function getClipFromRect(rect, radius) {
  return `inset(${rect.top}px ${window.innerWidth - rect.right}px ${window.innerHeight - rect.bottom}px ${rect.left}px round ${radius})`;
}

function animateProjectMorph(originSurface, destinationSurface, direction = "forward", pageSurfaces = [], detailSurface) {
  const forward = direction === "forward";
  // Deliberately slower, with one continuous travel phase and a soft landing.
  const duration = 1680;
  const springEase = "cubic-bezier(.2,.82,.22,1)";
  const blurPeak = 4.2;
  const morphDelay = forward ? 180 : 300;
  const origins = new Map([...originSurface.querySelectorAll("[data-morph]")].map((node) => [node.dataset.morph, node]));
  const destinations = new Map([...destinationSurface.querySelectorAll("[data-morph]")].map((node) => [node.dataset.morph, node]));
  const animations = [];
  const hiddenOrigins = [];
  const stagedNodes = [];
  const matchedKeys = new Set();
  const sourceRect = originSurface.getBoundingClientRect();
  const destinationRect = destinationSurface.getBoundingClientRect();
  const fullFrame = "inset(0px 0px 0px 0px round 0px)";
  const originClip = getClipFromRect(sourceRect, 8);
  const destinationClip = getClipFromRect(destinationRect, 8);

  if (detailSurface) {
    detailSurface.style.visibility = "visible";
    detailSurface.style.pointerEvents = "none";
    detailSurface.style.backgroundColor = "rgb(23,26,22)";
    detailSurface.style.clipPath = forward ? originClip : fullFrame;
  }

  // Outgoing overview begins moving immediately. On reverse, it remains
  // concealed beneath the detail plane until the plane is almost home.
  pageSurfaces.forEach((surface) => {
    if (!surface) return;
    surface.style.visibility = "visible";
    if (!forward) surface.style.translate = "0 30px";
  });

  origins.forEach((origin, key) => {
    const destination = destinations.get(key);
    if (!destination) return;
    const from = origin.getBoundingClientRect();
    const to = destination.getBoundingClientRect();
    if (!from.width || !from.height || !to.width || !to.height) return;

    const dx = from.left - to.left;
    const dy = from.top - to.top;
    const sx = from.width / to.width;
    const sy = from.height / to.height;
    matchedKeys.add(key);

    // Hide the source counterpart before the destination counterpart starts.
    // Geometry, not opacity, carries the identity across the transition.
    origin.style.visibility = "hidden";
    hiddenOrigins.push(origin);
    destination.style.visibility = "visible";

    animations.push(destination.animate([
      {
        transform: `translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`,
        transformOrigin: "top left",
        filter: "blur(0px)",
        offset: 0,
      },
      {
        transform: `translate3d(${dx * 0.58}px,${dy * 0.58}px,0) scale(${1 + (sx - 1) * 0.58},${1 + (sy - 1) * 0.58})`,
        filter: `blur(${blurPeak}px)`,
        offset: 0.56,
      },
      {
        transform: "translate3d(0,0,0) scale(1.018,1.018)",
        filter: "blur(1.2px)",
        offset: 0.91,
      },
      {
        transform: "translate3d(0,0,0) scale(1,1)",
        filter: "blur(0px)",
        offset: 1,
      },
    ], {
      duration,
      delay: morphDelay,
      easing: springEase,
      fill: "both",
    }));
  });

  // The surface grows from the selected card. Its fill stays close to the
  // card material, avoiding a blank/dark interstitial frame. Reverse contracts
  // the same surface back onto the original card.
  if (detailSurface) {
    animations.push(detailSurface.animate(
      forward
        ? [
            { clipPath: originClip, backgroundColor: "rgb(23,26,22)" },
            { clipPath: fullFrame, backgroundColor: "rgb(21,25,18)" },
          ]
        : [
            { clipPath: fullFrame, backgroundColor: "rgb(21,25,18)" },
            { clipPath: destinationClip, backgroundColor: "rgb(23,26,22)" },
          ],
      {
        duration,
        delay: forward ? 90 : 300,
        easing: springEase,
        fill: "both",
      },
    ));
  }

  // Detail-only content enters only after the surface and shared elements
  // have arrived. In reverse it moves down and clears first, before the
  // shared elements begin travelling back to the card.
  const unmatched = forward ? destinationSurface : originSurface;
  unmatched.querySelectorAll("[data-morph-enter], [data-morph-extra]").forEach((node) => {
    if (node.dataset.morph && matchedKeys.has(node.dataset.morph)) return;
    node.style.visibility = forward ? "hidden" : "visible";
    stagedNodes.push(node);
    animations.push(node.animate(
      forward
        ? [
            { transform: "translate3d(0,20px,0)", filter: `blur(${blurPeak}px)`, visibility: "hidden" },
            { transform: "translate3d(0,20px,0)", filter: `blur(${blurPeak}px)`, visibility: "visible", offset: 0.04 },
            { transform: "translate3d(0,0,0)", filter: "blur(0px)" },
          ]
        : [
            { transform: "translate3d(0,0,0)", filter: "blur(0px)", visibility: "visible" },
            { transform: "translate3d(0,24px,0)", filter: `blur(${blurPeak}px)`, visibility: "hidden" },
          ],
      {
        duration: Math.round(duration * (forward ? 0.22 : 0.24)),
        delay: forward ? Math.round(duration * 0.78) : 0,
        easing: springEase,
        fill: "both",
      },
    ));
  });

  pageSurfaces.forEach((surface) => {
    if (!surface) return;
    animations.push(surface.animate(
      forward
        ? [
            { translate: "0 0", filter: "blur(0px)" },
            { translate: "0 30px", filter: "blur(2.6px)" },
          ]
        : [
            { translate: "0 30px", filter: "blur(2.6px)" },
            { translate: "0 0", filter: "blur(0px)" },
          ],
      {
        duration: Math.round(duration * (forward ? 0.62 : 0.42)),
        delay: forward ? 0 : Math.round(duration * 0.76),
        easing: springEase,
        fill: "both",
      },
    ));
  });

  return Promise.all(animations.map((animation) => animation.finished.catch(() => undefined))).finally(() => {
    animations.forEach((animation) => animation.cancel());
    hiddenOrigins.forEach((node) => { node.style.visibility = ""; });
    stagedNodes.forEach((node) => { node.style.visibility = ""; });
    pageSurfaces.forEach((surface) => {
      if (!surface) return;
      surface.style.removeProperty("filter");
      if (forward) {
        surface.style.translate = "0 30px";
        surface.style.visibility = "hidden";
      } else {
        surface.style.removeProperty("translate");
        surface.style.visibility = "";
      }
    });
    if (detailSurface) {
      detailSurface.style.removeProperty("background-color");
      detailSurface.style.removeProperty("clip-path");
      detailSurface.style.visibility = forward ? "visible" : "hidden";
      detailSurface.style.pointerEvents = forward ? "" : "none";
    }
  });
}
function ProjectCard({ project, onOpen }) {
  const pointer = useRef({ x: 0, y: 0, time: 0 });
  const handlePointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const now = performance.now();
    const previous = pointer.current;
    const elapsed = Math.max(now - previous.time, 1);
    const dx = event.clientX - previous.x;
    const velocity = Math.min(Math.abs(dx / elapsed) / 1.5, 1);
    event.currentTarget.style.setProperty("--velocity-x", String(Math.sign(dx)));
    event.currentTarget.style.setProperty("--velocity-strength", String(velocity));
    pointer.current = { x: event.clientX, y: event.clientY, time: now };
  };
  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--velocity-strength", "0");
  };
  return (
    <button className={`project-card motion-reveal ${project.featured ? "project-card-featured" : ""}`} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onClick={(event) => onOpen(project, event)} type="button">
      <span className="project-card-top">
        <span className="project-number" data-morph="project-index">{project.number} / SELECTED WORK</span>
        <span className="project-open" aria-hidden="true">↗</span>
      </span>
      <span className="project-name" data-morph="title">{project.name}</span>
      <span className="project-type" data-morph="project-type">{project.type} <span>·</span> {project.context}</span>
      <span className="project-summary" data-morph="summary">{project.summary}</span>
      <span className="project-card-bottom">
        <span className="project-stack">{project.stack.slice(0, 4).map((item, index) => <span className="project-stack-item" data-morph={`stack-${index}`} key={item}>{item}</span>)}</span>
        <span className="view-project">Explore project <Arrow /></span>
      </span>
    </button>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const sourceButton = useRef(null);
  const closeButton = useRef(null);
  const detailPanel = useRef(null);
  const mainSurface = useRef(null);
  const sidebarSurface = useRef(null);
  const closing = useRef(false);

  const closeProject = () => {
    if (!selectedProject || closing.current) return;
    closing.current = true;
    const source = sourceButton.current;
    const panel = detailPanel.current;
    const finish = () => {
      setDetailOpen(false);
      setSelectedProject(null);
      closing.current = false;
      sourceButton.current?.focus();
    };
    if (source && panel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animateProjectMorph(panel, source, "backward", [mainSurface.current, sidebarSurface.current], panel).then(finish);
    } else {
      finish();
    }
  };

  useEffect(() => {
    if (!selectedProject) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    if (detailOpen) closeButton.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject, detailOpen]);

  // Gesture energy drives a damped spring. Fast flicks compress the page;
  // sustained swipes remain responsive until the gesture settles.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const root = document.documentElement;
    let previousY = window.scrollY, previousTime = performance.now();
    let energy = 0, springVelocity = 0, direction = 0, frame = 0, intensity = 0;

    const render = () => {
      springVelocity += (energy - intensity) * 0.19;
      springVelocity *= 0.76;
      intensity = Math.max(0, Math.min(1, intensity + springVelocity));
      energy *= 0.91;
      if (energy < 0.004) energy = 0;
      root.style.setProperty("--scroll-blur", `${(intensity * 2.15).toFixed(2)}px`);
      root.style.setProperty("--scroll-squeeze", (intensity * 0.038).toFixed(4));
      root.style.setProperty("--scroll-expand", (intensity * 0.006).toFixed(4));
      root.style.setProperty("--scroll-shift", `${(direction * intensity * 7).toFixed(2)}px`);
      root.style.setProperty("--scroll-skew", `${(direction * intensity * 0.42).toFixed(2)}deg`);
      if (intensity > 0.004 || energy > 0.004 || Math.abs(springVelocity) > 0.004) {
        frame = requestAnimationFrame(render);
      } else {
        intensity = 0;
        ["--scroll-blur","--scroll-squeeze","--scroll-expand","--scroll-shift","--scroll-skew"].forEach((name) => root.style.setProperty(name, "0"));
        root.classList.remove("is-scroll-moving");
        frame = 0;
      }
    };
    const onScroll = () => {
      const now = performance.now(), y = window.scrollY;
      const elapsed = Math.max(now - previousTime, 8), delta = y - previousY;
      previousY = y; previousTime = now;
      if (Math.abs(delta) < 0.5) return;
      direction = Math.sign(delta);
      root.classList.add("is-scroll-moving");
      energy = Math.max(energy, Math.min(Math.abs(delta) / elapsed / 1.45, 1));
      if (!frame) frame = requestAnimationFrame(render);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      ["--scroll-blur","--scroll-squeeze","--scroll-shift","--scroll-skew"].forEach((name) => root.style.removeProperty(name));
    };
  }, []);


  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    if (!("IntersectionObserver" in window)) return undefined;
    const elements = document.querySelectorAll(".motion-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -36px 0px" });
    elements.forEach((element, index) => {
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 42}ms`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const openProject = (project, event) => {
    if (closing.current) return;
    sourceButton.current = event.currentTarget;
    closing.current = true;
    setSelectedProject(project);
    setDetailOpen(false);
    window.requestAnimationFrame(() => {
      const panel = detailPanel.current;
      const source = sourceButton.current;
      if (!panel || !source || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDetailOpen(true);
        closing.current = false;
        closeButton.current?.focus();
        return;
      }
      animateProjectMorph(source, panel, "forward", [mainSurface.current, sidebarSurface.current], panel).then(() => {
        setDetailOpen(true);
        closing.current = false;
        closeButton.current?.focus();
      });
    });
  };

  return (
    <main className="dashboard">
      <aside ref={sidebarSurface} className="sidebar">
        <a className="brand" href="#home" aria-label="Vinith, home">v<span>.</span></a>
        <div className="sidebar-rule" />
        <nav className="side-nav" aria-label="Portfolio sections">
          <a className="side-link active" href="#home"><span>01</span> Overview</a>
          <a className="side-link" href="#work"><span>02</span> Selected work</a>
          <a className="side-link" href="#about"><span>03</span> About</a>
          <a className="side-link" href="#contact"><span>04</span> Contact</a>
        </nav>
        <div className="sidebar-bottom">
          <span className="availability-dot" />
          <span>Open to opportunities</span>
        </div>
      </aside>

      <div ref={mainSurface} className="main-area" id="home">
        <header className="topbar">
          <span className="breadcrumb">PORTFOLIO <span>/</span> OVERVIEW</span>
          <a className="top-link" href="mailto:vinithreddybanda@gmail.com">LET'S TALK <Arrow /></a>
        </header>

        <section className="intro-section motion-reveal">
          <div className="intro-copy">
            <p className="section-kicker"><span className="kicker-line" /> DEVELOPER / BUILDER</p>
            <h1>Making<br /><span>things</span> work.</h1>
            <p className="intro-description">I'm Vinith Reddy Banda, an Information Technology graduate who enjoys building useful software, exploring systems, and connecting ideas to implementation.</p>
            <div className="intro-actions">
              <a className="primary-action" href="#work">Explore my work <span>↓</span></a>
              <a className="text-action" href="https://github.com/vinithreddybanda" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
            </div>
          </div>
          <div className="intro-aside">
            <div className="orbit-mark" aria-hidden="true">
              <div className="orbit orbit-one" /><div className="orbit orbit-two" />
              <span className="orbit-core">V<span>.</span></span>
              <span className="orbit-caption">BUILD / LEARN / REPEAT</span>
            </div>
            <div className="aside-note"><span>BASED IN</span><strong>India</strong></div>
          </div>
        </section>

        <section className="metrics motion-reveal" aria-label="Highlights">
          <div className="metric"><strong>03</strong><span>PROJECTS<br />IN FOCUS</span></div>
          <div className="metric"><strong>148</strong><span>REST APIs<br />IN CARESCHEDULE</span></div>
          <div className="metric"><strong>8.43</strong><span>B.E. CGPA<br />CBIT</span></div>
          <div className="metric"><strong>9.74</strong><span>DIPLOMA CGPA<br />GOVT. POLYTECHNIC</span></div>
        </section>

        <section className="work-section motion-reveal" id="work">
          <div className="section-heading">
            <div><p className="section-kicker">A FEW THINGS I'VE BUILT</p><h2>Selected work<span>.</span></h2></div>
            <span className="section-count">01 — 03</span>
          </div>
          <div className="project-grid">
            {projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={openProject} />)}
          </div>
        </section>

        <section className="about-section motion-reveal" id="about">
          <div className="about-main">
            <p className="section-kicker">THE TOOLKIT</p>
            <h2>Curious by nature.<br /><span>Practical by design.</span></h2>
            <p className="about-copy">From backend architecture to mobile integrations and AI-powered products, I like understanding how the pieces fit together and making them work as one.</p>
          </div>
          <div className="skills-panel">
            {skillGroups.map((group) => (
              <div className="skill-row" key={group.label}>
                <span className="skill-label">{group.label}</span>
                <div className="skill-tags">{group.values.map((value) => <span className="skill-tag" key={value}>{value}</span>)}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="proof-section motion-reveal">
          <div className="proof-column">
            <p className="section-kicker">EDUCATION</p>
            <div className="proof-item"><span className="proof-year">2026</span><div><strong>Chaitanya Bharati Institute of Technology</strong><p>B.E. · Information Technology <span>8.43 CGPA</span></p></div></div>
            <div className="proof-item"><span className="proof-year">2023</span><div><strong>Government Polytechnic, Warangal</strong><p>Diploma · Computer Engineering <span>9.74 CGPA</span></p></div></div>
          </div>
          <div className="proof-column">
            <p className="section-kicker">BEYOND THE BUILD</p>
            <div className="proof-item"><span className="proof-symbol">↗</span><div><strong>IEEE Xplore research publication</strong><p>Multi-Task Graph Attention Network for Kinematic Rehabilitation Exercise Analysis · I3CTCON 2026</p></div></div>
            <div className="proof-item"><span className="proof-symbol">↗</span><div><strong>Open-source Android app</strong><p>WhatsApp Status Saver, published on F-Droid</p></div></div>
            <div className="proof-item"><span className="proof-symbol">↗</span><div><strong>6th place · COSC HackWeek</strong><p>Competitive coding challenge organized by CBIT Open Source Community</p></div></div>
            <div className="proof-item"><span className="proof-symbol">↗</span><div><strong>MongoDB Node.js Certification</strong><p>MongoDB University · Web Development 101, Pupilfirst</p></div></div>
          </div>
        </section>

        <footer className="footer motion-reveal" id="contact">
          <div><p className="section-kicker">HAVE SOMETHING IN MIND?</p><h2>Let's build<br /><span>something useful.</span></h2></div>
          <div className="footer-contact">
            <a href="mailto:vinithreddybanda@gmail.com">vinithreddybanda@gmail.com <Arrow /></a>
            <a href="https://github.com/vinithreddybanda" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
          </div>
          <div className="footer-bottom"><span>© {new Date().getFullYear()} VINITH REDDY BANDA</span><span>DESIGNED TO KEEP EVOLVING.</span></div>
        </footer>
      </div>

      {selectedProject && (
        <section ref={detailPanel} className={`project-detail ${detailOpen ? "is-open" : ""}`} aria-modal="true" role="dialog" aria-labelledby="detail-title">
          <div className="detail-topbar" data-morph-enter><span className="brand detail-brand">v<span>.</span></span><span>PROJECT / {selectedProject.number}</span><button ref={closeButton} className="close-detail" onClick={closeProject} type="button"><span>Close</span> ×</button></div>
          <div className="detail-content">
            <p className="section-kicker" data-morph="project-type">{selectedProject.type} <span>·</span> {selectedProject.context}</p>
            <p className="detail-index" data-morph="project-index">{selectedProject.number} / SELECTED WORK</p>
            <h2 id="detail-title" data-morph="title">{selectedProject.name}<span>.</span></h2>
            <p className="detail-lead" data-morph="summary">{selectedProject.summary}</p>
            <div className="detail-rule" data-morph-enter />
            <div className="detail-description" data-morph-enter><span>OVERVIEW</span><p>{selectedProject.detail}</p></div>
            <div className="detail-description" data-morph-enter><span>ENGINEERING FOCUS</span><div><strong>{selectedProject.highlight}</strong><p>{selectedProject.highlightDetail}</p></div></div>
            <div className="detail-stack"><span className="detail-stack-label" data-morph-enter>TECHNOLOGIES</span><div className="skill-tags">{selectedProject.stack.map((item, index) => <span className="skill-tag" data-morph={index < 4 ? `stack-${index}` : undefined} data-morph-extra={index >= 4 ? "" : undefined} key={item}>{item}</span>)}</div></div>
          </div>
          <div className="detail-footer" data-morph-enter><span>VINITH REDDY BANDA</span><button type="button" onClick={closeProject}>Back to overview ↑</button></div>
        </section>
      )}
    </main>
  );
}
