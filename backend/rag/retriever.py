from __future__ import annotations

from typing import Any, Iterable, Sequence, cast

import numpy as np
from langchain_openai import OpenAIEmbeddings

from services.supabase_client import get_supabase_client

TABLE_NAME = "personas"
EMBEDDING_COLUMN = "embedding"
EMBEDDING_MODEL = "text-embedding-3-small"
DEFAULT_MATCH_COUNT = 1
DEFAULT_SELECT_COLUMNS = ("title", "description", "cluster_name", EMBEDDING_COLUMN)
ORDERED_PROFILE_KEYS = (
    "Age",
    "Purchase Amount (USD)",
    "Subscription Status",
    "Frequency of Purchases",
)


def build_query_text(
    profile: dict[str, Any] | None = None,
    persona_name: str | None = None,
    persona_description: str | None = None,
) -> str:
    lines: list[str] = []

    if persona_name:
        lines.append(f"persona: {persona_name}")
    if persona_description:
        lines.append(f"description: {persona_description}")

    # 핵심 키는 고정 순서, 나머지는 유연하게 추가
    if profile:
        lines.append("profile:")
        for key in ORDERED_PROFILE_KEYS:
            if key in profile:
                lines.append(f"- {key}: {profile[key]}")
        for key, value in profile.items():
            if key not in ORDERED_PROFILE_KEYS:
                lines.append(f"- {key}: {value}")

    query_text = "\n".join(lines).strip()
    if not query_text:
        raise ValueError("Query text is empty.")
    return query_text


def embed_query(text: str) -> list[float]:
    if not text:
        raise ValueError("Query text is empty.")
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    return embeddings.embed_query(text)


# supabase select 결과를 dict 리스트로 가정하기 (타입체커용)
# supabase 에서 페르소나 데이터를 지정한 컬럼으로 조회해 리스트로 반환
def fetch_personas(
    select_columns: Sequence[str] = DEFAULT_SELECT_COLUMNS,
) -> list[dict[str, Any]]:
    supabase = get_supabase_client()
    columns = ",".join(select_columns)
    result = supabase.table(TABLE_NAME).select(columns).execute()
    data = result.data or []
    return cast(list[dict[str, Any]], data)


def _to_vector(values: Iterable[float]) -> np.ndarray:
    return np.asarray(list(values), dtype=float)


#   코사인 유사도 = 두 벡터의 “각도”가 얼마나 비슷한지
#   공식:

#   cos_sim(a, b) = (a · b) / (||a|| * ||b||)

#   - a · b: 내적(같은 방향이면 커짐)
#   - ||a||: 벡터 길이(크기)
#   - 결과는 -1 ~ 1
#       - 1: 완전히 같은 방향
#       - 0: 직교(관련 없음)
#       - -1: 반대 방향


#   직관: “크기(스케일)보다 방향이 비슷한지”를 보는 지표.
def cosine_similarity(
    query_vector: Iterable[float], candidate_vector: Iterable[float]
) -> float:
    query = _to_vector(query_vector)
    candidate = _to_vector(candidate_vector)
    denom = np.linalg.norm(query) * np.linalg.norm(candidate)
    if denom == 0:
        return -1.0
    return float(np.dot(query, candidate) / denom)


# 쿼리 임베딩과 페르소나 리스트를 코사인 유사도로 점수를 내서  top_k를 반환한다.
def rank_personas(
    query_embedding: Iterable[float],
    personas: Iterable[dict[str, Any]],
    top_k: int = DEFAULT_MATCH_COUNT,
) -> list[dict[str, Any]]:
    scored: list[dict[str, Any]] = []
    for persona in personas:
        embedding = persona.get(EMBEDDING_COLUMN)
        if not embedding:
            continue
        score = cosine_similarity(query_embedding, embedding)
        payload = {
            key: value for key, value in persona.items() if key != EMBEDDING_COLUMN
        }
        payload["score"] = score
        scored.append(payload)

    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:top_k]


# 사용자 입력을 검색용 텍스트로 구성해 임베딩한 뒤,  supabase의 페르소나 임베딩과 유사도 비교해 가장높은  top_k를 반환한다.
def retrieve_personas(
    profile: dict[str, Any] | None = None,
    persona_name: str | None = None,
    persona_description: str | None = None,
    query_text: str | None = None,
    top_k: int = DEFAULT_MATCH_COUNT,
) -> list[dict[str, Any]]:
    if query_text is None:
        query_text = build_query_text(
            profile=profile,
            persona_name=persona_name,
            persona_description=persona_description,
        )

    query_embedding = embed_query(query_text)
    personas = fetch_personas()
    if not personas:
        return []
    return rank_personas(query_embedding, personas, top_k=top_k)


# 위의 함수 결과 (리스트)를 간단하게 top 1로 요약해주는 편의함수
def retrieve_best_persona(
    profile: dict[str, Any] | None = None,
    persona_name: str | None = None,
    persona_description: str | None = None,
    query_text: str | None = None,
) -> dict[str, Any] | None:
    matches = retrieve_personas(
        profile=profile,
        persona_name=persona_name,
        persona_description=persona_description,
        query_text=query_text,
        top_k=1,
    )
    return matches[0] if matches else None
