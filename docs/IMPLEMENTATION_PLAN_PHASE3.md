# 구현 계획 3단계 (1~5)

## 범위
6(운영/배포 모니터링) 제외. 1~5 구현.

## 1. 규칙 정확도
- 문맥 기반 규칙 추가 (호응/시제/높임)
- Rule에 contextInclude/contextExclude, confidence, priority 적용
- 회귀 샘플 테스트 세트 확장

## 2. 테스트/품질
- analyze 적용/undo/설정/Worker 경로 테스트
- 커버리지 설정 및 CI 게이트

## 3. 성능
- 분석 디바운스/캐시
- 대용량 문서 벤치마크 스크립트
- PWA 오프라인 캐시

## 4. UX
- 오류 수락/거절, diff 하이라이트
- 키보드 단축키, 접근성 개선

## 5. 데이터
- 사용자 사전/예외 import/export
- 규칙 버전 표시 및 업데이트 내역 자동 로드

## 검증
- npm run lint, npm test, npm run build
- GitHub Pages 배포 URL 확인
