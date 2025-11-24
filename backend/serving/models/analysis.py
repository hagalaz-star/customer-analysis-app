import pandas as pd
import joblib


class CustomerAnalyzer:
    def __init__(self, model_path: str, scaler_path: str, columns_path: str):

        self.model = joblib.load(model_path)
        self.scaler = joblib.load(scaler_path)
        self.original_columns = joblib.load(columns_path)

        self.cluster_info = {
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

    def predict_new_customer(self, new_data: dict):

        new_df = pd.DataFrame([new_data])
        new_df_processed = pd.get_dummies(new_df, columns=["Subscription Status"])
        new_df_processed = pd.get_dummies(
            new_df_processed, columns=["Frequency of Purchases"]
        )

        for col in self.original_columns:
            if col not in new_df_processed.columns:
                new_df_processed[col] = 0
        # 강제 정렬
        new_df_processed = new_df_processed[self.original_columns]

        new_df_scaled = self.scaler.transform(new_df_processed)
        
        # 학습때 컬럼이름이 붙어있지만 예측할때는 없는 배열로 주기때문에  결과에는 영향없다.
        new_df_scaled = pd.DataFrame(new_df_scaled, columns=self.original_columns)

        predicted_cluster = self.model.predict(new_df_scaled)
        label = int(predicted_cluster[0])
        # 키 값  기본값 설정
        cluster_details = self.cluster_info.get(
            label,
            {
                "name": "분류되지 않음",
                "description": "데이터를 기반으로 한 유형을 특정하기 어렵습니다.",
            },
        )
        return {
            "predicted_cluster": label,
            "cluster_name": cluster_details["name"],
            "cluster_description": cluster_details["description"],
        }
