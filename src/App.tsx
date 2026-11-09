import './App.css';
import { useEffect, useState } from 'react';
import { Editor } from './components/Editor';
import { SuggestionPanel } from './components/SuggestionPanel';
import { Stats } from './components/Stats';
import { Learning } from './components/Learning';
import { useAnalysis } from './hooks/useAnalysis';
import { useSettings } from './hooks/useSettings';
import type { ErrorItem } from './types';

const LS_KEY = 'kwc:text';

const initialText = '안녕 하세요. 저는 학생 입니다. 이것은 테스트 입니다.';

export default function App() {
  const { settings, update: updateSettings } = useSettings();
  const [history, setHistory] = useState<string[]>(() => [localStorage.getItem(LS_KEY) || initialText]);
  const [hIndex, setHIndex] = useState(0);
  const text = history[hIndex];
  const [baseline, setBaseline] = useState<string>(() => localStorage.getItem(LS_KEY) || initialText);
  const [tab, setTab] = useState<'suggest' | 'stats' | 'learn' | 'diff'>('suggest');
  const [showUpdates, setShowUpdates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [updatesText, setUpdatesText] = useState('');
  const [exportFormat, setExportFormat] = useState<'txt' | 'md' | 'html'>('txt');
  const [newWrong, setNewWrong] = useState('');
  const [newCorrect, setNewCorrect] = useState('');
  const { errors } = useAnalysis(text, settings);

  const setText = (next: string) => {
    setHistory((prev) => {
      const base = prev.slice(0, hIndex + 1);
      if (base[base.length - 1] === next) return prev;
      const updated = [...base, next];
      setHIndex(updated.length - 1);
      return updated;
    });
  };

  const undo = () => setHIndex((i) => Math.max(0, i - 1));
  const redo = () => setHIndex((i) => Math.min(history.length - 1, i + 1));

  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem(LS_KEY, text), 300);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}updates.md`)
      .then((r) => r.text())
      .then(setUpdatesText)
      .catch(() => setUpdatesText(''));
  }, []);

  const applyError = (e: ErrorItem) => {
    setText(text.slice(0, e.start) + e.suggestion + text.slice(e.end));
  };

  const applyAll = () => {
    const sorted = [...errors].sort((a, b) => b.start - a.start);
    let t = text;
    for (const e of sorted) t = t.slice(0, e.start) + e.suggestion + t.slice(e.end);
    setText(t);
  };

  const exportText = () => {
    let content = text;
    let mime = 'text/plain;charset=utf-8';
    let ext = 'txt';
    if (exportFormat === 'md') {
      content = `# 교정된 텍스트\n\n${text}\n\n## 교정 내역\n\n${errors
        .map((e) => `- ${e.original} → ${e.suggestion} (${e.category})`)
        .join('\n')}`;
      mime = 'text/markdown;charset=utf-8';
      ext = 'md';
    } else if (exportFormat === 'html') {
      content = `<!doctype html><html><head><meta charset="utf-8"><title>교정 결과</title></head><body><pre>${text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')}</pre></body></html>`;
      mime = 'text/html;charset=utf-8';
      ext = 'html';
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `corrected.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => setText('');
  const resetBaseline = () => setBaseline(text);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo(); }
      else if (e.key === 's') { e.preventDefault(); exportText(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [history, hIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const ignoreRule = (id?: string) => {
    if (!id) return;
    if (settings.ignoredRuleIds.includes(id)) return;
    updateSettings({ ignoredRuleIds: [...settings.ignoredRuleIds, id] });
  };

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>한국어 작문 교정기</h1>
          <span className="subtitle">로컬 분석 · 데이터 전송 없음</span>
        </div>
        <div className="topbar-actions">
          <div className="toolbar-group">
            <button className="icon-btn" onClick={undo} disabled={hIndex === 0} aria-label="되돌리기" title="되돌리기 (Ctrl+Z)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button className="icon-btn" onClick={redo} disabled={hIndex === history.length - 1} aria-label="다시 실행" title="다시 실행 (Ctrl+Shift+Z)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
            </button>
          </div>
          <div className="toolbar-group">
            <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as any)} className="select" aria-label="내보내기 형식">
              <option value="txt">TXT</option>
              <option value="md">MD</option>
              <option value="html">HTML</option>
            </select>
            <button className="btn btn-small" onClick={exportText}>내보내기</button>
          </div>
          <div className="toolbar-group">
            <button className="btn btn-small btn-ghost" onClick={clear}>초기화</button>
            <button className="btn btn-small btn-ghost" onClick={() => setShowSettings(true)}>설정</button>
            <button className="btn btn-small btn-ghost" onClick={() => setShowUpdates(true)}>업데이트</button>
          </div>
        </div>
      </header>
      <main className="main">
        <section className="editor-section">
          <div className="editor-wrap">
            <Editor value={text} onChange={setText} errors={errors} />
            <div className="editor-footer">
              <div className="legend">
                <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--accent)' }} />맞춤법</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--warn)' }} />띄어쓰기</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--info)' }} />문법</span>
                <span className="legend-item"><span className="legend-dot" style={{ background: 'var(--ok)' }} />표현</span>
              </div>
              <div className="counts">
                <span>오류 {errors.length}건</span>
                <span>{chars}자 · {words}단어</span>
              </div>
            </div>
          </div>
        </section>
        <aside className="side">
          <div className="tabs">
            <button className={tab === 'suggest' ? 'tab active' : 'tab'} onClick={() => setTab('suggest')}>제안</button>
            <button className={tab === 'stats' ? 'tab active' : 'tab'} onClick={() => setTab('stats')}>통계</button>
            <button className={tab === 'learn' ? 'tab active' : 'tab'} onClick={() => setTab('learn')}>학습</button>
            <button className={tab === 'diff' ? 'tab active' : 'tab'} onClick={() => setTab('diff')}>비교</button>
          </div>
          {tab === 'suggest' && <SuggestionPanel errors={errors} onApply={applyError} onApplyAll={applyAll} onIgnore={ignoreRule} />}
          {tab === 'stats' && <Stats errors={errors} />}
          {tab === 'learn' && <Learning errors={errors} />}
          {tab === 'diff' && (
            <div className="panel">
              <div className="panel-header">
                <h3>비교</h3>
                <button className="btn btn-small" onClick={resetBaseline}>현재를 기준으로</button>
              </div>
              <div className="diff-grid">
                <div>
                  <div className="diff-title">원본</div>
                  <pre className="diff-pre">{baseline}</pre>
                </div>
                <div>
                  <div className="diff-title">현재</div>
                  <pre className="diff-pre">{text}</pre>
                </div>
              </div>
            </div>
          )}
        </aside>
      </main>

      {showUpdates && (
        <div className="modal-backdrop" onClick={() => setShowUpdates(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>업데이트 내역</h2>
            <pre className="updates-pre">{updatesText || '내역이 없습니다.'}</pre>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowUpdates(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-backdrop" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>설정</h2>
            <div className="setting-row">
              <span>디바운스 (ms)</span>
              <input
                type="number"
                value={settings.debounceMs}
                onChange={(e) => updateSettings({ debounceMs: Number(e.target.value) || 300 })}
              />
            </div>
            <div className="setting-row">
              <span>최소 신뢰도</span>
              <div className="row-inline">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.minConfidence}
                  onChange={(e) => updateSettings({ minConfidence: Number(e.target.value) })}
                />
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{settings.minConfidence.toFixed(2)}</span>
              </div>
            </div>
            <div className="setting-row">
              <span>제외된 규칙 ({settings.ignoredRuleIds.length})</span>
              <div className="row-inline">
                {settings.ignoredRuleIds.length === 0 && <span className="muted">없음</span>}
                {settings.ignoredRuleIds.map((id) => (
                  <button
                    key={id}
                    className="btn btn-small"
                    onClick={() =>
                      updateSettings({ ignoredRuleIds: settings.ignoredRuleIds.filter((x) => x !== id) })
                    }
                  >
                    {id} 해제
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-row">
              <span>사용자 사전 추가</span>
              <div className="row-inline">
                <input value={newWrong} onChange={(e) => setNewWrong(e.target.value)} placeholder="틀린 표현" />
                <input value={newCorrect} onChange={(e) => setNewCorrect(e.target.value)} placeholder="올바른 표현" />
                <button
                  className="btn btn-small btn-primary"
                  onClick={() => {
                    if (!newWrong || !newCorrect) return;
                    updateSettings({
                      userDictionary: [...settings.userDictionary, { wrong: newWrong, correct: newCorrect, category: '맞춤법' }],
                    });
                    setNewWrong('');
                    setNewCorrect('');
                  }}
                >
                  추가
                </button>
              </div>
            </div>
            <div className="setting-row">
              <span>설정 내보내기 / 가져오기</span>
              <div className="row-inline">
                <button
                  className="btn btn-small"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'kwc-settings.json';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  내보내기
                </button>
                <input
                  type="file"
                  accept="application/json"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const txt = await f.text();
                    try {
                      const parsed = JSON.parse(txt);
                      updateSettings(parsed);
                    } catch {}
                  }}
                />
              </div>
            </div>
            <div className="setting-row">
              <span className="muted">규칙 버전: 2026-11-05</span>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowSettings(false)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}