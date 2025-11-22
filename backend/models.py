from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    preferences = Column(JSON, default={}) # Store coding style preferences

    snippets = relationship("Snippet", back_populates="owner")

class Snippet(Base):
    __tablename__ = "snippets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    code_content = Column(Text, nullable=False)
    language = Column(String, default="python")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="snippets")
    analysis_result = relationship("AnalysisResult", back_populates="snippet", uselist=False)

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    snippet_id = Column(Integer, ForeignKey("snippets.id"))
    score = Column(Float)
    bugs_detected = Column(JSON, default=[])
    refactor_suggestions = Column(JSON, default=[])
    complexity_metrics = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    snippet = relationship("Snippet", back_populates="analysis_result")
