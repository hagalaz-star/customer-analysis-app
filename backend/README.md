# 🤖 AI 고객 분석 API 서버 (FastAPI)

이 프로젝트는 AI 기반 고객 쇼핑 트렌드 대시보드의 백엔드 서버입니다. FastAPI를 기반으로 구축되었으며, Scikit-learn으로 학습된 K-평균 클러스터링 머신러닝 모델을 통해 실시간으로 고객 유형을 분석하는 API를 제공합니다.

프론트엔드 애플리케이션으로부터 고객 데이터를 받아, 해당 고객이 어떤 쇼핑 유형에 속하는지 예측하고 그 결과를 반환하는 핵심적인 역할을 수행합니다.

## 🚀 주요 기능

**실시간 고객 유형 분석 API**: 사용자가 프론트엔드에서 입력한 고객 프로필(나이, 구매액, 구독 상태 등)을 받아, 입력 검증 후 학습된 모델을 통해 즉시 해당 고객의 유형을 예측합니다.

**머신러닝 모델 서빙**: train.py를 통해 오프라인에서 학습된 K-평균 클러스터링 모델(model.pkl), 데이터 스케일러(scaler.pkl), 그리고 컬럼 정보(columns.pkl)를 joblib을 이용해 로드하여 예측에 사용합니다.

**안전한 API 설계**: Pydantic을 통한 입력 데이터 검증, 적절한 에러 처리, 그리고 CORS 보안 설정을 통해 안정적인 서비스를 제공합니다.

의미 있는 결과 반환: 단순한 클러스터 번호(예: 0, 1)뿐만 아니라, 해당 유형의 **이름("VIP 고객")**과 상세 설명을 함께 JSON 형식으로 반환하여 프론트엔드에서 풍부한 정보를 표시할 수 있도록 합니다.

**분리된 모델 학습 로직**: train.py 스크립트를 통해 모델 학습 과정을 API 서버 실행 로직과 완전히 분리하여, 서버가 빠르고 가볍게 시작될 수 있도록 설계되었습니다.

## 🛠️ 기술 스택

구분 기술
Framework FastAPI
Data Handling Pydantic
ML/Data Analysis Scikit-learn, Pandas
ML Model Ops Joblib
Server Uvicorn
Dependency Python 3.x

## ⚙️ 시작하기

프로젝트의 backend 폴더로 이동합니다.

1. **가상환경 생성 및 활성화**
   Python 가상환경을 생성하고 활성화합니다.

```bash

# 가상환경 생성 (최초 1회)
python -m venv venv

# 가상환경 활성화 (Windows)
.\venv\Scripts\activate

# 가상환경 활성화 (macOS/Linux)
source venv/bin/activate

```

2.**의존성 설치 (Install Dependencies)**

```bash
   pip install -r requirements.txt


```

3.  **머신러닝 모델 학습 (최초 1회)**

```bash
python train.py

```

4. **개발서버 진행**

```bash
uvicorn main:app --reload
```

이제 브라우저에서 http://localhost:8000/docs 로 접속하여 API 문서를 확인하거나, 프론트엔드(http://localhost:3000)와 연동하여 기능을 테스트할 수 있습니다.

📁 프로젝트 구조 및 API
main.py: FastAPI 애플리케이션의 메인 파일입니다. API 엔드포인트를 정의하고 CORS 설정을 관리합니다.

analysis.py: CustomerAnalyzer 클래스가 정의된 파일입니다. 저장된 모델과 스케일러를 로드하고, 새로운 고객 데이터에 대한 예측을 수행하는 핵심 로직이 담겨있습니다.

train.py: shopping_trends.csv 데이터를 읽어 K-평균 클러스터링 모델을 학습시키고, 결과를 파일(model.pkl, scaler.pkl 등)로 저장하는 스크립트입니다.

data/: 원본 데이터 파일(shopping_trends.csv)이 위치한 디렉토리입니다.

API Endpoint: POST /api/analysis
설명: 고객 프로필 데이터를 받아 AI 모델을 통해 고객 유형을 분석합니다.

Request Body:

```JSON
{
  "Age": 35,
  "Purchase Amount (USD)": 50,
  "Subscription Status": true,
  "Frequency of Purchases": "Weekly"
}
```

```JSON

{
  "predicted_cluster": 1,
  "cluster_name": "충성도 높은 VIP 고객",
  "cluster_description": "높은 구매액과 정기 구독을 바탕으로..."
}
```
