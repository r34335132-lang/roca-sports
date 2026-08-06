import { Link } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { UpperDeckBox } from "@/components/box/UpperDeckBox";

const DISCIPLINES = [
  {
    key: "soccer",
    label: "Fútbol",
    img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1300&q=80",
  },
  {
    key: "basketball",
    label: "Básquetbol",
    img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "volleyball",
    label: "Voleibol",
    img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=900&q=78",
  },
  {
    key: "flag",
    label: "Flag",
    img: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=900&q=78",
  },
];

export function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-photo" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=2200&q=82"
              alt=""
            />
          </div>
          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-logo" aria-hidden="true">
                <span>ROCA</span>
                <strong>Sports</strong>
              </div>
              <h1 id="hero-title">
                Más que ligas,
                <br />
                creamos <em>comunidad.</em>
              </h1>
              <p>
                Ligas por deporte, credenciales Upper Deck y dashboards para admin,
                dueños y jugadores — conectado a la misma base de datos.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/deportes">
                  <span>Ver deportes</span>
                </Link>
                <Link className="btn btn-outline" to="/crear-liga">
                  <span>Crear liga</span>
                </Link>
              </div>
            </div>

            <div className="hero-panel" aria-label="Vistas destacadas">
              {DISCIPLINES.slice(0, 3).map((d, i) => (
                <Link
                  key={d.key}
                  className={`featured-card ${i === 0 ? "large" : ""}`}
                  to={`/deportes/${d.key}`}
                >
                  <img src={d.img} alt={d.label} />
                  <span>{d.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="scoreboard-strip" aria-label="ScoreCenter">
          <div className="score-inner">
            <strong>ROCA ScoreCenter</strong>
            <span>Credenciales · Pagos · Jornadas · Equipo de la semana</span>
          </div>
        </section>

        <section className="values section-pad">
          <div className="section-head">
            <p className="eyebrow">Plataforma</p>
            <h2>Todo lo que necesitas para operar tu liga</h2>
          </div>
          <div className="values-grid">
            <article>
              <h3>Admin</h3>
              <p>Ve quién pagó, cuántos jugadores hay y tu % de comisión del presupuesto.</p>
            </article>
            <article>
              <h3>Dueño de liga</h3>
              <p>Banner, logo, colores, estadísticas y cuánto vas a ganar por inscripción.</p>
            </article>
            <article>
              <h3>Jugador</h3>
              <p>Credencial digital + Upper Deck con el diseño de tu deporte en tu perfil.</p>
            </article>
            <article>
              <h3>Box</h3>
              <p>Animación donde las Upper Deck chocan y revelan cada deporte.</p>
            </article>
          </div>
        </section>

        <section className="section-pad" id="ligas">
          <div className="section-head">
            <p className="eyebrow">Disciplinas</p>
            <h2>Divide la página por deportes</h2>
          </div>
          <div className="discipline-grid">
            {DISCIPLINES.map((d) => (
              <Link key={d.key} className="discipline-card" to={`/deportes/${d.key}`}>
                <img src={d.img} alt={d.label} />
                <span>{d.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="section-pad box-home">
          <div className="section-head">
            <p className="eyebrow">Upper Deck</p>
            <h2>Abre el box</h2>
          </div>
          <UpperDeckBox />
        </section>

        <section className="cta-band" id="registro">
          <div>
            <h2>¿Listo para jugar?</h2>
            <p>Regístrate, crea tu liga o reclama tu credencial.</p>
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/auth">
              Entrar / Registrarse
            </Link>
            <Link className="btn btn-outline" to="/dashboard/admin">
              Dashboard admin
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
