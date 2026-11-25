import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Track = {
  id?: string;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  duration?: number;
  durationMs?: number;
  url?: string;
};

type ListeningStatus = {
  isPlaying: boolean;
  track: Track | null;
  status?: "playing" | "last_played";
};

const STATUS_URL = "https://vinith-music-status.vinithreddy08-123.workers.dev/status";
const HISTORY_KEY = "vinith-listening-history-v1";

function trackKey(track: Track) {
  return track.id || `${track.title}::${track.artist}`;
}

export default function NowPlaying() {
  const [status, setStatus] = useState<ListeningStatus | null>(null);
  const [history, setHistory] = useState<Track[]>([]);

  useEffect(() => {
    let mounted = true;

    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") as Track[];
      if (Array.isArray(saved)) setHistory(saved.slice(0, 3));
    } catch {
      localStorage.removeItem(HISTORY_KEY);
    }

    const refresh = async () => {
      try {
        const response = await fetch(STATUS_URL, { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as ListeningStatus;
        if (!mounted) return;

        setStatus((previous) => next.track ? next : previous ? { ...next, track: previous.track, isPlaying: false, status: "last_played" } : next);

        if (next.track) {
          setHistory((previous) => {
            const key = trackKey(next.track!);
            const updated = [next.track!, ...previous.filter((item) => trackKey(item) !== key)].slice(0, 3);
            try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)); } catch { /* Storage can be unavailable. */ }
            return updated;
          });
        }
      } catch {
        // Preserve the last successful status and listening history.
      }
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), 30_000);
    const onFocus = () => void refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const isPlaying = Boolean(status?.isPlaying && status.track);
  const current = status?.track ?? history[0] ?? null;
  const recent = history.filter((track) => !current || trackKey(track) !== trackKey(current)).slice(0, 2);
  const tracks = current ? [current, ...recent] : recent;

  return (
    <motion.div
      className="listening-panel"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {tracks.length ? (
        <div className="listening-list">
          {tracks.map((track, index) => {
            const active = index === 0 && isPlaying;
            return (
              <div className={`listening-row ${index === 0 ? "listening-current" : ""}`} key={trackKey(track)}>
                <div className="album-art">
                  {track.artwork ? <img src={track.artwork} alt="" loading="lazy" /> : <span>{track.title.slice(0, 1).toUpperCase()}</span>}
                </div>
                <div className="listening-details">
                  <div className="listening-state">
                    <span className={active ? "playing-indicator active" : "playing-indicator"} />
                    {index === 0 ? (active ? "NOW PLAYING" : "LAST PLAYED") : index === 1 ? "PREVIOUS" : "EARLIER"}
                  </div>
                  <strong>{track.title}</strong>
                  <span className="listening-artist">{track.artist}{track.album ? ` · ${track.album}` : ""}</span>
                </div>
                <div className="listening-action">
                  {active && <span className="equalizer" aria-label="Playing"><i /><i /><i /><i /></span>}
                  {track.url && <a href={track.url} target="_blank" rel="noreferrer" aria-label="Open track">↗</a>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="listening-empty">
          <div className="album-art album-empty"><span>♪</span></div>
          <div className="listening-details">
            <div className="listening-state">LISTENING HISTORY</div>
            <strong>Nothing played here yet</strong>
            <span className="listening-artist">Your recent tracks will appear here.</span>
          </div>
        </div>
      )}
      <p className="listening-footnote">Recent listening is remembered on this device.</p>
    </motion.div>
  );
}
