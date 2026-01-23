from services.supabase_client import get_supabase_client
from rag.embeddings import run_embedding_task

TABLE_NAME = "personas"
EMBEDDING_COLUMN = "embedding"

docs, vectors = run_embedding_task()


def map_doc_to_persona_row(doc):
    return {
        "title": doc.metadata["name"],
        "description": doc.metadata["description"],
        "cluster_name": f"segment_{doc.metadata['segment_id']}",
    }


# expected_dim = 모델이 내야 하는 벡터 길이(차원) 값
def check_vector_dim(vectors, expected_dim):
    if not vectors:
        raise ValueError("No vectors available to validate dimension.")
    actual_dim = len(vectors[0])
    if actual_dim != expected_dim:
        raise ValueError(
            f"Vector dimension mismatch: expected {expected_dim}, got {actual_dim}."
        )


# 임베딩 벡터를 컬럼에 포함해 DB에 저장할수있는 row(payload)를 만들기 위해 작성했다.
def build_persona_payloads(docs, vectors):
    if len(docs) != len(vectors):
        raise ValueError("Docs and vectors length mismatch.")
    payloads = []
    for doc, vector in zip(docs, vectors):
        row = map_doc_to_persona_row(doc)
        row[EMBEDDING_COLUMN] = vector
        payloads.append(row)
    return payloads


# payloads를 Supabase에 upsert(있으면 업데이트, 없으면 삽입)하기 위한 함수
def upsert_personas(payloads, on_conflict="cluster_name"):
    supabase = get_supabase_client()
    return (
        supabase.table(TABLE_NAME).upsert(payloads, on_conflict=on_conflict).execute()
    )


# 임베딩 차원을 검증한뒤 페르소나 payloads를 만들어 supabase에 upsert 하는 실행함수
def store_personas(expected_dim, on_conflict="cluster_name"):
    check_vector_dim(vectors, expected_dim)
    payloads = build_persona_payloads(docs, vectors)
    upsert_personas(payloads, on_conflict=on_conflict)
