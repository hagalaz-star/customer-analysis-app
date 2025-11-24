from typing import List
from ..schemas.customer_schema import CustomerProfile
from fastapi import APIRouter, HTTPException, status, Depends
from services.supabase_client import get_supabase_client
from supabase import Client


router = APIRouter()


def get_supabase() -> Client:
    try:
        return get_supabase_client()

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)
        )


@router.get("/", response_model=List[CustomerProfile], tags=["items"])
async def read_items(supabase: Client = Depends(get_supabase)):
    try:
        result = supabase.table("personas").select("*").execute()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase query failed: {e}",
        )
    # 컬렉션 조회는 데이터가 없어도 정상 => 빈 리스트를 올려 200 ok 응답 유지
    if not result.data:
        return []

    return result.data


@router.post("/", response_model=CustomerProfile, tags=["items"])
async def create_items(item: CustomerProfile, supabase: Client = Depends(get_supabase)):
    try:
        payload = item.model_dump(by_alias=True)
        result = supabase.table("personas").insert(payload).execute()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase query failed: {e}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to create customer record.",
        )
    else:
        return result.data[0]


@router.put("/{item_id}", response_model=List[CustomerProfile], tags=["items"])
async def update_items(
    item_id: int, item: CustomerProfile, supabase: Client = Depends(get_supabase)
):
    try:
        payload = item.model_dump(by_alias=True)
        result = supabase.table("personas").update(payload).eq("id", item_id).execute()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase query failed: {e}",
        )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No customer data found.",
        )
    else:
        return result.data


@router.delete("/{item_id}", response_model=List[CustomerProfile], tags=["items"])
async def delete_items(item_id: int, supabase: Client = Depends(get_supabase)):
    try:

        result = supabase.table("personas").delete().eq("id", item_id).execute()

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Supabase query failed: {e}",
        )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No customer data found.",
        )
    else:
        return result.data
