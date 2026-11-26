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

function trackKey(track: Track) {
  return track.id || `${track.title}::${track.artist}`;
}

export default function NowPlaying() {
  const [status, setStatus] = useState<ListeningStatus | null>(null);
  const [history, setHistory] = useState<Track[]>([]);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const response = await fetch(STATUS_URL, { cache: "no-store" });
        if (!response.ok) return;

        const next = (await response.json()) as ListeningStatus;
        if (!mounted) return;

        setStatus((previous) =>
          next.track
            ? next
            : previous?.track
              ? { ...next, track: previous.track, isPlaying: false, status: "last_played" }
              : next
        );

        if (next.track) {
          setHistory((previous) => {
            const key = trackKey(next.track!);
            return [next.track!, ...previous.filter((item) => trackKey(item) !== key)].slice(0, 3);
          });
        }
      } catch {
        // Keep the last successful status while the Worker is temporarily unavailable.
      }
    };

    void refresh();

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 2000);

    const handleFocus = () => void refresh();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
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
              <div className={`listening-row ${index === 0 ? "listening-current" : "listening-history-row"}`} key={trackKey(track)}>
                <div className="album-art">
                  {track.artwork ? <img src={track.artwork} alt="" loading="lazy" /> : <span>{track.title.slice(0, 1).toUpperCase()}</span>}
                  {active && <span className="art-playing-mark" aria-hidden="true">♫</span>}
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
            <div className="listening-state">LISTENING</div>
            <strong>Nothing playing right now</strong>
            <span className="listening-artist">Your current track will appear here.</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
