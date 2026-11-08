import { useEffect } from "react";

const projects = [
  {
    number: "01",
    name: "CareSchedule",
    type: "Healthcare platform · Cognizant internship",
    summary: "Healthcare runs on a thousand small decisions. CareSchedule brings those moving parts into one place, helping clinics and hospitals keep appointments organised and dependable.",
    detail: "I approached the system from the inside out, shaping a six-layer Clean Architecture with .NET, Entity Framework Core, SQL Server, and React. That foundation grew into 148 REST APIs, 32 controllers, 33 domain entities, and six role-based workflows.",
    highlight: "Intelligent appointment slot generation",
    highlightDetail: "Before an appointment can be offered, the system checks provider availability, holidays, leave, blackout periods, and resource constraints. The goal is simple: make a valid slot available without creating a double-booking.",
    stack: [".NET", "ASP.NET Core", "React", "EF Core", "SQL Server", "REST APIs"],
  },
  {
    number: "02",
    name: "JournalAI",
    type: "AI-powered product · Personal project",
    summary: "A journal starts with a private thought. JournalAI explores what can happen next, turning written reflections into structured mood insights while keeping the experience centred on the person writing.",
    detail: "I brought the product together with Next.js and TypeScript, using Groq AI to power the intelligence and Supabase for authentication and PostgreSQL persistence. The result is a full-stack product with a cloud deployment workflow.",
    highlight: "End-to-end delivery pipeline",
    highlightDetail: "The work did not stop when the features were built. I connected GitHub Actions and Jenkins, then used Docker and Kubernetes for testing and containerisation before deployment on Microsoft Azure.",
    stack: ["Next.js", "TypeScript", "Supabase", "Docker", "Kubernetes", "Azure", "Jenkins"],
  },
  {
    number: "03",
    name: "Activities for Discord",
    type: "Android · Native integration · Personal project",
    summary: "Discord Rich Presence was built around desktop use. I wanted to make that status feel less tied to a computer, so I built an Android app that puts mobile controls in the user's hands.",
    detail: "The app connects Android to Discord Rich Presence through a native integration layer and the Discord Partner SDK, extending those controls beyond the official mobile client.",
    highlight: "Persistent native SDK sessions",
    highlightDetail: "To keep the connection dependable, I implemented JNI for real-time communication, then built around it with secure authentication, encrypted credential storage, image caching, and foreground/background services.",
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

function ProjectCard({ project, index }) {
  return (
    <article className="project-card reveal" style={{ "--reveal-delay": `${index * 90}ms` }}>
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
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    const root = document.documentElement;
    const revealItems = document.querySelectorAll("[data-reveal], .reveal");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -24px 0px",
    });

    revealItems.forEach((item) => revealObserver.observe(item));
    root.classList.add("has-motion");

    // Restrained edge-only velocity blur. The page itself never gets filtered or transformed.
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let velocity = 0;
    let smoothSpeed = 0;
    let frame = 0;
    let lastPaint = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const animateEdges = (now) => {
      const elapsed = Math.min((now - lastPaint) / 1000, 0.05);
      lastPaint = now;
      const blend = 1 - Math.exp(-elapsed / 0.075);
      smoothSpeed += (Math.abs(velocity) - smoothSpeed) * blend;
      velocity *= Math.exp(-elapsed / 0.12);

      const intensity = clamp(smoothSpeed / 1250, 0, 1);
      const blur = (intensity * 3.2).toFixed(2);
      const opacity = (intensity * 0.82).toFixed(3);
      root.style.setProperty("--edge-blur", `${blur}px`);
      root.style.setProperty("--edge-opacity", opacity);

      if (Math.abs(velocity) < 4 && smoothSpeed < 5) {
        root.style.setProperty("--edge-blur", "0px");
        root.style.setProperty("--edge-opacity", "0");
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(animateEdges);
    };

    const onScroll = () => {
      const now = performance.now();
      const elapsed = Math.max(now - previousTime, 8);
      velocity = clamp(((window.scrollY - previousY) / elapsed) * 1000, -2800, 2800);
      previousY = window.scrollY;
      previousTime = now;
      if (!frame) {
        lastPaint = now;
        frame = requestAnimationFrame(animateEdges);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      revealObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("has-motion");
      root.style.removeProperty("--edge-blur");
      root.style.removeProperty("--edge-opacity");
    };
  }, []);

  return (
    <>
      <main className="site-shell" id="home">
      <header className="site-header" data-reveal="up">
        <a className="brand" href="#home">vinith<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-contact" href="mailto:vinithreddybanda@gmail.com">Let's talk <Arrow /></a>
      </header>

      <section className="hero">
        <p className="eyebrow hero-kicker" data-reveal="up">DEVELOPER / BUILDER <span>·</span> INDIA</p>
        <h1 className="hero-title" data-reveal="up">Making things<br />work<span>.</span></h1>
        <div className="hero-bottom" data-reveal="up">
          <p>I'm Vinith Reddy Banda, an Information Technology graduate drawn to the space between an idea and a working product. I like finding out how systems fit together, getting into the details, and turning what I learn into software people can actually use.</p>
          <a className="text-link" href="#work">Explore my work ↓</a>
        </div>
      </section>

      <section className="metrics" aria-label="Highlights" data-reveal="up">
        <div><strong>03</strong><span>PROJECTS</span></div>
        <div><strong>148</strong><span>REST APIS</span></div>
        <div><strong>8.43</strong><span>B.E. CGPA</span></div>
        <div><strong>9.74</strong><span>DIPLOMA CGPA</span></div>
      </section>

      <section className="section" id="work" data-reveal="up">
        <div className="section-heading">
          <p className="eyebrow">SELECTED WORK</p>
          <h2>Things I've built<span>.</span></h2>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
        </div>
      </section>

      <section className="section about-section" id="about" data-reveal="up">
        <div>
          <p className="eyebrow">A LITTLE ABOUT ME</p>
          <h2>Curious by nature.<br />Practical by design<span>.</span></h2>
          <p className="about-copy">My path has moved through very different corners of software: designing backend systems for healthcare, connecting Android to native services, and exploring how AI can make a journal more insightful. Each project has taught me to look beyond the feature in front of me and understand the system holding it together.</p>
        </div>
        <div className="skills">
          {skillGroups.map((group) => (
            <div className="skill-row reveal" key={group.label}>
              <span>{group.label}</span>
              <div className="tags">{group.values.map((value) => <span className="tag" key={value}>{value}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section background-section" data-reveal="up">
        <div>
          <p className="eyebrow">EDUCATION</p>
          <div className="plain-item reveal"><span>2026</span><div><strong>Chaitanya Bharati Institute of Technology</strong><p>B.E. · Information Technology · 8.43 CGPA</p></div></div>
          <div className="plain-item reveal"><span>2023</span><div><strong>Government Polytechnic, Warangal</strong><p>Diploma · Computer Engineering · 9.74 CGPA</p></div></div>
        </div>
        <div>
          <p className="eyebrow">BEYOND THE BUILD</p>
          <div className="plain-item reveal"><span>↗</span><div><strong>IEEE Xplore research publication</strong><p>A research project exploring graph attention networks for analysing kinematic patterns in rehabilitation exercises · I3CTCON 2026</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>Open-source Android app</strong><p>Built for Android and distributed through F-Droid</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>6th place · COSC HackWeek</strong><p>A competitive programming challenge hosted by the CBIT Open Source Community</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>MongoDB Node.js Certification</strong><p>MongoDB University · Web Development 101, Pupilfirst</p></div></div>
        </div>
      </section>

      <footer className="site-footer" id="contact" data-reveal="up">
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
