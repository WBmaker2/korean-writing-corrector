import type { DictionaryEntry } from '../types';

export const dictionary: DictionaryEntry[] = [
  { wrong: '됬', correct: '됐', reason: '\'됬\'은 \'됐\'으로 씁니다.', category: '맞춤법', priority: 90 },
  { wrong: '금새', correct: '금세', reason: '\'금새\'가 아니라 \'금세\'입니다.', category: '맞춤법', priority: 90 },
  { wrong: '몇일', correct: '며칠', reason: '\'몇일\'이 아니라 \'며칠\'입니다.', category: '맞춤법', priority: 90 },
  { wrong: '할께', correct: '할게', reason: '\'할께\'가 아니라 \'할게\'입니다.', category: '맞춤법', priority: 90 },
  { wrong: '어의없', correct: '어이없', reason: '\'어의없다\'가 아니라 \'어이없다\'입니다.', category: '맞춤법', priority: 90 },
  { wrong: '되요', correct: '돼요', reason: '\'되요\'가 아니라 \'돼요\'입니다.', category: '맞춤법', priority: 80 },
  { wrong: ' springfox', correct: ' springfox', reason: '오타입니다.', category: '맞춤법', priority: 90 },
];
