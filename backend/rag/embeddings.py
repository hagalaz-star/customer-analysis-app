from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document


json_data = {
    0: {
        "name": "알뜰 실속형 쇼핑객",
        "description": "비교적 적은 금액을 사용하지만, 꾸준히 방문하여 필요한 것을 구매하는 실속파입니다.",
    },
    1: {
        "name": "충성도 높은 VIP 고객",
        "description": "높은 구매액과 정기 구독을 바탕으로 저희 서비스를 가장 활발하게 이용하는 VIP 고객입니다.",
    },
    2: {
        "name": "유행에 민감한 잠재 고객",
        "description": "젊은 연령층으로, 높은 구매액을 기록하는 트렌드에 민감한 고객입니다. 정기 구독 시 VIP가 될 확률이 높습니다.",
    },
    3: {
        "name": "안정적인 구독자",
        "description": "정기 구독 서비스를 꾸준히 이용하며 안정적인 소비 패턴을 보이는 신뢰도 높은 고객입니다.",
    },
    4: {
        "name": "평균적인 일반 고객",
        "description": "가장 일반적인 소비 패턴을 보이는 고객으로, 다양한 상품에 관심을 보일 가능성이 있습니다.",
    },
    5: {
        "name": "시즌별 큰 손",
        "description": "자주 방문하지는 않지만, 한 번 구매할 때 큰 금액을 사용하는 경향이 있는 중요한 고객입니다.",
    },
    6: {
        "name": "자주 방문하는 단골손님",
        "description": "구매 금액은 크지 않지만, 매우 자주 방문하여 서비스에 대한 높은 충성도를 보여주는 소중한 고객입니다.",
    },
}


# docs : 페르소나 하나하나를 담은 Document  객체 리스트
def run_embedding_task():
    docs = []

    for key, profile in json_data.items():

        content = (
            f"유형: {profile['name']}\n"
            f"설명: {profile['description']}\n"
            "용도: 고객 페르소나 요약"
        )
        docs.append(
            Document(page_content=content, metadata={"segment_id": key, **profile})
        )

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectors = embeddings.embed_documents([doc.page_content for doc in docs])

    return docs, vectors


if __name__ == "__main__":
    run_embedding_task()
