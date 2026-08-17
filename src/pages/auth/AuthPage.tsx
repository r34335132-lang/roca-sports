import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { useAuth } from "@/context/AuthContext";
import { dashboardPath } from "@/lib/roles";

export function AuthPage() {
  const { signIn, signUp, configured } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const nextRole =
        mode === "login"
          ? await signIn(email, password)
          : await signUp(email, password, fullName);
      navigate(dashboardPath(nextRole), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo autenticar");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="auth-page section-pad">
        <div className="auth-card">
          <p className="eyebrow">Cuenta ROCA</p>
          <h1>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
          {!configured && (
            <p className="warn-banner">
              Configura <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> en
              tu <code>.env</code> (misma DB que Los Rafas).
            </p>
          )}
          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Registro
            </button>
          </div>
          <form onSubmit={onSubmit} className="auth-form">
            {mode === "register" && (
              <label>
                Nombre completo
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Tu nombre"
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button className="btn btn-primary" type="submit" disabled={busy || !configured}>
              {busy ? "Entrando..." : mode === "login" ? "Entrar" : "Registrarme"}
            </button>
          </form>
          <p className="muted">
            El admin entra al centro de operaciones. El dueño, a su liga. El jugador, a su
            credencial.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
