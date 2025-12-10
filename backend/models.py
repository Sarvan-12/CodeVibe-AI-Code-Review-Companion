from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

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


class StylePattern(Base):
    """Store learned coding style patterns for each user"""
    __tablename__ = "style_patterns"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pattern_type = Column(String)  # 'naming', 'indentation', 'comments', 'imports'
    pattern_value = Column(JSON)  # Actual pattern data
    frequency = Column(Integer, default=1)  # How often this pattern appears
    confidence = Column(Float, default=0.5)  # Confidence in this pattern
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AutoFix(Base):
    """Store auto-fix suggestions for code snippets"""
    __tablename__ = "auto_fixes"
    
    id = Column(Integer, primary_key=True, index=True)
    snippet_id = Column(Integer, ForeignKey("snippets.id"))
    fix_id = Column(String, unique=True, index=True)  # Unique identifier for the fix
    fix_type = Column(String)  # 'simple', 'refactor', 'performance', 'security', 'style'
    title = Column(String)
    description = Column(Text)
    line_start = Column(Integer)
    line_end = Column(Integer)
    before_code = Column(Text)
    after_code = Column(Text)
    diff = Column(Text)
    confidence = Column(Float)  # 0.0 to 1.0
    auto_applicable = Column(Integer, default=0)  # Boolean: can be applied automatically
    applied = Column(Integer, default=0)  # Boolean: has been applied
    created_at = Column(DateTime, default=datetime.utcnow)


class MLPrediction(Base):
    """Store ML-based predictions for code analysis"""
    __tablename__ = "ml_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    snippet_id = Column(Integer, ForeignKey("snippets.id"))
    prediction_type = Column(String)  # 'bug', 'smell', 'security'
    severity = Column(String)  # 'critical', 'high', 'medium', 'low'
    line_number = Column(Integer)
    description = Column(Text)
    confidence = Column(Float)  # 0.0 to 1.0
    details = Column(JSON, default={})  # Additional metadata
    created_at = Column(DateTime, default=datetime.utcnow)
