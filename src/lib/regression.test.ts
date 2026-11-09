import { describe, it, expect } from 'vitest';
import { analyzeText } from '../lib/analyze';
import { rules } from '../data/rules';
import { dictionary } from '../data/dictionary';

const samples = [
  { text: '됬어요', expected: '됐' },
  { text: '금새', expected: '금세' },
  { text: '할수 있다', expected: '할 수' },
  { text: '학생 입니다', expected: '학생입니다' },
  { text: '안녕 하세요', expected: '안녕하세요' },
];

describe('regression samples', () => {
  for (const s of samples) {
    it(s.text, () => {
      const res = analyzeText(s.text, rules, dictionary);
      let out = s.text;
      for (const e of [...res].sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.suggestion + out.slice(e.end);
      expect(out).toContain(s.expected);
    });
  }
});
