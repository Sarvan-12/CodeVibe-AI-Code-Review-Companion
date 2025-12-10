"""
Centralized configuration management for CodeVibe backend.
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Database
    database_url: str = "sqlite:///./codevibe.db"
    
    # Security
    secret_key: str = "your_secret_key_here_change_in_production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Application
    app_name: str = "CodeVibe API"
    app_version: str = "0.1.0"
    debug: bool = True
    
    # Analysis
    max_code_length: int = 100000  # Maximum code length in characters
    analysis_timeout: int = 30  # Timeout for analysis in seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()


def get_settings() -> Settings:
    """Get application settings"""
    return settings
