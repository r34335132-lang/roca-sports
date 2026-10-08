import { Link } from "react-router-dom";
import { RocaLogo } from "@/components/brand/RocaLogo";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { BOXING_GYMS, BOXING_SCHEDULE, DURANGO_CHAMPIONS } from "@/lib/boxingData";

const DISCIPLINES = [
  {
    key: "flag",
    label: "Flag",
    tag: "Toque",
    href: "/deportes/flag",
    img: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "soccer",
    label: "Fútbol",
    tag: "Liga estrella",
    href: "/deportes/soccer",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1300&q=80",
  },
  {
    key: "baseball",
    label: "Béisbol",
    tag: "Diamante",
    href: "/deportes/baseball",
    img: "https://images.unsplash.com/photo-1529768167801-9173d94c2a42?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "cycling",
    label: "Ciclismo",
    tag: "Ruta y montaña",
    href: "/deportes/cycling",
    img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "basketball",
    label: "Básquetbol",
    tag: "Cancha",
    href: "/deportes/basketball",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "volleyball",
    label: "Voleibol",
    tag: "Red",
    href: "/deportes/volleyball",
    img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "boxing",
    label: "Box",
    tag: "Fight night",
    href: "/box",
    img: "https://images.unsplash.com/photo-1495555687398-3f50d6e79e1e?auto=format&fit=crop&w=1400&q=80",
  },
];

const STEPS = [
  {
    title: "Elige tu deporte",
    copy: "Encuentra la liga de fútbol, básquet, box, flag, béisbol, voleibol o ciclismo que va contigo.",
  },
  {
    title: "Inscríbete con tu equipo",
    copy: "Regístrate en minutos, súmate a tu equipo y sigue cada jornada desde tu celular.",
  },
  {
    title: "Recibe tu credencial",
    copy: "Tu Upper Deck digital con QR, foto y estadísticas que suben con cada partido.",
  },
];

const NEWS = [
  {
    tag: "Boxeo",
    title: `${BOXING_GYMS.length} gimnasios de box en un solo directorio`,
    copy: "Durango capital y municipios: entrenadores, direcciones y teléfonos para que encuentres dónde entrenar.",
    img: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=1200&q=80",
    href: "/box",
  },
  {
    tag: "Credenciales",
    title: "Tu credencial Upper Deck: foil, rareza y QR",
    copy: "Cada jugador lleva una carta con el look de su deporte y sus estadísticas de la temporada.",
    img: "https://images.unsplash.com/photo-1461896833974-ffe9f0cb4a1e?auto=format&fit=crop&w=1200&q=80",
    href: "/deportes",
  },
  {
    tag: "Deportes",
    title: "Siete deportes, una sola comunidad",
    copy: "Ciclismo y voleibol se suman a fútbol, básquet, box, flag y béisbol en ROCA.",
    img: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=900&q=70",
    href: "/deportes",
  },
];

