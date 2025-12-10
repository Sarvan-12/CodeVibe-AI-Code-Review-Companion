"""
Enhanced schemas for Phase 2 ML features
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


# Existing schemas (keep these)
class SnippetCreate(BaseModel):
    code_content: str
    language: Optional[str] = "python"


class AnalysisResult(BaseModel):
    id: int
    snippet_id: int
    score: float
    bugs_detected: List[Dict[str, Any]]
    refactor_suggestions: List[Dict[str, Any]]
    complexity_metrics: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True


# Phase 2: New schemas for ML features

class BugPrediction(BaseModel):
    """ML-based bug prediction"""
    line_number: int
    severity: str
    bug_type: str
    description: str
    confidence: float
    suggestion: Optional[str] = None


class CodeSmell(BaseModel):
    """Code smell detection"""
    line_number: int
    smell_type: str
    description: str
    severity: str
    refactoring_suggestion: Optional[str] = None


class SecurityIssue(BaseModel):
    """Security vulnerability"""
    line_number: int
    vulnerability_type: str
    description: str
    severity: str
    cwe_id: Optional[str] = None
    fix_suggestion: Optional[str] = None


class FixSuggestion(BaseModel):
    """Auto-fix suggestion"""
    fix_id: str
    fix_type: str
    title: str
    description: str
    line_start: int
    line_end: int
    before_code: str
    after_code: str
    diff: str
    confidence: float
    auto_applicable: bool


class AdvancedAnalysisResult(BaseModel):
    """Enhanced analysis result with ML predictions and auto-fixes"""
    # Basic analysis
    snippet_id: int
    score: float
    language: str
    
    # Static analysis
    static_issues: List[Dict[str, Any]]
    complexity_metrics: Dict[str, Any]
    
    # ML predictions
    ml_bugs: List[BugPrediction]
    code_smells: List[CodeSmell]
    security_issues: List[SecurityIssue]
    
    # Auto-fixes
    fix_suggestions: List[FixSuggestion]
    
    # Metadata
    created_at: datetime


class ApplyFixRequest(BaseModel):
    """Request to apply a fix"""
    fix_id: str


class StyleProfile(BaseModel):
    """User's learned style profile"""
    user_id: int
    patterns: Dict[str, Any]
    confidence: float
