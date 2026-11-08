import { useEffect } from "react";

const projects = [
  {
    number: "01",
    name: "CareSchedule",
    type: "Healthcare platform · Cognizant internship",
    summary: "A clinic and hospital management platform built around reliable appointment operations.",
    detail: "Designed a six-layer Clean Architecture with .NET, Entity Framework Core, SQL Server, and React. The platform includes 148 REST APIs, 32 controllers, 33 domain entities, and six role-based workflows.",
    highlight: "Intelligent appointment slot generation",
    highlightDetail: "Resolves provider availability, holidays, leave, blackout periods, and resource constraints before publishing appointments, helping prevent double-booking.",
    stack: [".NET", "ASP.NET Core", "React", "EF Core", "SQL Server", "REST APIs"],
  },
  {
    number: "02",
    name: "JournalAI",
    type: "AI-powered product · Personal project",
    summary: "A journaling experience that turns written reflections into structured mood insights.",
    detail: "Built with Next.js, TypeScript, Groq AI, and Supabase. The platform combines secure authentication with PostgreSQL persistence and a cloud deployment workflow.",
    highlight: "End-to-end delivery pipeline",
    highlightDetail: "Set up CI/CD workflows using GitHub Actions and Jenkins, with Docker and Kubernetes for testing, containerization, and deployment on Microsoft Azure.",
    stack: ["Next.js", "TypeScript", "Supabase", "Docker", "Kubernetes", "Azure", "Jenkins"],
  },
  {
    number: "03",
    name: "Activities for Discord",
    type: "Android · Native integration · Personal project",
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
  return <span aria-hidden="true">↗</span>;
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <p className="eyebrow">{project.number} / SELECTED WORK</p>
      <h3>{project.name}</h3>
      <p className="project-type">{project.type}</p>
      <p className="project-summary">{project.summary}</p>
      <div className="project-detail">
        <p>{project.detail}</p>
        <h4>{project.highlight}</h4>
        <p>{project.highlightDetail}</p>
      </div>
      <div className="tags">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
    </article>
  );
}

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let frameTime = previousTime;
    let scrollVelocity = 0;
    let blur = 0;
    let blurVelocity = 0;
    let drift = 0;
    let driftVelocity = 0;
    let frame = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const animate = (now) => {
      const delta = Math.min((now - frameTime) / 1000, 0.032);
      frameTime = now;

      // Let the measured scroll impulse decay, then spring both visual channels
      // back to rest. This keeps the effect continuous without a permanent RAF.
      scrollVelocity *= Math.exp(-delta / 0.11);
      const targetBlur = Math.min((Math.abs(scrollVelocity) / 1800) * 1.5, 1.5);
      const targetDrift = clamp(-scrollVelocity * 0.002, -5, 5);
      const stiffness = 220;
      const damping = 29;

      blurVelocity += ((targetBlur - blur) * stiffness - blurVelocity * damping) * delta;
      blur += blurVelocity * delta;
      driftVelocity += ((targetDrift - drift) * stiffness - driftVelocity * damping) * delta;
      drift += driftVelocity * delta;

      root.style.setProperty("--scroll-blur", `${Math.max(0, blur).toFixed(3)}px`);
      root.style.setProperty("--scroll-drift", `${drift.toFixed(3)}px`);

      const settled =
        Math.abs(scrollVelocity) < 0.5 &&
        Math.abs(blur) < 0.008 &&
        Math.abs(blurVelocity) < 0.025 &&
        Math.abs(drift) < 0.02 &&
        Math.abs(driftVelocity) < 0.05;

      if (settled) {
        blur = drift = blurVelocity = driftVelocity = scrollVelocity = 0;
        root.style.setProperty("--scroll-blur", "0px");
        root.style.setProperty("--scroll-drift", "0px");
        root.classList.remove("is-scroll-moving");
        frame = 0;
        return;
      }

      frame = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(now - previousTime, 8);
      scrollVelocity = clamp(((window.scrollY - previousY) / elapsed) * 1000, -3200, 3200);
      previousY = window.scrollY;
      previousTime = now;

      root.classList.add("is-scroll-moving");
      if (!frame) {
        frameTime = now;
        frame = requestAnimationFrame(animate);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("is-scroll-moving");
      root.style.removeProperty("--scroll-blur");
      root.style.removeProperty("--scroll-drift");
    };
  }, []);

  return (
    <>
      <main className="site-shell" id="home">
      <header className="site-header">
        <a className="brand" href="#home">vinith<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-contact" href="mailto:vinithreddybanda@gmail.com">Let's talk <Arrow /></a>
      </header>

      <section className="hero">
        <p className="eyebrow">DEVELOPER / BUILDER <span>·</span> INDIA</p>
        <h1>Making things<br />work<span>.</span></h1>
        <div className="hero-bottom">
          <p>I'm Vinith Reddy Banda, an Information Technology graduate who enjoys building useful software, exploring systems, and connecting ideas to implementation.</p>
          <a className="text-link" href="#work">Explore my work ↓</a>
        </div>
      </section>

      <section className="metrics" aria-label="Highlights">
        <div><strong>03</strong><span>PROJECTS</span></div>
        <div><strong>148</strong><span>REST APIS</span></div>
        <div><strong>8.43</strong><span>B.E. CGPA</span></div>
        <div><strong>9.74</strong><span>DIPLOMA CGPA</span></div>
      </section>

      <section className="section" id="work">
        <div className="section-heading">
          <p className="eyebrow">SELECTED WORK</p>
          <h2>Things I've built<span>.</span></h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => <ProjectCard key={project.number} project={project} />)}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div>
          <p className="eyebrow">A LITTLE ABOUT ME</p>
          <h2>Curious by nature.<br />Practical by design<span>.</span></h2>
          <p className="about-copy">From backend architecture to mobile integrations and AI-powered products, I like understanding how the pieces fit together and making them work as one.</p>
        </div>
        <div className="skills">
          {skillGroups.map((group) => (
            <div className="skill-row" key={group.label}>
              <span>{group.label}</span>
              <div className="tags">{group.values.map((value) => <span className="tag" key={value}>{value}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section background-section">
        <div>
          <p className="eyebrow">EDUCATION</p>
          <div className="plain-item"><span>2026</span><div><strong>Chaitanya Bharati Institute of Technology</strong><p>B.E. · Information Technology · 8.43 CGPA</p></div></div>
          <div className="plain-item"><span>2023</span><div><strong>Government Polytechnic, Warangal</strong><p>Diploma · Computer Engineering · 9.74 CGPA</p></div></div>
        </div>
        <div>
          <p className="eyebrow">BEYOND THE BUILD</p>
          <div className="plain-item"><span>↗</span><div><strong>IEEE Xplore research publication</strong><p>Multi-Task Graph Attention Network for Kinematic Rehabilitation Exercise Analysis · I3CTCON 2026</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>Open-source Android app</strong><p>WhatsApp Status Saver, published on F-Droid</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>6th place · COSC HackWeek</strong><p>Competitive coding challenge organized by CBIT Open Source Community</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>MongoDB Node.js Certification</strong><p>MongoDB University · Web Development 101, Pupilfirst</p></div></div>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div>
          <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
          <h2>Let's build something<br />useful<span>.</span></h2>
        </div>
        <div className="footer-links">
          <a href="mailto:vinithreddybanda@gmail.com">vinithreddybanda@gmail.com <Arrow /></a>
          <a href="https://github.com/vinithreddybanda" target="_blank" rel="noreferrer">GitHub <Arrow /></a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} VINITH REDDY BANDA</span><span>BUILT WITH CARE.</span></div>
      </footer>
      </main>
    </>
  );
}
