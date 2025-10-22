from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    base_dir: Path = (
        Path(__file__).resolve().parent.parent / "pipelines" / "artifacts" / "model"
    )
    model_path: Path = base_dir / "model.pkl"
    scaler_path: Path = base_dir / "scaler.pkl"
    columns_path: Path = base_dir / "columns.pkl"


setting = Settings()
