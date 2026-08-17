import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { PlayerCardPreview } from "@/components/credentials/PlayerCardPreview";
import { PlayerCredentialCard } from "@/components/credentials/PlayerCredentialCard";
import { SPORT_POSITIONS, validatePlayerForm } from "@/lib/playerStudio";
import {
  createPlayer,
  createTeam,
  fetchPlayersByLeague,
  fetchTeamsByLeague,
  updatePlayer,
  uploadLeagueAsset,
} from "@/lib/services/leagues";
import type { League, Player, PlayerProfile, Team } from "@/lib/types";

const emptyForm = {
  full_name: "",
  nickname: "",
  number: "10",
  position: "",
  team_id: "",
  photo_url: "",
};

export function PlayerStudio({
  leagues,
  defaultLeagueId,
}: {
  leagues: League[];
  defaultLeagueId?: string;
}) {
  const [leagueId, setLeagueId] = useState(defaultLeagueId || leagues[0]?.id || "");
  const league = leagues.find((l) => l.id === leagueId) ?? leagues[0] ?? null;
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [showPass, setShowPass] = useState(false);

  const positions = SPORT_POSITIONS[league?.sport ?? "other"] ?? SPORT_POSITIONS.other;

  const load = async (id: string) => {
    const [t, p] = await Promise.all([fetchTeamsByLeague(id), fetchPlayersByLeague(id)]);
    setTeams(t);
    setPlayers(p);
  };

  useEffect(() => {
    if (defaultLeagueId) setLeagueId(defaultLeagueId);
  }, [defaultLeagueId]);

  useEffect(() => {
    if (!leagueId) return;
    void load(leagueId).catch((e) => setError(String(e.message ?? e)));
    setEditingId(null);
    setForm((f) => ({ ...emptyForm, position: SPORT_POSITIONS[league?.sport ?? "other"]?.[0] ?? "ATH" }));
  }, [leagueId]);

  const selectedTeam = teams.find((t) => t.id === form.team_id) ?? null;

  const preview: PlayerProfile | null = useMemo(() => {
    if (!league) return null;
    return {
      id: editingId ?? "preview",
      league_id: league.id,
      team_id: selectedTeam?.id ?? null,
      auth_user_id: null,
      full_name: form.full_name.trim() || "Nuevo jugador",
      nickname: form.nickname || null,
      number: form.number || "00",
      position: form.position || positions[0] || "ATH",
      birth_date: null,
      photo_url: form.photo_url || null,
      status: "active",
      credential_code: "ROCA-PLAYER-2026-0001",
      created_at: "",
      updated_at: "",
      league,
      team: selectedTeam,
      stats: null,
    };
  }, [league, form, selectedTeam, editingId, positions]);

  const fillPlayer = (p: Player) => {
    setEditingId(p.id);
    setForm({
      full_name: p.full_name,
      nickname: p.nickname ?? "",
      number: p.number,
      position: p.position,
      team_id: p.team_id ?? "",
      photo_url: p.photo_url ?? "",
    });
    setMsg(null);
    setError(null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!league) return;
    const issues = validatePlayerForm(form);
    if (issues.length) {
      setError(issues[0]);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const payload = {
        league_id: league.id,
        team_id: form.team_id || null,
        full_name: form.full_name.trim(),
        nickname: form.nickname.trim() || null,
        number: form.number.trim(),
        position: form.position,
        photo_url: form.photo_url || null,
      };
      if (editingId) {
        await updatePlayer(editingId, payload);
        setMsg("Jugador actualizado. Credencial y carta ya usan estos datos.");
      } else {
        await createPlayer(payload);
        setMsg("Jugador registrado con credencial y Upper Deck.");
        setForm({ ...emptyForm, position: positions[0] ?? "ATH" });
      }
      await load(league.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el jugador");
    } finally {
      setBusy(false);
    }
  };

  if (!league) {
    return (
      <section className="dash-panel">
        <h3>Plantilla</h3>
        <p className="muted">Crea una liga para registrar jugadores.</p>
      </section>
    );
  }

  return (
    <section className="player-studio">
      <div className="section-head row-between">
        <div>
          <p className="eyebrow">Estudio de carta</p>
          <h2>Registrar y editar jugadores</h2>
          <p className="muted">
            Alta, foto y edición en vivo. La credencial y la Prizm se arman con los datos de la liga.
          </p>
        </div>
        {leagues.length > 1 && (
          <label className="studio-league">
            Liga
            <select value={league.id} onChange={(e) => setLeagueId(e.target.value)}>
              {leagues.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {error && <p className="form-error">{error}</p>}
      {msg && <p className="ok-banner">{msg}</p>}

      <div className="studio-grid">
        <div className="studio-preview">
          <div className="studio-toggles">
            <button
              type="button"
              className={!showPass ? "chip active" : "chip"}
              onClick={() => setShowPass(false)}
            >
              Upper Deck
            </button>
            <button
              type="button"
              className={showPass ? "chip active" : "chip"}
              onClick={() => setShowPass(true)}
            >
              Credencial
            </button>
          </div>
          {preview && (showPass ? <PlayerCredentialCard profile={preview} /> : <PlayerCardPreview profile={preview} />)}
        </div>

        <form className="dash-panel studio-form" onSubmit={onSubmit}>
          <h3>{editingId ? "Editar jugador" : "Nuevo jugador"}</h3>
          <label>
            Nombre completo
            <input
              required
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Ej. Luis Morales"
            />
          </label>
          <div className="form-row">
            <label>
              Apodo
              <input
                value={form.nickname}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                placeholder="Opcional"
              />
            </label>
            <label>
              Número
              <input
                required
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Posición
              <select
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              >
                {positions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Equipo
              <select
                value={form.team_id}
                onChange={(e) => setForm({ ...form, team_id: e.target.value })}
              >
                <option value="">Sin equipo</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Foto del jugador
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const url = await uploadLeagueAsset(file, "players");
                  setForm((f) => ({ ...f, photo_url: url }));
                } catch (err) {
                  setError(err instanceof Error ? err.message : "No se pudo subir la foto");
                }
              }}
            />
          </label>
          <div className="wizard-nav">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Guardando..." : editingId ? "Guardar cambios" : "Registrar jugador"}
            </button>
            {editingId && (
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm({ ...emptyForm, position: positions[0] ?? "ATH" });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="dash-split">
        <section className="dash-panel">
          <h3>Equipo rápido</h3>
          <form
            className="inline-form"
            onSubmit={async (e: FormEvent) => {
              e.preventDefault();
              if (!teamName.trim()) return;
              await createTeam({ league_id: league.id, name: teamName.trim() });
              setTeamName("");
              await load(league.id);
              setMsg("Equipo creado");
            }}
          >
            <input
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Nombre del equipo"
            />
            <button className="btn btn-outline" type="submit">
              Crear
            </button>
          </form>
        </section>
        <section className="dash-panel">
          <h3>Plantilla ({players.length})</h3>
          <ul className="simple-list">
            {players.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>
                    #{p.number} {p.full_name}
                  </strong>
                  <small>
                    {p.position} · {p.teams?.name ?? "Sin equipo"}
                  </small>
                </div>
                <div className="chip-row">
                  <button type="button" className="ghost-btn" onClick={() => fillPlayer(p)}>
                    Editar
                  </button>
                  <Link className="text-link" to={`/jugador/${p.id}`}>
                    Ver
                  </Link>
                </div>
              </li>
            ))}
            {players.length === 0 && <li>Aún no hay jugadores en esta liga.</li>}
          </ul>
        </section>
      </div>
    </section>
  );
}
