import { useRef } from 'react';
import type { ErrorItem } from '../types';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function Editor({
  value,
  onChange,
  errors,
}: {
  value: string;
  onChange: (v: string) => void;
  errors: ErrorItem[];
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const ovRef = useRef<HTMLDivElement>(null);

  const sync = () => {
    if (taRef.current && ovRef.current) {
      ovRef.current.scrollTop = taRef.current.scrollTop;
      ovRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const sorted = [...errors].sort((a, b) => a.start - b.start);
  let html = '';
  let cursor = 0;
  for (const e of sorted) {
    if (e.start > cursor) html += esc(value.slice(cursor, e.start));
    html += `<mark class="err err-${e.category}" title="${esc(e.reason)}">${esc(e.original)}</mark>`;
    cursor = e.end;
  }
  if (cursor < value.length) html += esc(value.slice(cursor));
  if (value.endsWith('\n')) html += ' '; // preserve trailing newline

  return (
    <div className="editor-wrap">
      <div ref={ovRef} className="editor-overlay" dangerouslySetInnerHTML={{ __html: html }} />
      <textarea
        ref={taRef}
        className="editor-textarea"
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
        onScroll={sync}
        spellCheck={false}
      />
    </div>
  );
}
