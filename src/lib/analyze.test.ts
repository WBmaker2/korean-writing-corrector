import { describe, it, expect } from 'vitest';
import { analyzeText } from '../lib/analyze';
import { rules } from '../data/rules';
import { dictionary } from '../data/dictionary';

describe('analyzeText', () => {
  it('detects spelling errors', () => {
    const res = analyzeText('됬어요', rules, dictionary);
    expect(res.some((e) => e.original === '됬')).toBe(true);
  });
  it('detects spacing errors', () => {
    const res = analyzeText('할수 있다', rules, dictionary);
    expect(res.some((e) => e.suggestion === '할 수')).toBe(true);
  });
  it('does not overlap', () => {
    const res = analyzeText('안녕 하세요', rules, dictionary);
    expect(res.length).toBe(1);
  });
  it('respects ignored rules', () => {
    const res = analyzeText('됬어요', rules, dictionary, { ignoredRuleIds: new Set(['spell-1', 'dict:됬']) });
    expect(res.some((e) => e.original === '됬')).toBe(false);
  });
});
