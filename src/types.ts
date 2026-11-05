export type Category = '맞춤법' | '띄어쓰기' | '문법' | '표현';

export interface Rule {
  id: string;
  pattern: string; // regex source
  flags?: string;
  replacement: string; // may use $1 etc
  reason: string;
  category: Category;
  priority?: number; // higher first
  confidence?: number; // 0..1
  contextInclude?: string; // regex that must match in surrounding text
  contextExclude?: string; // regex that vetoes match
  enabled?: boolean;
}

export interface DictionaryEntry {
  wrong: string;
  correct: string;
  reason?: string;
  category?: Category;
  priority?: number;
  confidence?: number;
  contextInclude?: string;
  contextExclude?: string;
}

export interface ErrorItem {
  id: string;
  start: number;
  end: number;
  original: string;
  suggestion: string;
  reason: string;
  category: Category;
  ruleId?: string;
  priority?: number;
  confidence?: number;
}

export interface AnalysisResult {
  errors: ErrorItem[];
}
