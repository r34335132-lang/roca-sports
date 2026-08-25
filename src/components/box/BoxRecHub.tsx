import { useMemo, useState } from "react";
import {
  BOXING_GYMS,
  BOXING_SCHEDULE,
  DURANGO_CHAMPIONS,
  FEATURED_FIGHTER,
  P4P_FEMALE,
  P4P_MALE,
  type BoxingFighter,
  type BoxingGym,
} from "@/lib/boxingData";

const NAV = [
  { id: "ratings", label: "ratings" },
  { id: "schedule", label: "schedule" },
  { id: "results", label: "results" },
  { id: "champions", label: "champions" },
  { id: "clubs", label: "clubs" },
  { id: "p4p", label: "p4p" },
] as const;

function FlagMx() {
  return (
    <span className="br-flag" title="México" aria-hidden="true">
      <i className="g" />
      <i className="w" />
      <i className="r" />
    </span>
  );
}

function Trend({ trend }: { trend?: BoxingFighter["trend"] }) {
  if (trend === "up") return <span className="br-trend up" aria-label="subió">▲</span>;
  if (trend === "down") return <span className="br-trend down" aria-label="bajó">▼</span>;
  return <span className="br-trend same" aria-label="sin cambio">=</span>;
}

function Crown() {
  return (
    <svg className="br-crown" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18z" fill="currentColor" />
    </svg>
  );
}

function FighterRow({
  fighter,
  division,
  compact,
}: {
  fighter: BoxingFighter;
  division?: string;
  compact?: boolean;
}) {
  return (
    <article className={`br-fighter-row ${compact ? "compact" : ""}`}>
      <img src={fighter.photo} alt="" />
      <div>
        {division && <strong>{division}</strong>}
        <p>
          <FlagMx />
          {fighter.name}
        </p>
        {!compact && <small>{fighter.gym} · {fighter.record}</small>}
      </div>
    </article>
  );
}

