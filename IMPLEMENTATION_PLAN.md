# 한국어 작문/문법 교정기 (Korean Writing Corrector) — 구현 계획

## 1. 개요
규칙 기반(정규식·사전·형태소 휴리스틱)으로 한국어 맞춤법·띄어쓰기·문법을
검사하고 수정 제안을 제공하는 웹앱. API 없이 브라우저에서 동작.

## 2. 목표 사용자
- 학생(작문 과제), 교사(첨삭 보조)

## 3. 핵심 기능
- 텍스트 입력 → 오류 하이라이트
- 맞춤법 사전 기반 교정 (자주 틀리는 단어 DB)
- 띄어쓰기 규칙 (조사/어미 결합, 의존명사 등)
- 문법 규칙 (주어-서술어 호응, 시제, 높임)
- 수정 제안 목록 + 원클릭 적용
- 통계: 오류 유형별 빈도
- 학습 모드: 오류 이유 설명 카드

## 4. 화면 구성
- 에디터: 텍스트 입력 + 하이라이트
- 제안 패널: 오류 목록, 수정 버튼
- 통계/학습 탭
- 내보내기 (교정된 텍스트)

## 5. 기술 스택
- React + Vite + TypeScript
- 에디터: contenteditable 또는 textarea + overlay
- 한국어 처리: Hangul.js (자모 분리), 커스텀 사전 JSON
- 저장: localStorage

## 6. 데이터 모델
- Rule { id, pattern, replacement, reason, category }
- Dictionary { wrong, correct, freq }
- AnalysisResult { errors: Error[] }
- Error { start, end, original, suggestion, reason, category }

## 7. 구현 단계
1. 세팅
2. 텍스트 에디터 + 하이라이트 렌더링
3. 맞춤법 사전 & 규칙 엔진
4. 띄어쓰기 규칙
5. 문법 규칙 (호응/시제)
6. 제안 적용 UX
7. 통계/학습 모드
8. 성능 최적화 (Web Worker)

## 8. 비기능 요구사항
- 긴 텍스트 성능 (Worker)
- 오프라인

## 9. 검증
- 단위: 규칙 매칭
- 회귀: 샘플 문장 세트
