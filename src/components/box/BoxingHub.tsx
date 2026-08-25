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

function FlagMx() {
  return (
    <span className="bx-flag" title="México" aria-hidden="true">
      <i className="g" />
      <i className="w" />
      <i className="r" />
    </span>
  );
}

function Trend({ trend }: { trend?: BoxingFighter["trend"] }) {
  if (trend === "up") return <span className="bx-trend up" aria-label="subió">▲</span>;
  if (trend === "down") return <span className="bx-trend down" aria-label="bajó">▼</span>;
  return <span className="bx-trend same" aria-label="sin cambio">=</span>;
}

function FighterRow({
  fighter,
  division,
}: {
  fighter: BoxingFighter;
  division?: string;
}) {
  return (
    <article className="bx-fighter">
      <img src={fighter.photo} alt="" />
      <div>
        {division && <strong>{division}</strong>}
        <p>
          <FlagMx />
          {fighter.name}
        </p>
        <small>
          {fighter.gym} · {fighter.record}
        </small>
      </div>
    </article>
  );
}

function P4PColumn({ title, fighters }: { title: string; fighters: BoxingFighter[] }) {
  return (
    <div className="bx-p4p-col">
      <h3>{title}</h3>
      <ol>
        {fighters.map((f, i) => (
          <li key={f.id}>
            <span className="bx-rank">{i + 1}</span>
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
    <article className="bx-gym">
      <header>
        <h3>{gym.name}</h3>
        <span>{gym.city}</span>
      </header>
      <p className="bx-gym-coach">{gym.coaches.join(" · ")}</p>
      <p className="bx-gym-addr">{gym.address}</p>
      {gym.phone.length > 0 && (
        <p className="bx-gym-tel">
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

export function BoxingHub() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"all" | "capital" | "municipio">("all");

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

  return (
    <div className="bx-shell">
      <section className="bx-hero" aria-label="ROCA Box">
        <img
          className="bx-hero-media"
          src="https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=2200&q=80"
          alt=""
        />
        <div className="bx-hero-shade" aria-hidden="true" />
        <div className="bx-hero-copy">
          <p className="bx-kicker">ROCA Sports · Durango</p>
          <h1>
            <span>Box</span>
            <em>Durango</em>
          </h1>
          <p className="bx-lead">
            Rankings, cartelera y el directorio de gimnasios de la escena local.
          </p>
          <div className="bx-hero-actions">
            <a className="btn btn-primary" href="#cartelera">
              Ver cartelera
            </a>
            <a className="btn btn-outline" href="#gimnasios">
              Gimnasios
            </a>
          </div>
        </div>
      </section>

      <nav className="bx-subnav" aria-label="Secciones de box">
        <a href="#campeones">Campeones</a>
        <a href="#p4p">P4P</a>
        <a href="#cartelera">Cartelera</a>
        <a href="#gimnasios">Gimnasios</a>
      </nav>

      <div className="bx-board">
        <section id="campeones" className="bx-panel">
          <header className="bx-panel-head">
            <h2>Campeones</h2>
            <p>Por división · Durango</p>
          </header>
          <ul className="bx-list">
            {DURANGO_CHAMPIONS.map(({ division, fighter }) => (
              <li key={fighter.id}>
                <FighterRow fighter={fighter} division={division} />
              </li>
            ))}
          </ul>
        </section>

        <section id="p4p" className="bx-panel bx-p4p">
          <header className="bx-panel-head center">
            <h2>Pound for Pound</h2>
            <p>Escena Durango · votación abierta</p>
          </header>
          <div className="bx-p4p-grid">
            <P4PColumn title="Masculino" fighters={P4P_MALE} />
            <P4PColumn title="Femenino" fighters={P4P_FEMALE} />
          </div>
          <article className="bx-featured">
            <div>
              <p className="bx-kicker">Destacado</p>
              <h3>{FEATURED_FIGHTER.name}</h3>
              <p>
                {FEATURED_FIGHTER.division} · {FEATURED_FIGHTER.record}
                <br />
                {FEATURED_FIGHTER.gym}
              </p>
            </div>
            <img src={FEATURED_FIGHTER.photo} alt={FEATURED_FIGHTER.name} />
          </article>
        </section>

        <section id="cartelera" className="bx-panel">
          <header className="bx-panel-head">
            <h2>Cartelera</h2>
            <p>Próximas peleas</p>
          </header>
          {scheduleGroups.map(([date, bouts]) => (
            <div key={date} className="bx-day">
              <h3>{date}</h3>
              <ul>
                {bouts.map((bout) => (
                  <li key={bout.id}>
                    <div className="bx-bout-side left">
                      {bout.left.rank != null && <em>#{bout.left.rank}</em>}
                      <span>{bout.left.name}</span>
                    </div>
                    <span className="bx-vs">VS</span>
                    <div className="bx-bout-side right">
                      {bout.right.rank != null && <em>#{bout.right.rank}</em>}
                      <span>{bout.right.name}</span>
                    </div>
                    <small className="bx-venue" title={bout.venue}>
                      {bout.venue}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <section id="gimnasios" className="bx-gyms">
        <div className="bx-gyms-head">
          <div>
            <p className="bx-kicker">Directorio</p>
            <h2>Gimnasios de box</h2>
            <p>
              Padrón de Durango capital y municipios · {gyms.length} resultados
            </p>
          </div>
          <div className="bx-gyms-tools">
            <label className="bx-search">
              <span className="sr-only">Buscar gimnasio</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar gym, coach o colonia"
              />
            </label>
            <div className="bx-filters" role="group" aria-label="Filtro de región">
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
        </div>
        <div className="bx-gym-grid">
          {gyms.map((g) => (
            <GymCard key={g.id} gym={g} />
          ))}
        </div>
      </section>
    </div>
  );
}
