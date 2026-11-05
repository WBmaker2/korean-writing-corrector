# 구현 계획 (2단계)

## 목표
1단계 MVP 이후 정확도, 테스트, 성능, UX, 배포를 보강한다.

## 단계
1. 규칙/사전 확장 + 회귀 샘플
2. 단위 테스트(Vitest)
3. 오탐 감소(문맥 필터, 우선순위, 사용자 예외/사전)
4. 성능 최적화(Web Worker, 디바운스, 벤치마크)
5. UX 고도화(undo/redo, diff, 내보내기 형식, 모바일)
6. 배포(GitHub Pages/Vercel) + 업데이트 내역 연동

## 데이터 모델 변경
- Rule: priority, confidence, contextInclude?, contextExclude?, enabled?
- ErrorItem: confidence, priority
- UserSettings: ignoredRuleIds, userDictionary, debounceMs

## 검증
- `npm test`, `npm run lint`, `npm run build`
- 샘플 문장 회귀 세트 통과
