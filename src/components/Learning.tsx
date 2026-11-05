import type { ErrorItem } from '../types';

export function Learning({ errors }: { errors: ErrorItem[] }) {
  const seen = new Set<string>();
  const cards: { reason: string; category: string; example: string }[] = [];
  for (const e of errors) {
    if (seen.has(e.reason)) continue;
    seen.add(e.reason);
    cards.push({ reason: e.reason, category: e.category, example: `${e.original} → ${e.suggestion}` });
  }
  return (
    <div className="panel">
      <h3>학습 모드</h3>
      {cards.length === 0 && <p className="muted">오류가 없어 학습 카드가 없습니다.</p>}
      <div className="learn-list">
        {cards.map((c, i) => (
          <div key={i} className="learn-card">
            <div className="learn-cat">{c.category}</div>
            <div className="learn-example">{c.example}</div>
            <p className="learn-reason">{c.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
