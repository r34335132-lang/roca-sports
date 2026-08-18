import { formatDiff, getStandingFields, type StandingKey, type StandingRow } from "@/lib/standings";
import type { Team } from "@/lib/types";

export function StandingsTable({
  sport,
  teams,
  rows,
  accent,
  editable = false,
  onChange,
}: {
  sport?: string | null;
  teams: Team[];
  rows: StandingRow[];
  accent?: string;
  editable?: boolean;
  onChange?: (teamId: string, key: StandingKey, value: string) => void;
}) {
  const fields = getStandingFields(sport);

  return (
    <div className="table-wrap standings-wrap">
      <table className="standings-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            {fields.map((field) => (
              <th key={field.key} title={field.label}>
                {field.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const team = teams.find((t) => t.id === row.team_id);
            return (
              <tr key={row.team_id}>
                <td className="rank">{index + 1}</td>
                <td>
                  <strong>{team?.name ?? "Equipo"}</strong>
                </td>
                {fields.map((field) => {
                  const raw = row[field.key];
                  const display = field.signed ? formatDiff(raw) : raw;
                  if (editable && !field.computed && onChange) {
                    return (
                      <td key={field.key}>
                        <input
                          type="number"
                          min={field.signed ? undefined : 0}
                          value={raw}
                          aria-label={`${team?.name ?? "Equipo"} ${field.label}`}
                          onChange={(e) => onChange(row.team_id, field.key, e.target.value)}
                        />
                      </td>
                    );
                  }
                  return (
                    <td
                      key={field.key}
                      className={field.key === "points" ? "is-points" : ""}
                      style={field.key === "points" ? { color: accent } : undefined}
                    >
                      {display}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
