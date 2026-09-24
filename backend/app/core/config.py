"""
App ki saari settings yahan hain.
Values .env file se aati hain. .env me na ho to yahan ki default value use hoti hai.
"""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Offline AI Workbench"
    app_env: str = "dev"
    api_prefix: str = "/api"

    # Comma se alag kiye hue URLs
    frontend_origins: str = "http://localhost:5173"

    storage_dir: Path = Path("storage")
    max_upload_mb: int = 200

    # Services
    ollama_url: str = "http://localhost:11434"
    qdrant_url: str = "http://localhost:6333"
    postgres_host: str = "localhost"
    postgres_port: int = 5432

    # Kaunsa model kis kaam ka
    model_fast: str = "qwen3:4b"
    model_reasoning: str = "qwen3:14b"
    model_vision: str = "qwen2.5vl:7b"
    model_embedding: str = "bge-m3"

    # LLM ki context window (tokens). Documents ka text isi me fit hona chahiye.
    llm_num_ctx: int = 8192

    # RAG settings
    rag_chunk_chars: int = 800
    rag_chunk_overlap: int = 150
    rag_top_k: int = 5
    rag_min_score: float = 0.3

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]

    @property
    def uploads_dir(self) -> Path:
        return self.storage_dir / "uploads"

    @property
    def texts_dir(self) -> Path:
        """Documents se nikala hua text (page-wise) yahan save hota hai."""
        return self.storage_dir / "texts"

    @property
    def qdrant_dir(self) -> Path:
        """Qdrant local mode ka data (vectors) yahan save hota hai."""
        return self.storage_dir / "qdrant"

    @property
    def generated_dir(self) -> Path:
        return self.storage_dir / "generated"

    @property
    def model_roles(self) -> dict[str, str]:
        """role -> model name"""
        return {
            "fast": self.model_fast,
            "reasoning": self.model_reasoning,
            "vision": self.model_vision,
            "embedding": self.model_embedding,
        }


@lru_cache
def get_settings() -> Settings:
    return Settings()