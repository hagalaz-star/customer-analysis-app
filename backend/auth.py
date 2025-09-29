import os
from jose import jwt, JWTError
from fastapi import FastAPI, Header, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv


load_dotenv()

# FastAPI 자동화 도구
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"


def verify_supabase_token(token: str = Depends(oauth2_scheme)):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT secret key is not configured on the server.",
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except JWTError:
        raise credentials_exception


def optional_verify_supabase_token(authorization: str | None = Header(None)):
    """개발 편의용: 환경변수 DISABLE_AUTH=1 이면 인증을 생략합니다.

    - 로컬 개발/테스트에서 토큰 없이 호출을 허용하기 위해 사용합니다.
    - 운영 배포에서는 해당 환경변수를 설정하지 마세요.
    """
    if os.getenv("DISABLE_AUTH") == "1":
        # 최소한의 페이로드 형태를 반환하여 다운스트림 로직과의 호환 유지
        return {"sub": "dev", "role": "user"}

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not SECRET_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="JWT secret key is not configured on the server.",
        )
    if not authorization or not authorization.startswith("Bearer "):
        raise credentials_exception

    token = authorization.split(" ", 1)[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload

    except JWTError:
        raise credentials_exception
