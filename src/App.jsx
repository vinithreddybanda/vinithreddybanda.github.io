import { useLayoutEffect } from "react";
import NowPlaying from "./components/NowPlaying.jsx";

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
  useLayoutEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches) return;

    const root = document.documentElement;
    const revealItems = document.querySelectorAll(
      ".site-header, .hero > *, .metrics > div, .section-heading > *, .project-card, .about-section > div:first-child, .skill-row, .background-section > div > .eyebrow, .plain-item, .now-playing, .site-footer > *"
    );

    revealItems.forEach((item) => item.classList.add("scroll-blur"));

    // Native view timelines track scroll progress in both directions. This
    // avoids observer threshold chatter and transform-induced re-entry flicker.
    if (CSS.supports("animation-timeline: view()")) {
      root.classList.add("has-scroll-timeline");
      return () => {
        root.classList.remove("has-scroll-timeline");
        revealItems.forEach((item) => item.classList.remove("scroll-blur"));
      };
    }

    // Older browsers get a stable one-time reveal. Never toggle an element
    // out again: doing so with an observer can make it flicker at the threshold.
    if (!("IntersectionObserver" in window)) return;

    root.classList.add("has-motion");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -8% 0px",
    });

    revealItems.forEach((item) => revealObserver.observe(item));

    return () => {
      revealObserver.disconnect();
      root.classList.remove("has-motion");
      revealItems.forEach((item) => item.classList.remove("scroll-blur", "is-visible"));
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
        <p className="eyebrow hero-kicker">DEVELOPER / BUILDER <span>·</span> INDIA</p>
        <h1 className="hero-title">Making things<br />work<span>.</span></h1>
        <div className="hero-bottom">
          <p>I'm Vinith Reddy Banda, an Information Technology graduate drawn to the space between an idea and a working product. I like finding out how systems fit together, getting into the details, and turning what I learn into software people can actually use.</p>
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
          <p className="about-copy">My path has moved through very different corners of software: designing backend systems for healthcare, connecting Android to native services, and exploring how AI can make a journal more insightful. Each project has taught me to look beyond the feature in front of me and understand the system holding it together.</p>
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
          <div className="plain-item"><span>↗</span><div><strong>IEEE Xplore research publication</strong><p>A research project exploring graph attention networks for analysing kinematic patterns in rehabilitation exercises · I3CTCON 2026</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>Open-source Android app</strong><p>Built for Android and distributed through F-Droid</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>6th place · COSC HackWeek</strong><p>A competitive programming challenge hosted by the CBIT Open Source Community</p></div></div>
          <div className="plain-item"><span>↗</span><div><strong>MongoDB Node.js Certification</strong><p>MongoDB University · Web Development 101, Pupilfirst</p></div></div>
        </div>
      </section>

      <NowPlaying />

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
