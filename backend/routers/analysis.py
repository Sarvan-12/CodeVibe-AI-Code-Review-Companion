from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, database, auth
from analysis import language_analyzer, ml

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
        
        # 4. Run ML Analysis (still basic for now)
        bugs = ml.predict_bugs(snippet.code_content)
        
        # 5. Calculate Score
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

