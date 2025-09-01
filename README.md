# 🛍️ AI 기반 고객 쇼핑 트렌드 분석 플랫폼

고객 쇼핑 데이터를 K-평균 클러스터링으로 분석하여 유형별로 그룹화하고, Google Gemini AI를 통해 각 그룹을 대표하는 가상 페르소나를 생성하여 데이터 기반의 맞춤형 마케팅 전략 수립을 돕는 풀스택(Full-stack) 웹 애플리케이션입니다.

✨ **Live Demo**: [https://shoppingtrendai.netlify.app/](https://shoppingtrendai.netlify.app/)

---

## 📁 프로젝트 구조

이 프로젝트는 다음과 같이 두 개의 독립적인 애플리케이션으로 구성된 모노레포(Monorepo) 형식입니다.

- **`/frontend`**: 사용자가 직접 상호작용하는 웹 대시보드입니다. (Next.js)
- **`/backend`**: 실시간 고객 유형 분석 API를 제공하는 서버입니다. (FastAPI)

각 애플리케이션의 상세한 설명과 로컬 환경에서의 실행 방법은 해당 폴더의 `README.md` 파일을 참고해주세요.

➡️ **[프론트엔드 상세 설명 보기](./frontend/README.md)**

➡️ **[백엔드 상세 설명 보기](./backend/README.md)**

---

## 🛠️ 핵심 기술 스택

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Python, FastAPI, Scikit-learn, Pandas
- **Database & Auth**: Supabase
- **AI**: Google Gemini API
