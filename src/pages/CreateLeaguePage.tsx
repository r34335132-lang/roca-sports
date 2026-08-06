import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "@/components/layout/SiteHeader";
import { PlayerCardPreview } from "@/components/credentials/PlayerCardPreview";
import { useAuth } from "@/context/AuthContext";
import { createLeague, slugify, uploadLeagueAsset } from "@/lib/services/leagues";
import { getSportCardConfig } from "@/lib/cardSportConfig";
import type { LeagueCategory, LeagueInput, PlayerProfile, SportType, VisualStyle } from "@/lib/types";

const SPORTS: SportType[] = ["soccer", "basketball", "volleyball", "flag", "baseball", "cycling", "other"];
const CATEGORIES: LeagueCategory[] = ["varonil", "femenil", "mixto", "infantil", "juvenil", "libre"];
const STYLES: VisualStyle[] = ["upper_deck", "modern", "urban", "minimal", "classic"];

export function CreateLeaguePage() {
  const { user, configured, refreshRoles } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<LeagueInput>({
    name: "",
    slug: "",
    city: "Durango",
    state: "Dgo",
    sport: "soccer",
    category: "libre",
    season: "Apertura 2026",
    description: "",
    logo_url: null,
    banner_url: null,
    primary_color: "#b9ff00",
    secondary_color: "#0a0d0f",
    accent_color: "#ddff3e",
    visual_style: "upper_deck",
    public_profiles_enabled: true,
  });

  useEffect(() => {
    const cfg = getSportCardConfig(form.sport);
    setForm((f) => ({
      ...f,
      accent_color: cfg.accent,
      primary_color: cfg.accent,
    }));
  }, [form.sport]);

  if (!configured) {
    return (
      <>
        <SiteHeader />
        <main className="section-pad">
          <p className="warn-banner">Configura el .env de Supabase para crear ligas.</p>
        </main>
      </>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const demoProfile: PlayerProfile = {
    id: "demo",
    league_id: "demo",
    team_id: null,
    auth_user_id: null,
    full_name: "Demo Player",
    nickname: null,
    number: "10",
    position: "DEL",
    birth_date: null,
    photo_url: null,
    status: "active",
    credential_code: "DEMO-PLAYER-2026-0001",
    created_at: "",
    updated_at: "",
    league: {
      id: "demo",
      owner_id: user.id,
      ...form,
      description: form.description ?? null,
      logo_url: form.logo_url ?? null,
      banner_url: form.banner_url ?? null,
      created_at: "",
      updated_at: "",
    },
    team: {
      id: "t",
      league_id: "demo",
      name: "ROCA FC",
      logo_url: null,
      primary_color: null,
      secondary_color: null,
      coach_name: null,
      created_at: "",
    },
    stats: {
      id: "s",
      player_id: "demo",
      league_id: "demo",
      season: form.season,
      games: 5,
      points: 12,
      touchdowns: 3,
      goals: 7,
      assists: 2,
      tackles: 1,
      interceptions: 1,
      mvp_count: 1,
      created_at: "",
      updated_at: "",
    },
  };

  const onUpload = async (file: File | null, field: "logo_url" | "banner_url") => {
    if (!file) return;
    try {
      const url = await uploadLeagueAsset(file, field === "logo_url" ? "logos" : "banners");
      setForm((f) => ({ ...f, [field]: url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir imagen");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const league = await createLeague({
        ...form,
        slug: form.slug || slugify(form.name),
      });
      await refreshRoles();
      navigate(`/dashboard/dueno?liga=${league.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la liga");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <main className="section-pad create-league">
        <div className="section-head">
          <p className="eyebrow">Dueño de liga</p>
          <h1>Crear y personalizar tu liga</h1>
          <p className="muted">Banner, logo, colores, estilo visual y deporte para tu Upper Deck.</p>
        </div>

        <div className="wizard-steps">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              className={step === n ? "active" : ""}
              onClick={() => setStep(n)}
            >
              Paso {n}
            </button>
          ))}
        </div>

        <form className="wizard-grid" onSubmit={onSubmit}>
          <div className="dash-panel">
            {step === 1 && (
              <>
                <h3>Info</h3>
                <label>
                  Nombre
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                        slug: slugify(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Slug
                  <input
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  />
                </label>
                <div className="form-row">
                  <label>
                    Ciudad
                    <input
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </label>
                  <label>
                    Estado
                    <input
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                    />
                  </label>
                </div>
                <div className="form-row">
                  <label>
                    Deporte
                    <select
                      value={form.sport}
                      onChange={(e) => setForm({ ...form, sport: e.target.value as SportType })}
                    >
                      {SPORTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Categoría
                    <select
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value as LeagueCategory })
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Temporada
                  <input
                    required
                    value={form.season}
                    onChange={(e) => setForm({ ...form, season: e.target.value })}
                  />
                </label>
                <label>
                  Descripción
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                  />
                </label>
              </>
            )}

            {step === 2 && (
              <>
                <h3>Branding</h3>
                <label>
                  Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void onUpload(e.target.files?.[0] ?? null, "logo_url")}
                  />
                </label>
                <label>
                  Banner
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => void onUpload(e.target.files?.[0] ?? null, "banner_url")}
                  />
                </label>
                <div className="form-row">
                  <label>
                    Primario
                    <input
                      type="color"
                      value={form.primary_color}
                      onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                    />
                  </label>
                  <label>
                    Secundario
                    <input
                      type="color"
                      value={form.secondary_color}
                      onChange={(e) => setForm({ ...form, secondary_color: e.target.value })}
                    />
                  </label>
                  <label>
                    Acento
                    <input
                      type="color"
                      value={form.accent_color}
                      onChange={(e) => setForm({ ...form, accent_color: e.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Estilo visual
                  <select
                    value={form.visual_style}
                    onChange={(e) =>
                      setForm({ ...form, visual_style: e.target.value as VisualStyle })
                    }
                  >
                    {STYLES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {step === 3 && (
              <>
                <h3>Preview Upper Deck</h3>
                <p className="muted">Así se verá la carta premium de tus jugadores.</p>
              </>
            )}

            {step === 4 && (
              <>
                <h3>Confirmar</h3>
                <ul className="simple-list">
                  <li>
                    <strong>{form.name}</strong>
                    <span>{form.sport}</span>
                  </li>
                  <li>
                    <strong>
                      {form.city}, {form.state}
                    </strong>
                    <span>{form.season}</span>
                  </li>
                  <li>
                    <strong>Estilo {form.visual_style}</strong>
                    <span>Cuota default $80 · comisión 50%</span>
                  </li>
                </ul>
                {error && <p className="form-error">{error}</p>}
                <button className="btn btn-primary" type="submit" disabled={busy}>
                  {busy ? "Creando..." : "Crear liga"}
                </button>
              </>
            )}

            <div className="wizard-nav">
              {step > 1 && (
                <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                  Atrás
                </button>
              )}
              {step < 4 && (
                <button type="button" className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                  Siguiente
                </button>
              )}
            </div>
          </div>

          <div className="preview-pane">
            <PlayerCardPreview profile={demoProfile} />
            <Link className="text-link" to="/box">
              Ver animación del box →
            </Link>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  );
}
