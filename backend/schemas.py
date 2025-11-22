from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    preferences: Dict[str, Any] = {}

    class Config:
        orm_mode = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Snippet Schemas
class SnippetBase(BaseModel):
    code_content: str
    language: str = "python"

class SnippetCreate(SnippetBase):
    pass

class Snippet(SnippetBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Analysis Schemas
class AnalysisResult(BaseModel):
    id: int
    snippet_id: int
    score: float
    bugs_detected: List[Dict[str, Any]] = []
    refactor_suggestions: List[Dict[str, Any]] = []
    complexity_metrics: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        orm_mode = True
