import { useEffect, useState } from "react";
import "./NowPlaying.css";

const STATUS_URL = "https://vinith-music-status.vinithreddy08-123.workers.dev/status";

function normalizeUrl(value) {
  if (typeof value !== "string") return "";
  const markdownLink = value.match(/^\s*\[[^\]]*\]\((https?:\/\/[^\s)]+)\)\s*$/);
  const candidate = (markdownLink?.[1] ?? value).trim();
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

function artworkUrl(artwork) {
  if (typeof artwork === "string") return normalizeUrl(artwork);
  if (!Array.isArray(artwork)) return "";
  return [...artwork].reverse().find((item) => normalizeUrl(item?.url))?.url
    ? normalizeUrl([...artwork].reverse().find((item) => normalizeUrl(item?.url)).url)
    : "";
}

function formatTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(date);
}

export default function NowPlaying() {
  const [snapshot, setSnapshot] = useState(null);
  const [connection, setConnection] = useState("loading");

  useEffect(() => {
    let active = true;
    let controller;

    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      try {
        const result = await fetch(STATUS_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!result.ok) throw new Error("Status request failed: " + result.status);
        const data = await result.json();
        if (!data || typeof data.isPlaying !== "boolean") throw new Error("Invalid music status response");
        if (active) {
          setSnapshot(data);
          setConnection("online");
        }
      } catch (error) {
        if (error.name !== "AbortError" && active) setConnection("offline");
      }
    };

    refresh();
    const interval = window.setInterval(() => {\n      if (document.visibilityState === "visible") refresh();\n    }, 2000);\n    const handleFocus = () => refresh();\n    document.addEventListener("visibilitychange", handleFocus);\n    window.addEventListener("focus", handleFocus);
    return () => {
      active = false;
      window.clearInterval(interval);
      controller?.abort();
    };
  }, []);

  const track = snapshot?.track;
  const isPlaying = connection === "online" && snapshot?.isPlaying === true;
  const hasTrack = connection === "online" && Boolean(track);
  const image = artworkUrl(track?.artwork);
  const trackUrl = normalizeUrl(track?.url);
  const updated = formatTime(snapshot?.lastHeartbeat ?? snapshot?.updatedAt);

  return (
    <section className="now-playing" aria-label="Music status">
      <div className="now-playing-heading">
        <p className="eyebrow">FROM MY LISTENING SESSION</p>
        <span className={"music-live-indicator " + (isPlaying ? "is-playing" : "")} aria-label={isPlaying ? "Currently playing" : "Not currently playing"} />
      </div>
      <div className="now-playing-content">
        {image && hasTrack ? (
          <img className="now-playing-artwork" src={image} alt="" loading="lazy" />
        ) : (
          <div className="now-playing-artwork now-playing-artwork-empty" aria-hidden="true"><span>♪</span></div>
        )}
        <div className="now-playing-copy" aria-live="polite">
          <span className="now-playing-state">
            {connection === "loading" ? "CONNECTING" : connection === "offline" ? "STATUS UNAVAILABLE" : isPlaying ? "NOW PLAYING" : hasTrack ? "LAST PLAYED" : "NOTHING PLAYING"}
          </span>
          <strong>{hasTrack ? track.title || "Unknown track" : connection === "offline" ? "Music status is offline" : "No recent track"}</strong>
          <span className="now-playing-artist">{hasTrack ? track.artist || "Unknown artist" : "SimpMusic · YouTube Music"}</span>
          {hasTrack && updated && <span className="now-playing-time">{isPlaying ? "Updated" : "Last active"} at {updated}</span>}
        </div>
        {hasTrack && trackUrl ? <a className="now-playing-link" href={trackUrl} target="_blank" rel="noreferrer" aria-label="Open track in YouTube Music">↗</a> : null}
      </div>
    </section>
  );
}
