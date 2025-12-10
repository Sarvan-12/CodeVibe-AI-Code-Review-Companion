from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, database, auth
from analysis import language_analyzer, ml
from analysis.ml_engine import get_ml_engine
from services.auto_fixer import get_auto_fixer
from services.style_learner import get_style_learner

router = APIRouter(
    prefix="/analysis",
    tags=["analysis"],
    responses={404: {"description": "Not found"}},
)

@router.post("/submit", response_model=schemas.AnalysisResult)
def submit_code(
    snippet: schemas.SnippetCreate, 
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    """
    Submit code for analysis.
    Supports multiple languages: Python, JavaScript, TypeScript.
    """
    try:
        # 1. Detect language
        detected_lang = language_analyzer.detect_language(
            snippet.code_content, 
            hint=snippet.language
        )
        
        # 2. Save Snippet
        db_snippet = models.Snippet(
            user_id=current_user.id,
            code_content=snippet.code_content,
            language=detected_lang.value
        )
        db.add(db_snippet)
        db.commit()
        db.refresh(db_snippet)

        # 3. Get appropriate analyzer and run analysis
        analyzer = language_analyzer.get_analyzer(detected_lang)
        static_results = analyzer.analyze(snippet.code_content)
        
        # 4. Run ML Analysis (enhanced with real ML)
        ml_engine = get_ml_engine()
        ml_bugs = ml_engine.predict_bugs(snippet.code_content, detected_lang.value)
        ml_smells = ml_engine.detect_code_smells(snippet.code_content, detected_lang.value)
        ml_security = ml_engine.scan_security_vulnerabilities(snippet.code_content, detected_lang.value)
        
        # 5. Generate Auto-fix Suggestions
        auto_fixer = get_auto_fixer()
        fix_suggestions = auto_fixer.analyze_code(snippet.code_content, detected_lang.value)
        
        # 6. Learn Style Patterns
        style_learner = get_style_learner()
        patterns = style_learner.extract_patterns(snippet.code_content, detected_lang.value)
        style_learner.update_user_profile(current_user.id, patterns, db)
        
        # 7. Calculate Score (weighted by severity)
        base_score = 100.0
        issue_count = len(static_results.issues)
        bug_count = len(bugs)
        
        # Weight issues by severity
        severity_weights = {"error": 5, "warning": 2, "info": 1}
        weighted_deduction = sum(
            severity_weights.get(issue.get("severity", "info"), 1) 
            for issue in static_results.issues
        )
        
        deduction = weighted_deduction + (bug_count * 5)
        final_score = max(0.0, base_score - deduction)

        # 6. Save Results
        db_result = models.AnalysisResult(
            snippet_id=db_snippet.id,
            score=final_score,
            bugs_detected=bugs,
            refactor_suggestions=static_results.issues,
            complexity_metrics=static_results.complexity_metrics
        )
        db.add(db_result)
        db.commit()
        db.refresh(db_result)

        return db_result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/history", response_model=list[schemas.AnalysisResult])
def get_history(
    skip: int = 0,
    limit: int = 50,
    current_user: models.User = Depends(auth.get_current_user), 
    db: Session = Depends(database.get_db)
):
    """
    Get analysis history for current user with pagination.
    """
    results = (
        db.query(models.AnalysisResult)
        .join(models.Snippet)
        .filter(models.Snippet.user_id == current_user.id)
        .order_by(models.AnalysisResult.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return results

