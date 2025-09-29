FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies first (better layer caching)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source (including model/scaler/columns files)
COPY . /app/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# “백엔드는 Docker로 컨테이너화했습니다. Python 3.11-slim 이미지를 기반으로 requirements.txt를 먼
# 저 설치해 빌드 캐시를 최적화했고, uvicorn으로 FastAPI 앱을 8000 포트에서 구동합니다. Compose는
# api 서비스를 빌드·실행하고 호스트 8000 포트로 노출하며 .env 환경변수를 주입합니다.”
