# 고객 분석 API (FastAPI)

이 백엔드는 쇼핑 트렌드 대시보드를 위해 고객 프로필을 분류하고, 이해하기 쉬운 군집 정보를 반환합니다. 사전에 학습된 K-Means 모델을 로드해 FastAPI 엔드포인트를 통해 실시간 분석을 제공합니다.

## 제공 기능
- `POST /api/analysis` 하나의 고객 프로필을 즉시 평가
- `POST /api/analysis/batch` 여러 프로필을 한 번에 분석
- 각 군집에 이름과 설명을 포함해 결과를 반환하여 비개발자도 해석 가능
- 운영 환경에서는 Supabase JWT 검증을 강제하고, 로컬 개발 시에는 토글로 비활성화
- `healthz`, `readyz` 엔드포인트와 구조적 로깅으로 배포/모니터링 편의성 확보

## 아키텍처 개요
1. **오프라인 학습** (`pipelines/train/train.py`): 데이터 전처리 후 StandardScaler와 K-Means를 학습하고, 결과물을 `pipelines/artifacts/model` 아래에 저장
2. **실시간 서빙** (`serving/api/main.py`): CustomerAnalyzer가 모델·스케일러·컬럼 정보를 로드하고, Pydantic 검증을 거쳐 예측 결과와 페르소나 메타데이터를 반환.

학습과 서빙을 분리해 API는 가볍게 유지하면서도, 새 모델을 쉽게 학습·배포.

## 시작하기

### 로컬 Python 환경
1. `python -m venv venv`
2. 가상환경 활성화
3. `pip install -r requirements.txt`
4. `cp .env.example .env` 후 필요한 값을 수정
5. (선택) 데이터셋을 갱신하거나 재학습하려면 `python pipelines/train/train.py`
6. `uvicorn serving.api.main:app --reload`

Swagger UI는 `http://localhost:8000/docs`에서 확인.

### Docker / Docker Compose
1. `cp .env.example .env`
2. `make up` 혹은 `docker compose up -d --build`
3. `curl -s http://localhost:8000/readyz | jq .`
4. 로그 확인은 `make logs`, 종료는 `make down`

## 환경 변수
| 변수 | 기본값 | 설명 |
| --- | --- | --- |
| `DISABLE_AUTH` | `1` | 1이면 Supabase JWT 검증을 생략합니다. 운영에서는 설정하지 마세요. |
| `SUPABASE_JWT_SECRET` | `changeme` | JWT 검증에 사용하는 HMAC 시크릿 값입니다. |
| `APP_ENV` | `local` | 로그/모니터링에서 사용할 수 있는 환경 식별자. |

## API 요약

### `POST /api/analysis`
단일 고객 정보를 분석합니다. 요청 본문은 학습 시 사용한 스키마와 동일해야 합니다.

```json
{
  "Age": 35,
  "Purchase Amount (USD)": 50,
  "Subscription Status": "Yes",
  "Frequency of Purchases": "Monthly"
}
```

응답 예시:

```json
{
  "predicted_cluster": 1,
  "cluster_name": "충성도 높은 VIP 고객",
  "cluster_description": "높은 구매액과 정기 구독을 바탕으로 저희 서비스를 가장 활발하게 이용하는 VIP 고객입니다."
}
```

### `POST /api/analysis/batch`
`{ "profiles": [...] }` 형태로 여러 프로필을 보내면, 단일 분석과 동일한 구조의 결과 배열을 반환한다.

### `GET /readyz`
모델, 스케일러, 컬럼 정보가 메모리에 정상 로드되었는지 확인합니다. 누락 시 503을 반환한다.

### `GET /healthz`
`readyz` 결과에 더해 `SUPABASE_JWT_SECRET` 설정 여부를 점검해 잘못된 배포를 조기에 감지한다.

## 테스트
- `make test` : 컨테이너 환경에서 Pytest 실행
- `make test-local` : 로컬에서 `backend` 디렉터리 기준 Pytest 실행

## 프로젝트 구조
```
backend/
├── serving/
│   ├── api/          # FastAPI 진입점과 인증 헬퍼
│   └── models/       # CustomerAnalyzer 및 ML 자산 래퍼
├── pipelines/
│   ├── data/         # 원본 데이터셋
│   ├── train/        # 오프라인 학습 스크립트
│   └── artifacts/    # 스케일러·모델·컬럼 직렬화 파일
├── operation/        # 로깅, 미들웨어, 에러 처리 모듈
├── tests/            # Pytest 스모크/계약 테스트
├── Dockerfile
└── requirements.txt
```

전체 시스템 구성과 프론트엔드 연동은 루트 README에서 확인할 수 있다.
