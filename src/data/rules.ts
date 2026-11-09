import type { Rule } from '../types';

export const rules: Rule[] = [
  // 맞춤법 (철자)
  { id: 'spell-1', pattern: '됬', replacement: '됐', reason: '\'됬\'은 \'됐\'으로 씁니다.', category: '맞춤법', priority: 90 },
  { id: 'spell-2', pattern: '금새', replacement: '금세', reason: '\'금새\'가 아니라 \'금세\'입니다.', category: '맞춤법', priority: 90 },
  { id: 'spell-3', pattern: '몇일', replacement: '며칠', reason: '\'몇일\'이 아니라 \'며칠\'입니다.', category: '맞춤법', priority: 90 },
  { id: 'spell-4', pattern: '할께', replacement: '할게', reason: '\'할께\'가 아니라 \'할게\'입니다.', category: '맞춤법', priority: 90 },
  { id: 'spell-5', pattern: '어의없', replacement: '어이없', reason: '\'어의없다\'가 아니라 \'어이없다\'입니다.', category: '맞춤법', priority: 90 },
  { id: 'spell-6', pattern: '되요', replacement: '돼요', reason: '\'되요\'가 아니라 \'돼요\'입니다.', category: '맞춤법', priority: 80 },

  // 이중 피동
  { id: 'grammar-1', pattern: '되어지', replacement: '되', reason: '이중 피동 \'되어지다\'는 \'되다\'로 씁니다.', category: '문법', priority: 70 },
  { id: 'grammar-2', pattern: '해지', replacement: '해', reason: '불필요한 피동 표현을 피합니다.', category: '문법', priority: 60, confidence: 0.7 },

  // 띄어쓰기: 수/때/뿐/것
  { id: 'space-1', pattern: '([가-힣]+)수(있다|없다|있어|없어|있음|없음|있고|없고)', replacement: '$1 수$2', reason: '보조 용언 \'수 있다/없다\'는 띄어 씁니다.', category: '띄어쓰기', priority: 80 },
  { id: 'space-2', pattern: '([가-힣]+)때([\\s]|$)', replacement: '$1 때$2', reason: '\'~할 때\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-3', pattern: '것같', replacement: '것 같', reason: '\'것 같다\'는 띄어 씁니다.', category: '띄어쓰기', priority: 80 },
  { id: 'space-4', pattern: '인것', replacement: '인 것', reason: '의존명사 \'것\'은 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-5', pattern: '한것', replacement: '한 것', reason: '의존명사 \'것\'은 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-6', pattern: '같은것', replacement: '같은 것', reason: '의존명사 \'것\'은 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-7', pattern: '할때', replacement: '할 때', reason: '\'할 때\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-8', pattern: '볼때', replacement: '볼 때', reason: '\'볼 때\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-9', pattern: '갈때', replacement: '갈 때', reason: '\'갈 때\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-10', pattern: '올때', replacement: '올 때', reason: '\'올 때\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-11', pattern: '할수', replacement: '할 수', reason: '\'할 수\'는 띄어 씁니다.', category: '띄어쓰기', priority: 80 },
  { id: 'space-12', pattern: '할뿐', replacement: '할 뿐', reason: '\'할 뿐\'은 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-13', pattern: '지말', replacement: '지 말', reason: '\'지 말다\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-14', pattern: '안되', replacement: '안 되', reason: '\'안 되다\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-15', pattern: '안돼', replacement: '안 돼', reason: '\'안 돼\'는 띄어 씁니다.', category: '띄어쓰기', priority: 75 },
  { id: 'space-16', pattern: '([가-힣])\\s+(을|를|이|가|은|는|에|에서|와|과|도|로|으로|만|까지|부터|에게|한테|께)(?![가-힣])', replacement: '$1$2', reason: '조사는 앞말에 붙여 씁니다.', category: '띄어쓰기', priority: 70 },
  { id: 'space-17', pattern: '안녕\\s+하세요', replacement: '안녕하세요', reason: '\'안녕하세요\'는 붙여 씁니다.', category: '띄어쓰기', priority: 80 },
  { id: 'space-18', pattern: '([가-힣])(?<!야|여|고|지|서|면|니|라)\\s+(입니다|습니다|합니다)', replacement: '$1$2', reason: '어미는 앞말에 붙여 씁니다.', category: '띄어쓰기', priority: 70 },
  { id: 'space-19', pattern: '([가-힣])(?<!야|여|고|지|서|면|니|라)\\s+(이다)(?![가-힣])', replacement: '$1$2', reason: '서술격 조사 \'이다\'는 앞말에 붙여 씁니다.', category: '띄어쓰기', priority: 70 },
  { id: 'grammar-3', pattern: '할 대', replacement: '할 데', reason: "'할 데'가 맞습니다 (장소/시점).", category: '문법', priority: 65, confidence: 0.75 },
];
