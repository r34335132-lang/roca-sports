import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
  const { user, role, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 720) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const dashPath =
    role === "admin"
      ? "/dashboard/admin"
      : role === "player"
        ? "/dashboard/jugador"
        : "/dashboard/dueno";

  return (
    <header className={`site-header ${open ? "nav-open" : ""}`} id="inicio">
      <Link className="brand" to="/" aria-label="ROCA Sports inicio">
        <span className="brand-roca">ROCA</span>
        <span className="brand-sports">sports</span>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav className="main-nav" aria-label="Navegación principal">
        <NavLink to="/" end onClick={() => setOpen(false)}>
          Inicio
        </NavLink>
        <NavLink to="/deportes" onClick={() => setOpen(false)}>
          Deportes
        </NavLink>
        <NavLink to="/ligas" onClick={() => setOpen(false)}>
          Ligas
        </NavLink>
        <NavLink to="/box" onClick={() => setOpen(false)}>
          Box
        </NavLink>
        <a href="/#noticias" onClick={() => setOpen(false)}>
          Noticias
        </a>
        {user && (
          <NavLink to={dashPath} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
        )}
      </nav>

      {user ? (
        <div className="header-auth">
          <Link className="register-top" to={dashPath}>
            <span>{role === "admin" ? "Admin" : role === "player" ? "Perfil" : "Mi liga"}</span>
          </Link>
          <button className="ghost-btn" type="button" onClick={() => void signOut()}>
            Salir
          </button>
        </div>
      ) : (
        <Link className="register-top" to="/auth">
          <span>Regístrate</span>
        </Link>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="brand-roca">ROCA</span>
        <span className="brand-sports">sports</span>
      </div>
      <p>Ligas · Credenciales Upper Deck · Comunidad</p>
      <div className="footer-links">
        <Link to="/deportes">Deportes</Link>
        <Link to="/box">Box</Link>
        <a href="/#noticias">Noticias</a>
        <Link to="/crear-liga">Crear liga</Link>
        <Link to="/auth">Entrar</Link>
      </div>
    </footer>
  );
}
