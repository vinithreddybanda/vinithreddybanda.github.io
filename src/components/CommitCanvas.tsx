import { useEffect, useMemo, useState } from "react";

type Day = { date: string; count: number; level?: number };
type ApiResponse = { contributions?: Day[] };

const API = "https://github-contributions-api.jogruber.de/v4/vinithreddybanda?y=last";

export default function CommitCanvas() {
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    let active = true;
    fetch(API, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Contribution data unavailable");
        return response.json() as Promise<ApiResponse>;
      })
      .then((data) => {
        if (active && Array.isArray(data.contributions)) setDays(data.contributions);
      })
      .catch(() => {
        if (active) setDays([]);
      });
    return () => { active = false; };
  }, []);

  const cells = useMemo(() => {
    if (!days.length) return [];
    const first = new Date(`${days[0].date}T00:00:00`);
    const offset = first.getDay();
    return [
      ...Array.from({ length: offset }, () => null),
      ...days,
    ];
  }, [days]);

  return (
    <div className="commit-canvas" aria-label="GitHub contributions over the last year">
      {cells.length ? (
        <div className="commit-grid" role="img" aria-label={`${days.reduce((sum, day) => sum + day.count, 0)} contributions in the last year`}>
          {cells.map((day, index) => (
            <span
              key={day?.date ?? `empty-${index}`}
              className={day ? `commit-cell level-${day.level ?? Math.min(4, day.count === 0 ? 0 : day.count < 3 ? 1 : day.count < 6 ? 2 : day.count < 10 ? 3 : 4)}` : "commit-cell empty"}
              title={day ? `${day.count} contributions on ${day.date}` : ""}
            />
          ))}
        </div>
      ) : (
        <div className="commit-grid commit-grid-loading" aria-hidden="true">
          {Array.from({ length: 371 }, (_, index) => <span className="commit-cell empty" key={index} />)}
        </div>
      )}
      <div className="commit-caption">
        <span>{days.length ? `${days.reduce((sum, day) => sum + day.count, 0).toLocaleString()} contributions` : "GitHub activity"}</span>
        <span className="commit-legend" aria-hidden="true">
          <i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" />
        </span>
      </div>
    </div>
  );
}
