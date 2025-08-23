import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

class CustomerAnalyzer:
    def __init__(self, data_path: str):
        # 1. 원본 데이터 로드 및 전처리
        df = pd.read_csv(data_path)
        df_selected = df[["Age","Purchase Amount (USD)", "Subscription Status", "Frequency of Purchases"]]
        df_selected = pd.get_dummies(df_selected, columns=["Subscription Status"] , drop_first=True)
        df_selected = pd.get_dummies(df_selected, columns=["Frequency of Purchases"])
        df_selected_numeric = df_selected.astype(int)
        
        self.original_columns = df_selected_numeric.columns


        # 2. 데이터 스케일링
        self.scaler = StandardScaler()
        df_scaled = self.scaler.fit_transform(df_selected_numeric)
        df_scaled = pd.DataFrame(df_scaled, columns=df_selected_numeric.columns)

        # 3. K-평균 모델 학습
        final_k = 7
        self.model = KMeans(n_clusters=final_k, random_state=0, n_init='auto')
        self.model.fit(df_scaled) # 또는 .fit(df_scaled) 후 .labels_

        # 4. 각 클러스터의 평균 특성값 저장
        final_labels =  self.model.labels_
        df_selected_numeric['cluster_label'] = final_labels
        self.cluster_summary = df_selected_numeric.groupby('cluster_label').mean()



    
    def predict_new_customer(self, new_data: dict):

        new_df = pd.DataFrame([new_data])

        new_df_processed = pd.get_dummies(new_df, columns=["Subscription Status"], drop_first=True)
        new_df_processed = pd.get_dummies(new_df_processed, columns=["Frequency of Purchases"])

        for col in self.original_columns:
            if col not in new_df_processed.columns:
                new_df_processed[col] = 0
        
        new_df_processed = new_df_processed[self.original_columns]

        new_df_scaled = self.scaler.transform(new_df_processed)
        predict_cluster = self.model.predict(new_df_scaled)

        return int(predict_cluster[0])



