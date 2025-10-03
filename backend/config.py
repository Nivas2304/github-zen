from pydantic import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # GitHub OAuth Configuration
    github_client_id: str
    github_client_secret: str
    github_redirect_uri: str = "https://your-vercel-app.vercel.app/auth/callback"  # Update with your Vercel URL
    
    # JWT Configuration
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Database Configuration
    database_url: str = "sqlite:///./github_zen.db"  # Will be overridden by Render's DATABASE_URL
    
    # CORS Configuration
    frontend_url: str = "https://your-vercel-app.vercel.app"  # Update with your Vercel URL
    
    # Environment
    environment: str = "development"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()

