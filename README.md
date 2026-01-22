# 고객 쇼핑 트렌드 분석 플랫폼

이 저장소는 고객 쇼핑 데이터를 실시간으로 분류하고, 각 군집에 대한 페르소나 요약을 제공하는 풀스택 애플리케이션입니다. FastAPI 기반의 API 서버가 예측 결과를 제공하고, Next.js 대시보드가 시각화와 인사이트 탐색을 담당합니다.

## 라이브 데모
- [customer-analysis-app.vercel.app](https://customer-analysis-app.vercel.app)

## 저장소 구조
- `frontend` – 고객 유형과 페르소나를 탐색할 수 있는 Next.js 대시보드
- `backend` – 단일/배치 고객 프로필을 평가하는 FastAPI 서비스

## 주요 기능
- `backend/pipelines/artifacts/model`에 저장된 K-Means 모델과 StandardScaler를 이용한 실시간 분류
- Google Gemini를 활용해 생성한 페르소나 설명으로 마케팅/기획 팀의 이해를 지원
- 구조적 로깅, CORS, 준비성/상태 점검, Supabase JWT 검증(로컬에서는 비활성화 가능)으로 운영 안정성 확보

## 기술 스택
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Chart.js
- Backend: Python, FastAPI, Pydantic, Uvicorn
- Data & ML: pandas, scikit-learn, joblib
- Infrastructure & Tooling: Docker, Supabase, Make, Pytest

## 백엔드 빠르게 실행하기
1. `cp backend/.env.example backend/.env`
2. `make up`
3. `curl -s http://localhost:8000/readyz | jq .`
4. 완료 후 `make down`

세부 설정과 개발 흐름은 각 애플리케이션의 README를 참고

## 추가 문서
- [프론트엔드 README](./frontend/README.md)
- [백엔드 README](./backend/README.md)

