import { useEffect, useState } from "react";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className={`page ${ready ? "is-ready" : ""}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="topbar" aria-label="Main navigation">
        <a className="wordmark" href="/" aria-label="Home">V<span>.</span></a>
        <span className="status"><i /> A little space on the internet</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">HELLO, WORLD</p>
        <h1>Hello<span className="period">.</span><br /><span className="name">I'm Vinith.</span></h1>
        <p className="intro">
          A fresh start. A blank canvas. More soon.
        </p>
        <a className="github-link" href="https://github.com/vinithreddybanda" target="_blank" rel="noreferrer">
          Find me on GitHub <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Vinith Reddy Banda</span>
        <span>Built for what comes next.</span>
      </footer>
    </main>
  );
}