const NEXT_BOUT = BOXING_SCHEDULE[0];

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main className="home-page">
        <section className="sports-hero" aria-labelledby="hero-title">
          <div className="sports-collage">
            {DISCIPLINES.map((d) => (
              <Link
                key={d.key}
                className={`collage-tile tile-${d.key}`}
                to={d.href}
                aria-label={`Entrar a ${d.label}`}
              >
                <div className="collage-inner">
                  <img src={d.img} alt="" />
                  <div className="collage-meta">
                    <em>{d.tag}</em>
                    <span>{d.label}</span>
                    <b>Entrar →</b>
                  </div>
                </div>
              </Link>
            ))}

            <div className="collage-center">
              <div className="collage-inner">
                <RocaLogo className="collage-logo" />
                <h1 id="hero-title">
                  Más que ligas,
                  <br />
                  creamos <em>comunidad.</em>
                </h1>
                <p>
                  Fútbol, básquet, box, flag, béisbol, voleibol y ciclismo: ligas,
                  credenciales Upper Deck y estadísticas en un solo lugar.
                </p>
                <div className="hero-actions">
                  <Link className="btn btn-primary" to="/deportes">
                    <span>Ver deportes</span>
                  </Link>
                  <Link className="btn btn-outline" to="/auth">
                    <span>Regístrate</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="home-marquee" aria-hidden="true">
          <div className="home-marquee-track">
            {[0, 1].map((copy) => (
              <span key={copy}>
                {DISCIPLINES.map((d) => (
                  <b key={d.key}>{d.label}</b>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section className="section-pad" id="ligas">
          <div className="section-head row-between">
            <div>
              <p className="eyebrow">Disciplinas</p>
              <h2>Elige tu deporte</h2>
            </div>
            <Link className="text-link" to="/deportes">
              Ver todas →
            </Link>
          </div>
          <div className="discipline-grid all-sports">
            {DISCIPLINES.map((d) => (
              <Link
                key={d.key}
                className={`discipline-card hook-card ${d.key === "boxing" ? "is-boxing" : ""}`}
                to={d.href}
              >
                <img src={d.img} alt={d.label} />
                <div className="hook-meta">
                  <em>{d.tag}</em>
                  <span>{d.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-pad home-steps" aria-labelledby="steps-title">
          <div className="section-head">
            <p className="eyebrow">Cómo funciona</p>
            <h2 id="steps-title">De la inscripción a la cancha</h2>
          </div>
          <ol>
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="home-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="home-box" aria-labelledby="home-box-title">
          <div className="home-box-media" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1495555687398-3f50d6e79e1e?auto=format&fit=crop&w=1600&q=80"
              alt=""
            />
          </div>
          <div className="home-box-copy">
            <p className="eyebrow">ROCA Box · Durango</p>
            <h2 id="home-box-title">
              El box de Durango,
              <br />
              <em>en un solo lugar.</em>
            </h2>
            <p>
              Campeones por división, ranking libra por libra, cartelera de peleas y el
              directorio de gimnasios de la capital y los municipios.
            </p>

            <dl className="home-box-stats">
              <div>
                <dt>Gimnasios</dt>
                <dd>{BOXING_GYMS.length}</dd>
              </div>
              <div>
                <dt>Divisiones</dt>
                <dd>{DURANGO_CHAMPIONS.length}</dd>
              </div>
              <div>
                <dt>En cartelera</dt>
                <dd>{BOXING_SCHEDULE.length}</dd>
              </div>
            </dl>

            {NEXT_BOUT && (
              <article className="home-bout">
                <header>
                  <span>Próxima pelea</span>
                  <time>{NEXT_BOUT.dateLabel}</time>
                </header>
                <div className="home-bout-row">
                  <strong>{NEXT_BOUT.left.name}</strong>
                  <b>VS</b>
                  <strong>{NEXT_BOUT.right.name}</strong>
                </div>
                <small>{NEXT_BOUT.venue}</small>
              </article>
            )}

            <div className="hero-actions">
              <Link className="btn btn-primary" to="/box">
                Entrar a ROCA Box
              </Link>
              <a className="btn btn-outline" href="/box#gimnasios">
                Buscar gimnasio
              </a>
            </div>
          </div>
        </section>

        <section className="section-pad news-section" id="noticias">
          <div className="section-head row-between">
            <div>
              <p className="eyebrow">Noticias</p>
              <h2>Lo que se mueve en ROCA</h2>
            </div>
            <Link className="text-link" to="/deportes">
              Ver disciplinas →
            </Link>
          </div>
          <div className="news-grid">
            {NEWS.map((item) => (
              <Link key={item.title} className="news-card" to={item.href}>
                <img src={item.img} alt="" />
                <div>
                  <em>{item.tag}</em>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-cta" id="registro">
          <div>
            <h2>¿Listo para jugar?</h2>
            <p>Regístrate, únete a tu liga y reclama tu credencial.</p>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-dark" to="/auth">
              Entrar / Registrarse
            </Link>
            <Link className="btn home-cta-ghost" to="/deportes">
              Ver deportes
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
