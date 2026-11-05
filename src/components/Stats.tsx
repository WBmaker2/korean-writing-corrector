import type { ErrorItem } from '../types';

export function Stats({ errors }: { errors: ErrorItem[] }) {
  const counts: Record<string, number> = {};
  for (const e of errors) counts[e.category] = (counts[e.category] || 0) + 1;
  const total = errors.length;
  const cats = ['맞춤법', '띄어쓰기', '문법', '표현'];
  return (
    <div className="panel">
      <h3>통계</h3>
      <p className="muted">총 {total}건</p>
      <div className="stats-grid">
        {cats.map((c) => (
          <div key={c} className="stat-card">
            <div className="stat-label">{c}</div>
            <div className="stat-value">{counts[c] || 0}</div>
          </div>
        ))}
      </div>
      {errors.length > 0 && (
        <div className="stats-list">
          {errors.map((e) => (
            <div key={e.id} className="stats-row">
              <span className="badge-sm">{e.category}</span>
              <span>{e.original} → {e.suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
