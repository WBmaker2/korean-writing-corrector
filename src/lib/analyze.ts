import type { Rule, DictionaryEntry, ErrorItem, Category } from '../types';

export interface AnalyzeOptions {
  ignoredRuleIds?: Set<string>;
  userDictionary?: DictionaryEntry[];
  minConfidence?: number;
}

export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function makeRegex(source: string, flags: string): RegExp | null {
  try {
    const hasG = flags.includes('g');
    return new RegExp(source, hasG ? flags : flags + 'g');
  } catch {
    return null;
  }
}

function contextOk(text: string, start: number, end: number, include?: string, exclude?: string): boolean {
  const ctx = text.slice(Math.max(0, start - 12), Math.min(text.length, end + 12));
  if (include) {
    try {
      if (!new RegExp(include).test(ctx)) return false;
    } catch {
      return true;
    }
  }
  if (exclude) {
    try {
      if (new RegExp(exclude).test(ctx)) return false;
    } catch {
      return true;
    }
  }
  return true;
}

export function analyzeText(
  text: string,
  rules: Rule[],
  dictionary: DictionaryEntry[],
  options: AnalyzeOptions = {}
): ErrorItem[] {
  const ignored = options.ignoredRuleIds ?? new Set<string>();
  const dict = [...dictionary, ...(options.userDictionary ?? [])];
  const matches: {
    start: number;
    end: number;
    original: string;
    suggestion: string;
    reason: string;
    category: Category;
    ruleId?: string;
    priority: number;
    confidence: number;
  }[] = [];

  for (const d of dict) {
    if (ignored.has(`dict:${d.wrong}`)) continue;
    const cat: Category = d.category ?? '맞춤법';
    const pat = `(?<![가-힣A-Za-z0-9])${escapeRegex(d.wrong)}(?![가-힣A-Za-z0-9])`;
    const re = makeRegex(pat, '');
    if (!re) continue;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (!contextOk(text, m.index, m.index + m[0].length, d.contextInclude, d.contextExclude)) {
        if (m.index === re.lastIndex) re.lastIndex++;
        continue;
      }
      const conf = d.confidence ?? 0.9;
      if (conf < (options.minConfidence ?? 0)) {
        if (m.index === re.lastIndex) re.lastIndex++;
        continue;
      }
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        original: m[0],
        suggestion: d.correct,
        reason: d.reason ?? `'${d.wrong}'은(는) '${d.correct}'로 쓰는 것이 맞습니다.`,
        category: cat,
        ruleId: `dict:${d.wrong}`,
        priority: d.priority ?? 50,
        confidence: conf,
      });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }

  for (const r of rules) {
    if (r.enabled === false) continue;
    if (ignored.has(r.id)) continue;
    const re = makeRegex(r.pattern, r.flags ?? '');
    if (!re) continue;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      if (!contextOk(text, m.index, m.index + m[0].length, r.contextInclude, r.contextExclude)) {
        if (m.index === re.lastIndex) re.lastIndex++;
        continue;
      }
      let suggestion = r.replacement;
      suggestion = suggestion.replace(/\$(\d+)/g, (_, n) => m![Number(n)] ?? '');
      const conf = r.confidence ?? 0.85;
      if (conf < (options.minConfidence ?? 0)) {
        if (m.index === re.lastIndex) re.lastIndex++;
        continue;
      }
      if (suggestion === m[0]) {
        if (m.index === re.lastIndex) re.lastIndex++;
        continue;
      }
      matches.push({
        start: m.index,
        end: m.index + m[0].length,
        original: m[0],
        suggestion,
        reason: r.reason,
        category: r.category,
        ruleId: r.id,
        priority: r.priority ?? 40,
        confidence: conf,
      });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }

  matches.sort((a, b) => a.start - b.start || b.priority - a.priority || (b.end - b.start) - (a.end - a.start));

  const chosen: ErrorItem[] = [];
  let lastEnd = -1;
  let counter = 0;
  for (const m of matches) {
    if (m.start < lastEnd) continue;
    counter++;
    chosen.push({
      id: `e${counter}-${m.start}`,
      start: m.start,
      end: m.end,
      original: m.original,
      suggestion: m.suggestion,
      reason: m.reason,
      category: m.category,
      ruleId: m.ruleId,
      priority: m.priority,
      confidence: m.confidence,
    });
    lastEnd = m.end;
  }
  return chosen;
}
