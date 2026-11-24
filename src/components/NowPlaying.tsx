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

export default function NowPlaying() {
  const [status, setStatus] = useState<ListeningStatus | null>(null);

  useEffect(() => {
    let mounted = true;

    const refresh = async () => {
      try {
        const response = await fetch(STATUS_URL, { cache: "no-store" });
        if (!response.ok) return;
        const next = (await response.json()) as ListeningStatus;
        if (!mounted) return;

        setStatus((previous) => {
          if (next.track) return next;
          if (previous?.track) return { ...next, track: previous.track, isPlaying: false, status: "last_played" };
          return next;
        });
      } catch {
        // Keep the last successful response visible when the status service is unavailable.
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

  const track = status?.track;
  const isPlaying = Boolean(status?.isPlaying && track);

  return (
    <motion.div
      className="listening-card"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {track ? (
        <>
          <div className="album-art">
            {track.artwork ? <img src={track.artwork} alt="" loading="lazy" /> : <span>{track.title.slice(0, 1).toUpperCase()}</span>}
          </div>
          <div className="listening-details">
            <div className="listening-state"><span className={isPlaying ? "playing-indicator active" : "playing-indicator"} />{isPlaying ? "NOW PLAYING" : "LAST PLAYED"}</div>
            <strong>{track.title}</strong>
            <span className="listening-artist">{track.artist}{track.album ? ` · ${track.album}` : ""}</span>
          </div>
          <div className="listening-action">
            {isPlaying && <span className="equalizer" aria-label="Playing"><i /><i /><i /><i /></span>}
            {track.url && <a href={track.url} target="_blank" rel="noreferrer" aria-label="Open track">↗</a>}
          </div>
        </>
      ) : (
        <>
          <div className="album-art album-empty"><span>♪</span></div>
          <div className="listening-details">
            <div className="listening-state">LISTENING STATUS</div>
            <strong>Nothing playing yet</strong>
            <span className="listening-artist">The next track will show up here.</span>
          </div>
          <span className="listening-action muted">SIMPMUSIC</span>
        </>
      )}
    </motion.div>
  );
}
