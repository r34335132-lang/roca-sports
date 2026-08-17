import { useEffect, useMemo, useState } from "react";
import { LeagueMark, RocaLogo } from "@/components/brand/RocaLogo";
import { PlayerCredentialCard } from "@/components/credentials/PlayerCredentialCard";
import { hexColor } from "@/lib/brand";
import { updateLeague, uploadLeagueAsset } from "@/lib/services/leagues";
import {
  CATEGORY_OPTIONS,
  SPORT_LABELS,
  SPORT_OPTIONS,
  type League,
  type LeagueCategory,
  type PlayerProfile,
  type SportType,
} from "@/lib/types";

type BrandDraft = {
  name: string;
  city: string;
  state: string;
  sport: SportType;
  category: LeagueCategory;
  season: string;
  description: string;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
};

function fromLeague(league: League): BrandDraft {
  return {
    name: league.name,
    city: league.city,
    state: league.state,
    sport: league.sport,
    category: league.category,
    season: league.season,
    description: league.description ?? "",
    logo_url: league.logo_url,
    banner_url: league.banner_url,
    primary_color: hexColor(league.primary_color, "#121212"),
    secondary_color: hexColor(league.secondary_color, "#333333"),
    accent_color: hexColor(league.accent_color, "#b9ff00"),
  };
}

export function LeagueBrandEditor({
  league,
  onSaved,
}: {
  league: League;
  onSaved: (league: League) => Promise<void> | void;
}) {
  const [draft, setDraft] = useState<BrandDraft>(() => fromLeague(league));
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<"logo_url" | "banner_url" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setDraft(fromLeague(league));
    setError(null);
    setMsg(null);
  }, [league.id]);

  const previewLeague = useMemo(
    () => ({
      ...league,
      ...draft,
      name: draft.name.trim() || league.name,
      description: draft.description.trim() || null,
    }),
    [league, draft],
  );

  const preview: PlayerProfile = useMemo(
    () => ({
      id: "brand-preview",
      league_id: league.id,
      team_id: null,
      auth_user_id: null,
      full_name: "Jugador de muestra",
      nickname: null,
      number: "10",
      position: "ATH",
      birth_date: null,
      photo_url: null,
      status: "active",
      credential_code: "ROCA-PLAYER-2026-0001",
      created_at: "",
      updated_at: "",
      league: previewLeague,
      team: null,
      stats: {
        id: "preview-stats",
        player_id: "brand-preview",
        league_id: league.id,
        season: draft.season,
        games: 8,
        points: 12,
        touchdowns: 4,
        goals: 6,
        assists: 3,
        tackles: 2,
        interceptions: 1,
        mvp_count: 1,
        created_at: "",
        updated_at: "",
      },
    }),
    [league, previewLeague, draft.season],
  );

  const onUpload = async (file: File | null, field: "logo_url" | "banner_url") => {
    if (!file) return;
    setUploading(field);
    setError(null);
    try {
      const url = await uploadLeagueAsset(file, field === "logo_url" ? "logos" : "banners");
      setDraft((d) => ({ ...d, [field]: url }));
      setMsg(field === "logo_url" ? "Logo listo. Guarda para publicarlo." : "Banner listo. Guarda para publicarlo.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo subir la imagen");
    } finally {
      setUploading(null);
    }
  };

  const onSave = async () => {
    setBusy(true);
    setError(null);
    try {
      const updated = await updateLeague(league.id, {
        name: draft.name.trim() || league.name,
        city: draft.city.trim() || league.city,
        state: draft.state.trim() || league.state,
        sport: draft.sport,
        category: draft.category,
        season: draft.season.trim() || league.season,
        description: draft.description.trim(),
        logo_url: draft.logo_url,
        banner_url: draft.banner_url,
        primary_color: draft.primary_color,
        secondary_color: draft.secondary_color,
        accent_color: draft.accent_color,
      });
      await onSaved(updated);
      setMsg("Liga actualizada. El logo y los colores ya salen en la credencial.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar la liga");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="dash-panel league-brand-editor">
      <h3>Editar liga y credencial</h3>
      <p className="muted">
        Sube el logo del torneo. ROCA Sport aparece como quien impulsa la liga.
        Los colores que elijas se usan en la credencial.
      </p>

      <label>
        Nombre de la liga
        <input
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </label>

      <div className="form-row">
        <label>
          Ciudad
          <input
            value={draft.city}
            onChange={(e) => setDraft({ ...draft, city: e.target.value })}
          />
        </label>
        <label>
          Estado
          <input
            value={draft.state}
            onChange={(e) => setDraft({ ...draft, state: e.target.value })}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Deporte
          <select
            value={draft.sport}
            onChange={(e) => setDraft({ ...draft, sport: e.target.value as SportType })}
          >
            {SPORT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {SPORT_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Categoría
          <select
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value as LeagueCategory })}
          >
            {CATEGORY_OPTIONS.map((c) => (
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
          value={draft.season}
          onChange={(e) => setDraft({ ...draft, season: e.target.value })}
        />
      </label>

      <label>
        Descripción
        <textarea
          rows={3}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </label>

      <div className="brand-uploads">
        <label className="brand-upload">
          Logo del torneo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => void onUpload(e.target.files?.[0] ?? null, "logo_url")}
          />
          <span className="muted">{uploading === "logo_url" ? "Subiendo…" : "PNG o JPG"}</span>
          <div className="brand-preview-row">
            <LeagueMark league={previewLeague} />
            <small>Sale en la credencial junto a ROCA</small>
          </div>
        </label>
        <label className="brand-upload">
          Banner (opcional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => void onUpload(e.target.files?.[0] ?? null, "banner_url")}
          />
          <span className="muted">{uploading === "banner_url" ? "Subiendo…" : "Portada de la liga"}</span>
          {draft.banner_url && (
            <img className="banner-thumb" src={draft.banner_url} alt="" />
          )}
        </label>
      </div>

      <div className="powered-by-note">
        <RocaLogo className="roca-logo sm" />
        <span>ROCA Sport ayuda a operar tu torneo. Este logo no se cambia.</span>
      </div>

      <h4>Colores de la credencial</h4>
      <div className="color-fields">
        <label>
          Primario
          <input
            type="color"
            value={draft.primary_color}
            onChange={(e) => setDraft({ ...draft, primary_color: e.target.value })}
          />
          <small>Fondo de la credencial</small>
        </label>
        <label>
          Secundario
          <input
            type="color"
            value={draft.secondary_color}
            onChange={(e) => setDraft({ ...draft, secondary_color: e.target.value })}
          />
          <small>Placas, marco y barra de stats</small>
        </label>
        <label>
          Acento
          <input
            type="color"
            value={draft.accent_color}
            onChange={(e) => setDraft({ ...draft, accent_color: e.target.value })}
          />
          <small>Bordes, números y highlights</small>
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}
      {msg && <p className="ok-banner">{msg}</p>}

      <button className="btn btn-primary" type="button" disabled={busy} onClick={() => void onSave()}>
        {busy ? "Guardando…" : "Guardar liga"}
      </button>

      <div className="brand-live-preview">
        <p className="eyebrow">Vista previa</p>
        <PlayerCredentialCard profile={preview} />
      </div>
    </section>
  );
}
