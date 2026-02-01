import os
from supabase import create_client, Client
from typing import Optional


def get_supabase_client() -> Client:
    """
    Supabase 클라이언트를 생성하고 반환.
    """
    url: Optional[str] = os.getenv("SUPABASE_URL")
    key: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if url is None or key is None:
        raise EnvironmentError(
            "SUPABASE_URL 혹은 SUPABASE_SERVICE_ROLE_KEY 가 설정되어 있지 않습니다."
        )

    return create_client(url, key)
