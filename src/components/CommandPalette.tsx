import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const commands = [
  { label: "About", detail: "A little about me", href: "#about", key: "01" },
  { label: "Selected work", detail: "Projects I have built", href: "#work", key: "02" },
  { label: "Open source", detail: "Contributions beyond my own repos", href: "#opensource", key: "03" },
  { label: "Now", detail: "What I am working on", href: "#now", key: "04" },
  { label: "Contact", detail: "Start a conversation", href: "#contact", key: "05" },
  { label: "GitHub", detail: "Browse my repositories", href: "https://github.com/vinithreddybanda", key: "GH" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const filtered = useMemo(
    () => commands.filter((item) => (item.label + " " + item.detail).toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
      if (!open) return;
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => Math.min(value + 1, filtered.length - 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter" && filtered[active]) {
        window.location.href = filtered[active].href;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, filtered, active]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  return (
    <>
      <button className="key-trigger" type="button" onClick={() => setOpen(true)} aria-label="Open command palette">
        <span>⌘</span><kbd>K</kbd>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}
          >
            <motion.div
              className="palette"
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              <div className="palette-search">
                <span className="search-mark">⌕</span>
                <input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="Search pages and actions..." />
                <kbd>ESC</kbd>
              </div>
              <div className="palette-list">
                {filtered.map((item, index) => (
                  <a
                    className={index === active ? "palette-item active" : "palette-item"}
                    href={item.href}
                    key={item.key}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => setOpen(false)}
                  >
                    <span className="palette-index">{item.key}</span>
                    <span className="palette-copy"><strong>{item.label}</strong><small>{item.detail}</small></span>
                    <span className="palette-arrow">↗</span>
                  </a>
                ))}
                {filtered.length === 0 && <p className="palette-empty">No matching commands.</p>}
              </div>
              <div className="palette-foot"><span>Navigate <kbd>↑</kbd> <kbd>↓</kbd></span><span>Open <kbd>↵</kbd></span><span>Close <kbd>esc</kbd></span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
