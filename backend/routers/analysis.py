from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database, auth
from ..analysis import static, ml

router = APIRouter(
    prefix="/analysis",
    tags=["analysis"],
    responses={404: {"description": "Not found"}},
)

@router.post("/submit", response_model=schemas.AnalysisResult)
def submit_code(snippet: schemas.SnippetCreate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # 1. Save Snippet
    db_snippet = models.Snippet(
        user_id=current_user.id,
        code_content=snippet.code_content,
        language=snippet.language
    )
    db.add(db_snippet)
    db.commit()
    db.refresh(db_snippet)

    # 2. Run Static Analysis
    static_results = static.run_pylint_analysis(snippet.code_content)
    
    # 3. Run ML Analysis
    bugs = ml.predict_bugs(snippet.code_content)
    complexity = ml.calculate_complexity(snippet.code_content)

    # 4. Calculate Score (Simple formula)
    # Start with 100, deduct for issues
    base_score = 100.0
    issue_count = len(static_results.get("issues", []))
    bug_count = len(bugs)
    
    deduction = (issue_count * 2) + (bug_count * 5)
    final_score = max(0.0, base_score - deduction)

    # 5. Save Results
    db_result = models.AnalysisResult(
        snippet_id=db_snippet.id,
        score=final_score,
        bugs_detected=bugs,
        refactor_suggestions=static_results.get("issues", []), # Using pylint issues as suggestions for now
        complexity_metrics=complexity
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    return db_result

@router.get("/history", response_model=list[schemas.AnalysisResult])
def get_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Join Snippet to filter by user
    results = db.query(models.AnalysisResult).join(models.Snippet).filter(models.Snippet.user_id == current_user.id).all()
    return results
