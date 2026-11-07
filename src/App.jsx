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
        <span className="project-number">{project.number} / SELECTED WORK</span>
        <span className="project-open" aria-hidden="true">↗</span>
      </span>
      <span className="project-name">{project.name}</span>
      <span className="project-type">{project.type} <span>·</span> {project.context}</span>
      <span className="project-summary">{project.summary}</span>
      <span className="project-card-bottom">
        <span>{project.stack.slice(0, 4).join("  ·  ")}</span>
        <span className="view-project">Explore project <Arrow /></span>
      </span>
    </button>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: "50vw", y: "50vh" });
  const closeTimer = useRef(null);
  const sourceButton = useRef(null);
  const closeButton = useRef(null);

  const closeProject = () => {
    setDetailOpen(false);
    closeTimer.current = window.setTimeout(() => {
      setSelectedProject(null);
      sourceButton.current?.focus();
    }, 520);
  };

  useEffect(() => {
    if (!selectedProject) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeProject();
    };
    window.addEventListener("keydown", handleKeyDown);
    closeButton.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // Scroll-velocity response: native scrolling stays in control; the visual layer
  // briefly stretches and softens with swipe speed, then settles with a damped spring.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const root = document.documentElement;
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let target = 0;
    let strength = 0;
    let direction = 0;
    let frame = 0;

    const render = () => {
      strength += (target - strength) * 0.32;
      target *= 0.76;
      if (target < 0.002) target = 0;

      root.style.setProperty("--scroll-blur", `${(strength * 1.05).toFixed(3)}px`);
      root.style.setProperty("--scroll-stretch", (strength * 0.006).toFixed(4));
      root.style.setProperty("--scroll-shift", `${(strength * 2.2).toFixed(2)}px`);
      root.style.setProperty("--scroll-direction", String(direction));
      root.style.setProperty("--scroll-origin", direction > 0 ? "top" : "bottom");

      if (strength > 0.003 || target > 0.003) {
        frame = window.requestAnimationFrame(render);
      } else {
        strength = 0;
        root.style.setProperty("--scroll-blur", "0px");
        root.style.setProperty("--scroll-stretch", "0");
        root.style.setProperty("--scroll-shift", "0px");
        root.classList.remove("is-scroll-moving");
        frame = 0;
      }
    };

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const elapsed = Math.max(now - previousTime, 8);
      const delta = y - previousY;
      previousY = y;
      previousTime = now;
      if (Math.abs(delta) < 0.5) return;

      direction = Math.sign(delta);
      root.classList.add("is-scroll-moving");
      const velocity = Math.abs(delta) / elapsed;
      target = Math.min(velocity / 1.15, 1);
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.style.removeProperty("--scroll-blur");
      root.style.removeProperty("--scroll-stretch");
      root.style.removeProperty("--scroll-shift");
      root.style.removeProperty("--scroll-direction");
      root.style.removeProperty("--scroll-origin");
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
    window.clearTimeout(closeTimer.current);
    sourceButton.current = event.currentTarget;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    setOrigin({ x: `${x}px`, y: `${y}px` });
    setSelectedProject(project);
    setDetailOpen(false);
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => setDetailOpen(true)));
  };

  return (
    <main className="dashboard">
      <aside className="sidebar">
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

      <div className="main-area" id="home">
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
        <section className={`project-detail ${detailOpen ? "is-open" : ""}`} style={{ "--origin-x": origin.x, "--origin-y": origin.y }} aria-modal="true" role="dialog" aria-labelledby="detail-title">
          <div className="detail-topbar"><span className="brand detail-brand">v<span>.</span></span><span>PROJECT / {selectedProject.number}</span><button ref={closeButton} className="close-detail" onClick={closeProject} type="button"><span>Close</span> ×</button></div>
          <div className="detail-content">
            <p className="section-kicker">{selectedProject.type} <span>·</span> {selectedProject.context}</p>
            <p className="detail-index">SELECTED WORK / {selectedProject.number}</p>
            <h2 id="detail-title">{selectedProject.name}<span>.</span></h2>
            <p className="detail-lead">{selectedProject.summary}</p>
            <div className="detail-rule" />
            <div className="detail-description"><span>OVERVIEW</span><p>{selectedProject.detail}</p></div>
            <div className="detail-description"><span>ENGINEERING FOCUS</span><div><strong>{selectedProject.highlight}</strong><p>{selectedProject.highlightDetail}</p></div></div>
            <div className="detail-stack"><span>TECHNOLOGIES</span><div className="skill-tags">{selectedProject.stack.map((item) => <span className="skill-tag" key={item}>{item}</span>)}</div></div>
          </div>
          <div className="detail-footer"><span>VINITH REDDY BANDA</span><button type="button" onClick={closeProject}>Back to overview ↑</button></div>
        </section>
      )}
    </main>
  );
}
