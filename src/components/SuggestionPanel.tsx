import type { ErrorItem } from '../types';

const CAT_COLOR: Record<string, string> = {
  맞춤법: '#ef4444',
  띄어쓰기: '#f59e0b',
  문법: '#8b5cf6',
  표현: '#10b981',
};

export function SuggestionPanel({
  errors,
  onApply,
  onApplyAll,
  onIgnore,
}: {
  errors: ErrorItem[];
  onApply: (e: ErrorItem) => void;
  onApplyAll: () => void;
  onIgnore?: (id?: string) => void;
}) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h3>교정 제안 ({errors.length})</h3>
        <button className="btn btn-primary" onClick={onApplyAll} disabled={errors.length === 0}>
          모두 적용
        </button>
      </div>
      <div className="panel-list">
        {errors.length === 0 && <p className="muted">발견된 오류가 없습니다.</p>}
        {errors.map((e) => (
          <div key={e.id} className="suggestion-card">
            <div className="suggestion-top">
              <span className="badge" style={{ background: CAT_COLOR[e.category] }}>{e.category}</span>
              <span className="pos">{e.start + 1}자</span>
            </div>
            <div className="suggestion-body">
              <span className="original">{e.original}</span>
              <span className="arrow">→</span>
              <span className="suggestion">{e.suggestion}</span>
            </div>
            <p className="reason">{e.reason}</p>
            <div className="suggestion-actions">
              <button className="btn btn-small" onClick={() => onApply(e)}>적용</button>
              {onIgnore && <button className="btn btn-small" onClick={() => onIgnore(e.ruleId)}>제외</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
