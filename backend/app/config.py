from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Rural Healthcare Triage Assistant"
    app_env: str = "development"
    debug: bool = True

    groq_api_key: str = ""

    # Change this if you want another model available
    # in your Groq account.
    llm_model: str = "openai/gpt-oss-120b"

    database_url: str = "sqlite+aiosqlite:///./rural_healthcare.db"

    allowed_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()