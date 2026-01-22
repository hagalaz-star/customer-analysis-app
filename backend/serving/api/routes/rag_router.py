from fastapi import APIRouter, Depends

from operation.core.errors import CustomException
from ..auth import optional_verify_supabase_token
from ..schemas.rag_schema import RagMatch, RagQuery, RagResponse
from backend.rag.retriever import retrieve_personas


router = APIRouter()


@router.post("/query", response_model=RagResponse, tags=["rag"])
def query_rag(
    request: RagQuery, _payload: dict = Depends(optional_verify_supabase_token)
):
    try:
        profile = request.profile.model_dump(by_alias=True) if request.profile else None
        matches = retrieve_personas(
            profile=profile,
            persona_name=request.persona_name,
            persona_description=request.persona_description,
            query_text=request.query_text,
            top_k=request.top_k,
        )
        return RagResponse(matches=[RagMatch(**match) for match in matches])
    except Exception as exc:
        raise CustomException(
            status_code=500,
            error_code="RAG_QUERY_FAILED",
            message=f"RAG 조회 중 오류가 발생했습니다: {str(exc)}",
        )