function P4PColumn({ title, fighters }: { title: string; fighters: BoxingFighter[] }) {
  return (
    <div className="br-p4p-col">
      <h3>{title}</h3>
      <ol>
        {fighters.map((f, i) => (
          <li key={f.id}>
            <span className="br-rank">
              {i === 0 ? <Crown /> : i + 1}
            </span>
            <img src={f.photo} alt="" />
            <div>
              <p>
                <FlagMx />
                {f.name}
              </p>
              <small>{f.record}</small>
            </div>
            <Trend trend={f.trend} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function GymCard({ gym }: { gym: BoxingGym }) {
  return (
    <article className="br-gym">
      <header>
        <h3>{gym.name}</h3>
        <span>{gym.city}</span>
      </header>
      <p className="br-gym-coach">{gym.coaches.join(" · ")}</p>
      <p className="br-gym-addr">{gym.address}</p>
      {gym.phone.length > 0 && (
        <p className="br-gym-tel">
          {gym.phone.map((t) => (
            <a key={t} href={`tel:${t.replace(/\D/g, "")}`}>
              {t}
            </a>
          ))}
        </p>
      )}
    </article>
  );
}

export function BoxRecHub() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"all" | "capital" | "municipio">("all");
  const [section, setSection] = useState<string>("champions");

  const scheduleGroups = useMemo(() => {
    const map = new Map<string, typeof BOXING_SCHEDULE>();
    for (const bout of BOXING_SCHEDULE) {
      const list = map.get(bout.dateLabel) ?? [];
      list.push(bout);
      map.set(bout.dateLabel, list);
    }
    return [...map.entries()];
  }, []);

  const gyms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BOXING_GYMS.filter((g) => {
      if (region !== "all" && g.region !== region) return false;
      if (!q) return true;
      const hay = `${g.name} ${g.coaches.join(" ")} ${g.address} ${g.city}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, region]);

  const peopleHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return [
      ...DURANGO_CHAMPIONS.map((c) => c.fighter),
      ...P4P_MALE,
      ...P4P_FEMALE,
    ].filter(
      (f, i, arr) =>
        arr.findIndex((x) => x.id === f.id) === i &&
        `${f.name} ${f.gym} ${f.division}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="br-shell">
      <header className="br-top">
        <div className="br-brand" aria-label="ROCA Box">
          <span>ROCA</span>
          <em>Box</em>
        </div>

        <label className="br-search">
          <span className="sr-only">Buscar boxeador o gimnasio</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="buscar nombre, gym o ID"
          />
          <button type="button" aria-label="Buscar">
            ⌕
          </button>
        </label>

        <nav className="br-nav" aria-label="Secciones de box">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={section === item.id ? "is-active" : undefined}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="br-banner">
        <strong>ROCA Fight Night · Durango</strong>
        <span>{BOXING_GYMS.length} gimnasios · rankings · cartelera local</span>
      </div>

      {peopleHits.length > 0 && (
        <section className="br-search-hits" aria-label="Resultados de personas">
          {peopleHits.map((f) => (
            <FighterRow key={f.id} fighter={f} division={f.division} />
          ))}
        </section>
      )}

      <div className="br-grid">
        <section id="champions" className="br-panel">
          <h2>
            <Crown /> Durango
          </h2>
          <ul className="br-champ-list">
            {DURANGO_CHAMPIONS.map(({ division, fighter }) => (
              <li key={fighter.id}>
                <FighterRow fighter={fighter} division={division} />
              </li>
            ))}
          </ul>
        </section>

        <section id="p4p" className="br-panel br-p4p">
          <h2>The People&apos;s P4P</h2>
          <div className="br-p4p-grid">
            <P4PColumn title="♂ masculino" fighters={P4P_MALE} />
            <P4PColumn title="♀ femenino" fighters={P4P_FEMALE} />
          </div>
          <p className="br-vote">votación abierta · escena Durango</p>

          <article className="br-featured">
            <h3>
              <Crown /> {FEATURED_FIGHTER.name}
            </h3>
            <img src={FEATURED_FIGHTER.photo} alt={FEATURED_FIGHTER.name} />
            <p>
              {FEATURED_FIGHTER.division} · {FEATURED_FIGHTER.record}
              <br />
              {FEATURED_FIGHTER.gym}
            </p>
          </article>
        </section>

        <section id="schedule" className="br-panel">
          <h2>Schedule</h2>
          {scheduleGroups.map(([date, bouts]) => (
            <div key={date} className="br-day">
              <h3>{date}</h3>
              <ul>
                {bouts.map((bout) => (
                  <li key={bout.id}>
                    <div className="br-bout-side left">
                      {bout.left.rank != null && <em>#{bout.left.rank}</em>}
                      <span>{bout.left.name}</span>
                    </div>
                    <span className="br-vs">VS</span>
                    <div className="br-bout-side right">
                      {bout.right.rank != null && <em>#{bout.right.rank}</em>}
                      <span>{bout.right.name}</span>
                    </div>
                    <small className="br-bout-cal" title={bout.venue} aria-label={bout.venue}>
                      ▦
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <section id="clubs" className="br-clubs">
        <div className="br-clubs-head">
          <div>
            <h2>Clubs · Gimnasios</h2>
            <p>
              Directorio de boxeo en Durango capital y municipios ({gyms.length} resultados)
            </p>
          </div>
          <div className="br-filters">
            <button
              type="button"
              className={region === "all" ? "is-on" : undefined}
              onClick={() => setRegion("all")}
            >
              Todos
            </button>
            <button
              type="button"
              className={region === "capital" ? "is-on" : undefined}
              onClick={() => setRegion("capital")}
            >
              Capital
            </button>
            <button
              type="button"
              className={region === "municipio" ? "is-on" : undefined}
              onClick={() => setRegion("municipio")}
            >
              Municipios
            </button>
          </div>
        </div>
        <div className="br-gym-grid">
          {gyms.map((g) => (
            <GymCard key={g.id} gym={g} />
          ))}
        </div>
      </section>

      <section id="ratings" className="br-panel br-results-note">
        <h2 id="results">Ratings & results</h2>
        <p>
          Rankings por división, P4P y cartelera alimentan la escena ROCA Box en Durango.
          Los clubs del directorio vienen del padrón estatal de gimnasios.
        </p>
      </section>
    </div>
  );
}
