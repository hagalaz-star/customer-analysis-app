import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
import joblib  # 학습된 모델 같은 파이썬 객체를 파일로 저장하고 불러오는 도구

# 만든 이유  시간이 오래걸리는 머신러닝 모델 학습 과정을  미리 한번 만 실행해서 그 결과를 파일로 저장하자
def train_save_model(data_path ="data/shopping_trends.csv", model_path = "model.pkl", scaler_path = "scaler.pkl", columns_path= "columns.pkl"):
    df = pd.read_csv(data_path)

    # 1. 원본 데이터 로드 및 전처리

    df_selected = df[["Age", "Purchase Amount (USD)", "Subscription Status", "Frequency of Purchases"]]
    df_selected = pd.get_dummies(df_selected, columns=["Subscription Status"], drop_first=True)
    df_selected = pd.get_dummies(df_selected, columns=["Frequency of Purchases"])
    df_selected_numeric = df_selected.astype(int)

    original_columns = df_selected_numeric.columns

    joblib.dump(original_columns, columns_path)

    # 2. 데이터 스케일링
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df_selected_numeric)
    df_scaled = pd.DataFrame(df_scaled, columns= df_selected_numeric.columns)

    # 3. k - 평균 모델 학습
    final_k = 7
    model = KMeans(n_clusters= final_k, random_state=0, n_init='auto')
    model.fit(df_scaled)

    # 4. 모델과 스케일러 저장
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)

    print("Model and scaler saved successfully!")

if __name__ =="__main__":
    train_save_model()